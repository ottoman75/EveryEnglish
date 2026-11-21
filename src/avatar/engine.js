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
// 입 모양 판정용 영점교차율 경계 — Kokoro 녹음 유성음 실측(2026-11-21): p25 0.027 · p50 0.041 · p75 0.06 · p90 0.105
// 상위 ~25%는 이/에, 하위 ~25%는 우/오, 나머지는 아
const EE_ZCR = [0.055, 0.095];
const OU_ZCR = [0.022, 0.034];

const ANALYSIS_FPS = 60;
const analysisCache = new Map();      // src → Promise<{ level: Float32Array, zcr: Float32Array }>
const modelCache = new Map();         // url → Promise<gltf>

function webglSupported() {
    try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch (e) {
        return false;
    }
}

/*
 * 립싱크 분석: 재생 중인 오디오를 Web Audio로 돌리지 않고, 같은 녹음 파일을 따로 받아 미리 분석한다.
 * (iPhone은 AudioContext가 잠기면 그쪽으로 돌린 소리가 통째로 사라진다 — 소리 재생을 분석에 의존하지 않기 위해)
 * 프레임(1/60초)마다 RMS 음량과 영점교차율(ZCR, 높을수록 '이/스' 같은 날카로운 소리)을 계산한다.
 */
function analyzeClip(src) {
    if (!analysisCache.has(src)) {
        const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        const job = fetch(src).then((r) => r.arrayBuffer()).then((buf) => new Promise((resolve, reject) => {
            const ctx = new Offline(1, 2, 24000);
            const p = ctx.decodeAudioData(buf, resolve, reject);   // 구형 Safari는 콜백 방식만 지원
            if (p && p.then) p.then(resolve, reject);
        })).then((audio) => {
            const x = audio.getChannelData(0), sr = audio.sampleRate;
            const hop = Math.floor(sr / ANALYSIS_FPS), win = hop * 2;
            const n = Math.max(1, Math.floor(x.length / hop));
            const rms = new Float32Array(n), zcr = new Float32Array(n);
            for (let f = 0; f < n; f++) {
                let sq = 0, zc = 0;
                const s0 = f * hop, s1 = Math.min(x.length, s0 + win);
                for (let i = s0; i < s1; i++) {
                    sq += x[i] * x[i];
                    if (i > s0 && (x[i] >= 0) !== (x[i - 1] >= 0)) zc++;
                }
                rms[f] = Math.sqrt(sq / Math.max(1, s1 - s0));
                zcr[f] = zc / Math.max(1, s1 - s0);
            }
            // 문장 안에서 상대값으로 (95번째 백분위를 최대로) — 녹음마다 음량이 달라도 같은 폭으로 움직이게
            const sorted = Array.from(rms).sort((p, q) => p - q);
            const peak = sorted[Math.floor(sorted.length * 0.95)] || 1e-4;
            const level = rms.map((v) => Math.min(1.2, v / peak));
            return { level, zcr };
        });
        job.catch(() => analysisCache.delete(src));
        analysisCache.set(src, job);
    }
    return analysisCache.get(src);
}

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
    let talkLevel = 0;
    let speakToken = 0;                 // 말하는 세기(0~1) — 고개 끄덕임·몸짓에 쓴다

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
        if (speaking && speaking.track) {
            const { track, audio } = speaking;
            const i = Math.min(track.level.length - 1, Math.max(0, Math.floor(audio.currentTime * ANALYSIS_FPS)));
            const level = track.level[i], zcr = track.zcr[i];
            const open = smoothstep(0.18, 0.75, level);
            lastRaw = { level, zcr };
            const ee = open * smoothstep(EE_ZCR[0], EE_ZCR[1], zcr);           // 날카로운 소리 → 이/에
            const ou = open * (1 - smoothstep(OU_ZCR[0], OU_ZCR[1], zcr)) * 0.9; // 둔한 소리 → 우/오
            target = { aa: Math.max(0, open - Math.max(ee, ou) * 0.8), ee, ih: ee * 0.35, ou, oh: ou * 0.5 };
            const sum = target.aa + target.ee + target.ih + target.ou + target.oh;
            const cap = open * 0.9;
            if (sum > cap && sum > 0) MOUTH.forEach((k) => { target[k] *= cap / sum; });
            talkLevel += (open - talkLevel) * Math.min(1, 12 * dt);
        } else if (speaking && speaking.synthetic) {
            // 녹음이 없을 때(기기 음성): 리듬만 흉내
            const o = 0.35 + 0.35 * Math.sin(elapsed * 17) * Math.sin(elapsed * 5.3);
            target = { aa: Math.max(0, o), ih: 0, ou: 0, ee: 0, oh: Math.max(0, o * 0.3) };
            talkLevel += (Math.max(0, o) - talkLevel) * Math.min(1, 12 * dt);
        }
        if (!speaking) talkLevel += (0 - talkLevel) * Math.min(1, 6 * dt);
        MOUTH.forEach((k) => {
            const rate = target[k] > mouth[k] ? 28 : 14;            // 열 때 빠르게, 닫을 때 부드럽게
            mouth[k] += (target[k] - mouth[k]) * Math.min(1, rate * dt);
        });
        // 모양이 바뀌는 순간 각 값이 따로 부드러워지며 합이 넘칠 수 있다 → 전체 벌림 상한
        const total = MOUTH.reduce((n, k) => n + mouth[k], 0);
        if (total > 0.9) MOUTH.forEach((k) => { mouth[k] *= 0.9 / total; });
        MOUTH.forEach((k) => setExpr(k, mouth[k]));
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
        if (mood.name === "happy" || mood.name === "sad") setExpr("relaxed", 0);
    }

    function updateIdle() {
        const h = vrm.humanoid;
        const t = elapsed;
        const talking = speaking ? 1 : 0;
        const bone = (n) => h.getNormalizedBoneNode(n);
        const neck = bone("neck"), head = bone("head"), spine = bone("spine");
        const chest = bone("chest") || bone("upperChest");
        if (neck) {
            // 음절 세기만큼 고개를 살짝 숙였다 드는 '말하는 끄덕임' + 느린 좌우 시선 이동
            neck.rotation.x = Math.sin(t * 0.8) * 0.02 + talkLevel * 0.06;
            neck.rotation.y = Math.sin(t * 0.6) * 0.06 + talking * Math.sin(t * 1.7) * 0.05;
            neck.rotation.z = Math.sin(t * 0.45) * 0.03 + talking * Math.sin(t * 1.3) * 0.025;
        }
        if (head) head.rotation.x = talking * Math.sin(t * 4.1) * 0.012;
        if (spine) {
            spine.rotation.y = Math.sin(t * 0.35) * 0.03;
            spine.rotation.x = talking * 0.025;                              // 말할 때 상대 쪽으로 살짝 기울기
        }
        if (chest) chest.rotation.x = Math.sin(t * 1.6) * 0.015;             // 숨쉬기
        // 말하는 동안 손짓: 팔꿈치를 조금씩 굽혔다 편다
        const la = bone("leftLowerArm"), ra = bone("rightLowerArm");
        const lu = bone("leftUpperArm"), ru = bone("rightUpperArm");
        const g = talking * (0.5 + talkLevel);
        if (la) la.rotation.y = -0.25 - g * (0.18 + Math.sin(t * 2.3) * 0.12);
        if (ra) ra.rotation.y = 0.25 + g * (0.22 + Math.sin(t * 2.7 + 1) * 0.14);
        if (lu) lu.rotation.z = -1.2 + Math.sin(t * 0.9) * 0.02 + g * 0.06;
        if (ru) ru.rotation.z = 1.2 - Math.sin(t * 1.1) * 0.02 - g * 0.08;
        if (mood.name !== "happy" && mood.name !== "sad") setExpr("relaxed", 0.2 + talking * 0.2);
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

    function speakAudio(audio, src) {
        speaking = { synthetic: true };
        const token = (speakToken = (speakToken || 0) + 1);
        analyzeClip(src || audio.currentSrc || audio.src).then((track) => {
            if (token === speakToken && speaking) speaking = { track, audio };
        }).catch(() => { /* 분석 실패 시 리듬 흉내 유지 */ });
    }

    function speakSynthetic() { speaking = { synthetic: true }; }
    function stopSpeaking() { speaking = null; speakToken = (speakToken || 0) + 1; }

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
        return { raw: lastRaw, mouth: { ...mouth }, mood: mood.name, moodValue: mood.value, speaking: speaking ? (speaking.track ? "audio" : "synthetic") : null };
    }

    return { show, speakAudio, speakSynthetic, stopSpeaking, react, dispose, debug };
}

// unlockAudio: 예전 API 호환용(이제 Web Audio를 쓰지 않으므로 할 일 없음)
window.EEAvatarEngine = { supported: webglSupported(), createStage, unlockAudio: () => {}, analyzeClip };
