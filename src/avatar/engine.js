/*
 * 3D 대화 상대 엔진 — three.js + @pixiv/three-vrm.
 * 빌드: npm run build:avatar → js/vendor/avatar.bundle.js (window.EEAvatarEngine)
 *
 * 앱 코드(js/app/avatar.js)는 이 엔진을 지연 로딩하고, 다음만 호출한다:
 *   const stage = EEAvatarEngine.createStage(hostEl)
 *   await stage.show(modelUrl)          모델 로드(캐시) 후 화면에 표시
 *   stage.speakAudio(audioEl)           녹음 음성에 맞춘 립싱크
 *   stage.speakSynthetic() / stopSpeaking()
 *   stage.react("correct" | "close" | "wrong")
 *   stage.dispose()
 */
import {
    WebGLRenderer, Scene, PerspectiveCamera, DirectionalLight, HemisphereLight, Timer, Vector3, SRGBColorSpace
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";

const MOUTH = ["aa", "ih", "ou", "ee", "oh"];
const CAMERA_FOV = 24;
const FRAME_DISTANCE = 1.35;          // 머리~어깨가 들어오는 거리(m)
const BLINK_MIN_S = 1.8, BLINK_MAX_S = 5.5;

let audioCtx = null;
const modelCache = new Map();         // url → Promise<gltf>

function webglSupported() {
    try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch (e) {
        return false;
    }
}

// 오디오 분석은 사용자 터치 이후 '실행 중'인 컨텍스트에서만 한다.
// 잠긴(suspended) 컨텍스트로 음성을 돌리면 소리가 안 나기 때문
function unlockAudio() {
    if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
}
["pointerdown", "touchend", "keydown"].forEach((ev) => window.addEventListener(ev, unlockAudio, { passive: true }));

function loadModel(url) {
    if (!modelCache.has(url)) {
        const loader = new GLTFLoader();
        loader.register((parser) => new VRMLoaderPlugin(parser));
        modelCache.set(url, loader.loadAsync(url).catch((e) => { modelCache.delete(url); throw e; }));
    }
    return modelCache.get(url);
}

function smoothstep(a, b, x) {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
}

function createStage(host) {
    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.domElement.className = "avatar-canvas";
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 20);
    const key = new DirectionalLight(0xffffff, 2.4);
    key.position.set(0.8, 1.6, 2.2);
    scene.add(key, new HemisphereLight(0xfff4ee, 0x8a7ca8, 1.4));

    const timer = new Timer();
    let vrm = null, url = null, raf = 0, visible = true, disposed = false;
    let speaking = null;               // { analyser, data } | { synthetic: true }
    const mouth = Object.fromEntries(MOUTH.map((k) => [k, 0]));
    let nextBlink = 2, blinkT = -1;
    let mood = { name: null, value: 0, until: 0 };
    let elapsed = 0;
    let lastRaw = null;

    function resize() {
        const w = host.clientWidth || 1, h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; });
    io.observe(host);

    function frame(target) {
        target.scene.updateMatrixWorld(true);
        const head = target.humanoid.getNormalizedBoneNode("head");
        const p = new Vector3();
        (head || target.scene).getWorldPosition(p);
        // 세로로 긴 화면(폰)에서는 조금 더 물러나 어깨까지 보이게
        // head 본은 목 위(턱 아래)에 있다 → 눈높이는 그보다 약 7cm 위
        const eyes = p.y + 0.07;
        const dist = FRAME_DISTANCE * (camera.aspect < 1 ? 1.3 / camera.aspect : 1);
        camera.position.set(0, eyes, dist);
        camera.lookAt(0, eyes - 0.09, 0);     // 얼굴을 위쪽 1/3에, 어깨까지 보이게
    }

    function relaxPose(target) {
        const h = target.humanoid;
        const set = (bone, x, y, z) => { const n = h.getNormalizedBoneNode(bone); if (n) n.rotation.set(x, y, z); };
        // T자 기본 자세에서 팔을 내리고 살짝 굽힌다
        set("leftUpperArm", 0, 0, -1.2);
        set("rightUpperArm", 0, 0, 1.2);
        set("leftLowerArm", 0, -0.25, 0);
        set("rightLowerArm", 0, 0.25, 0);
    }

    /** @param {{ hide?: string[] }} [opts] hide: 숨길 노드 이름 (예: 일상 장면에 안 맞는 장식) */
    async function show(modelUrl, opts) {
        if (url === modelUrl && vrm) return;
        const gltf = await loadModel(modelUrl);
        if (disposed) return;
        const next = gltf.userData.vrm;
        if (!next.__prepared) {
            VRMUtils.removeUnnecessaryVertices(next.scene);
            if (VRMUtils.combineSkeletons) VRMUtils.combineSkeletons(next.scene);
            VRMUtils.rotateVRM0(next);
            next.scene.traverse((o) => { o.frustumCulled = false; });
            ((opts && opts.hide) || []).forEach((name) => {
                const node = next.scene.getObjectByName(name);
                if (node) node.visible = false;
            });
            next.__prepared = true;
        }
        if (vrm) scene.remove(vrm.scene);
        vrm = next;
        url = modelUrl;
        relaxPose(vrm);
        if (vrm.lookAt) vrm.lookAt.target = camera;
        scene.add(vrm.scene);
        resize();
        frame(vrm);
        if (!raf) loop();
    }

    function setExpr(name, v) {
        const em = vrm && vrm.expressionManager;
        if (em && em.getExpression(name)) em.setValue(name, v);
    }

    function updateMouth(dt) {
        let target = { aa: 0, ih: 0, ou: 0, ee: 0, oh: 0 };
        if (speaking && speaking.analyser) {
            const { analyser, data, wave } = speaking;
            // 입 벌림: 파형의 실제 크기(RMS, 선형). 주파수 데이터는 dB 눈금이라 조용한 구간도 커 보여 입이 계속 열린다
            analyser.getFloatTimeDomainData(wave);
            let sq = 0;
            for (let i = 0; i < wave.length; i++) sq += wave[i] * wave[i];
            const rms = Math.sqrt(sq / wave.length);
            speaking.peak = Math.max(rms, speaking.peak * 0.995);          // 문장마다 음량이 달라도 같은 폭으로
            const open = smoothstep(0.18, 0.75, rms / speaking.peak);
            // 입 모양: 주파수 대역 비중 (측정값: 고음 비중 0.14~0.28, 저음 비중 0.42~0.60)
            analyser.getByteFrequencyData(data);
            const hz = audioCtx.sampleRate / 2 / data.length;
            const band = (lo, hi) => {
                let s = 0, n = 0;
                for (let i = Math.floor(lo / hz); i <= Math.min(data.length - 1, Math.ceil(hi / hz)); i++) { s += data[i]; n++; }
                return n ? s / n / 255 : 0;
            };
            const low = band(250, 900), mid = band(900, 2000), high = band(2000, 4200);
            lastRaw = { low, mid, high, rms, level: rms / speaking.peak };
            const total = low + mid + high + 1e-4;
            const ee = open * smoothstep(0.19, 0.3, high / total);        // 이/에
            const ou = open * smoothstep(0.47, 0.57, low / total) * 0.9;  // 우/오
            target = { aa: Math.max(0, open - Math.max(ee, ou) * 0.8), ee, ih: ee * 0.35, ou, oh: ou * 0.5 };
            // 모양이 겹쳐도 전체 벌림은 open(최대 0.9)을 넘지 않게 — 넘으면 입이 과장돼 보인다
            const sum = target.aa + target.ee + target.ih + target.ou + target.oh;
            const cap = open * 0.9;
            if (sum > cap && sum > 0) MOUTH.forEach((k) => { target[k] *= cap / sum; });
        } else if (speaking && speaking.synthetic) {
            // 녹음이 없을 때(기기 음성): 리듬만 흉내
            const o = 0.35 + 0.35 * Math.sin(elapsed * 17) * Math.sin(elapsed * 5.3);
            target = { aa: Math.max(0, o), ih: 0, ou: 0, ee: 0, oh: Math.max(0, o * 0.3) };
        }
        MOUTH.forEach((k) => {
            const rate = target[k] > mouth[k] ? 28 : 14;            // 열 때 빠르게, 닫을 때 부드럽게
            mouth[k] += (target[k] - mouth[k]) * Math.min(1, rate * dt);
            setExpr(k, mouth[k]);
        });
    }

    function updateBlink(dt) {
        if (blinkT < 0) {
            nextBlink -= dt;
            if (nextBlink <= 0) blinkT = 0;
        }
        let v = 0;
        if (blinkT >= 0) {
            blinkT += dt;
            const d = 0.16;
            v = blinkT < d / 2 ? blinkT / (d / 2) : Math.max(0, 1 - (blinkT - d / 2) / (d / 2));
            if (blinkT >= d) {
                blinkT = -1;
                nextBlink = BLINK_MIN_S + Math.random() * (BLINK_MAX_S - BLINK_MIN_S);
            }
        }
        // 웃을 때는 눈이 이미 감기므로 깜빡임을 줄인다
        setExpr("blink", v * (mood.name === "happy" ? 1 - mood.value : 1));
    }

    function updateMood(dt) {
        const now = performance.now();
        const goal = now < mood.until ? 1 : 0;
        mood.value += (goal * mood.peak - mood.value) * Math.min(1, 6 * dt);
        if (mood.name) setExpr(mood.name, mood.value);
        if (goal === 0 && mood.value < 0.01 && mood.name) { setExpr(mood.name, 0); mood.name = null; }
        // 평소에도 살짝 미소
        if (mood.name !== "happy") setExpr("relaxed", 0.25);
    }

    function updateIdle() {
        const h = vrm.humanoid;
        const t = elapsed;
        const talk = speaking ? 1 : 0;
        const neck = h.getNormalizedBoneNode("neck");
        const spine = h.getNormalizedBoneNode("spine");
        const chest = h.getNormalizedBoneNode("chest") || h.getNormalizedBoneNode("upperChest");
        if (neck) {
            neck.rotation.y = Math.sin(t * 0.6) * 0.05 + talk * Math.sin(t * 2.1) * 0.035;
            neck.rotation.x = Math.sin(t * 0.8) * 0.02 + talk * Math.sin(t * 3.3) * 0.025;
            neck.rotation.z = Math.sin(t * 0.45) * 0.025;
        }
        if (spine) spine.rotation.y = Math.sin(t * 0.35) * 0.02;
        if (chest) chest.rotation.x = Math.sin(t * 1.6) * 0.012;        // 숨쉬기
    }

    function loop() {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden || !vrm) return;
        timer.update();
        const dt = Math.min(timer.getDelta(), 0.1);
        elapsed += dt;
        updateIdle();
        updateBlink(dt);
        updateMood(dt);
        updateMouth(dt);
        vrm.update(dt);
        renderer.render(scene, camera);
    }

    function speakAudio(audio) {
        if (!audioCtx || audioCtx.state !== "running") { speakSynthetic(); return; }
        try {
            if (!audio.__eeSource) {
                audio.__eeSource = audioCtx.createMediaElementSource(audio);
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 1024;
                analyser.smoothingTimeConstant = 0.3;
                audio.__eeSource.connect(analyser);
                analyser.connect(audioCtx.destination);
                audio.__eeAnalyser = analyser;
            }
            const analyser = audio.__eeAnalyser;
            speaking = {
                analyser, data: new Uint8Array(analyser.frequencyBinCount),
                wave: new Float32Array(analyser.fftSize), peak: 0.05
            };
        } catch (e) {
            speakSynthetic();
        }
    }

    function speakSynthetic() { speaking = { synthetic: true }; }
    function stopSpeaking() { speaking = null; }

    const REACTIONS = {
        correct: { name: "happy", peak: 0.85, ms: 1600 },
        close: { name: "happy", peak: 0.45, ms: 1200 },
        wrong: { name: "sad", peak: 0.35, ms: 1300 }
    };
    function react(kind) {
        const r = REACTIONS[kind];
        if (!r) return;
        if (mood.name && mood.name !== r.name) setExpr(mood.name, 0);
        mood = { name: r.name, value: mood.name === r.name ? mood.value : 0, peak: r.peak, until: performance.now() + r.ms };
    }

    function dispose() {
        disposed = true;
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        if (vrm) scene.remove(vrm.scene);   // 모델은 캐시에 남겨 다음 장면에서 재사용
        renderer.dispose();
        renderer.domElement.remove();
    }

    // 점검용: 현재 입 모양·표정 값 (테스트·디버그에서만 읽는다)
    function debug() {
        return { raw: lastRaw, mouth: { ...mouth }, mood: mood.name, moodValue: mood.value, speaking: speaking ? (speaking.analyser ? "audio" : "synthetic") : null };
    }

    return { show, speakAudio, speakSynthetic, stopSpeaking, react, dispose, debug };
}

window.EEAvatarEngine = { supported: webglSupported(), createStage, unlockAudio };
