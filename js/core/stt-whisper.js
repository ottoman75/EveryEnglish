/*
 * 폰 안 받아쓰기 — 마이크를 직접 녹음(getUserMedia)해 Whisper tiny.en(MIT, transformers.js Apache-2.0)으로 받아쓴다.
 *
 * 왜: iOS의 웹 음성 인식(webkitSpeechRecognition)은 한 페이지에서 첫 번째만 소리를 받는다.
 *     새 인식기·iframe·마이크 유지·연속 세션 모두 실기기에서 실패(tools/sr-lab.html 기록, 2026-11-24).
 *     직접 녹음은 매번 되고, 받아쓰기는 iPhone에서 문장당 약 1초(tools/whisper-lab.html).
 * 대가: 처음 한 번 모델 약 40MB를 받는다(브라우저 캐시에 남음), 라이브러리·모델은 인터넷에서 받는다.
 *
 * EESpeech.listen이 아이폰·아이패드에서 이것을 쓴다. 계약은 같다: { promise: Promise<string>, stop() }
 */
(function (root) {
    "use strict";

    var LIB_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2";
    var MODEL = "onnx-community/whisper-tiny.en";
    var SPEECH_RMS = 0.02;      // 이보다 크면 말소리로 본다
    var END_SILENCE_MS = 1200;  // 말이 시작된 뒤 이만큼 조용하면 끝
    var MAX_MS = 10000;         // 한 번에 최대 10초
    var RATE = 16000;           // Whisper 입력

    var asrPromise = null, asr = null, progressFns = [], files = {}, shownPct = 0;

    function load() {
        if (asrPromise) return asrPromise;
        asrPromise = import(LIB_URL).then(function (T) {
            T.env.allowLocalModels = false;
            return T.pipeline("automatic-speech-recognition", MODEL, {
                dtype: "q8", device: "wasm",
                progress_callback: function (p) {
                    if (p.status !== "progress" || !(p.total > 1e6)) return;   // 작은 설정 파일은 빼고(먼저 100%가 되어 진행률이 튄다)
                    files[p.file] = { loaded: p.loaded, total: p.total };     // 파일 여러 개를 합쳐 하나의 진행률로
                    var l = 0, t = 0;
                    Object.keys(files).forEach(function (k) { l += files[k].loaded; t += files[k].total; });
                    shownPct = Math.max(shownPct, Math.floor(l / t * 100));     // 새 파일이 늦게 잡혀도 뒤로 가지 않게
                    var msg = progressText(shownPct);
                    progressFns.forEach(function (fn) { fn(msg); });
                }
            });
        }).then(function (pipe) { asr = pipe; return pipe; });
        asrPromise.catch(function () { asrPromise = null; });   // 실패하면 다음에 다시 시도
        return asrPromise;
    }

    function progressText(pct) { return "음성 인식 준비 중(처음 한 번 약 40MB) " + pct + "%"; }

    function to16k(chunks, rate) {
        var n = 0, i, o = 0;
        for (i = 0; i < chunks.length; i++) n += chunks[i].length;
        var all = new Float32Array(n);
        for (i = 0; i < chunks.length; i++) { all.set(chunks[i], o); o += chunks[i].length; }
        if (rate === RATE || !n) return Promise.resolve(all);
        var Off = root.OfflineAudioContext || root.webkitOfflineAudioContext;
        var off = new Off(1, Math.ceil(n * RATE / rate), RATE);
        var b = off.createBuffer(1, n, rate);
        b.getChannelData(0).set(all);
        var s = off.createBufferSource();
        s.buffer = b; s.connect(off.destination); s.start();
        return off.startRendering().then(function (r) { return r.getChannelData(0); });
    }

    // Whisper가 무음·잡음에 붙이는 표시([BLANK_AUDIO], (music) 등)를 지운다
    function clean(text) {
        return String(text || "").replace(/\[[^\]]*\]|\([^)]*\)|\*[^*]*\*/g, " ").replace(/\s+/g, " ").trim();
    }

    function listen(onInterim) {
        var status = function (t) { if (onInterim) onInterim(t); };
        var stopFn = function () { cancelled = true; }, cancelled = false;
        var md = root.navigator.mediaDevices;
        if (!md || !md.getUserMedia) return { promise: Promise.reject(new Error("unsupported")), stop: function () {} };
        // 오디오 장치는 탭 안에서 바로 연다(아이폰은 탭 밖에서 만든 AudioContext를 멈춘 채로 둘 수 있다)
        var Ctx = root.AudioContext || root.webkitAudioContext, ctx = new Ctx();
        if (ctx.resume) ctx.resume();
        var promise = new Promise(function (resolve, reject) {
            // 모델이 준비된 뒤에 녹음한다 — 준비하는 동안 녹음하면 소리가 끊겨 받아쓰기가 망가졌다("Take take take…")
            var ready = asr ? Promise.resolve(asr) : (status(progressText(0)), progressFns.push(status), load());
            ready.then(function () {
                progressFns = progressFns.filter(function (fn) { return fn !== status; });
                if (cancelled) { ctx.close(); resolve(""); return null; }
                return md.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
            }, function (err) {
                progressFns = progressFns.filter(function (fn) { return fn !== status; });
                ctx.close();
                throw new Error("stt-load-failed: " + (err && err.message));
            }).then(function (stream) {
                if (!stream) return;
                if (ctx.resume) ctx.resume();
                var src = ctx.createMediaStreamSource(stream), proc = ctx.createScriptProcessor(4096, 1, 1);
                var chunks = [], spoke = false, quietSince = 0, t0 = Date.now(), done = false;
                function finish() {
                    if (done) return;
                    done = true;
                    try { proc.disconnect(); src.disconnect(); } catch (e) { /* 무시 */ }
                    stream.getTracks().forEach(function (t) { t.stop(); });     // 마이크를 바로 놓는다
                    var rate = ctx.sampleRate;
                    ctx.close().catch(function () {});
                    if (!spoke) { resolve(""); return; }                        // 말소리가 없으면 받아쓰지 않는다(무음 환각 방지)
                    status("받아쓰는 중…");
                    to16k(chunks, rate).then(function (f32) { return asr(f32); }).then(function (out) {
                        resolve(clean(out && out.text));
                    }, function (err) {
                        reject(new Error("stt-failed: " + (err && err.message)));
                    });
                }
                stopFn = finish;
                proc.onaudioprocess = function (e) {
                    if (done) return;
                    var d = e.inputBuffer.getChannelData(0), s = 0;
                    chunks.push(new Float32Array(d));
                    for (var i = 0; i < d.length; i++) s += d[i] * d[i];
                    var rms = Math.sqrt(s / d.length), now = Date.now();
                    if (rms > SPEECH_RMS) { spoke = true; quietSince = 0; }
                    else if (spoke && !quietSince) quietSince = now;
                    if ((spoke && quietSince && now - quietSince > END_SILENCE_MS) || now - t0 > MAX_MS) finish();
                };
                src.connect(proc);
                proc.connect(ctx.destination);
                status("듣고 있어요…");
            }).catch(function (err) {
                try { ctx.close(); } catch (e) { /* 무시 */ }
                if (err && /^stt-/.test(err.message)) reject(err);
                else reject(new Error(err && err.name === "NotAllowedError" ? "not-allowed" : "audio-capture"));
            });
        });
        return { promise: promise, stop: function () { stopFn(); } };
    }

    root.EEWhisper = { listen: listen, load: load };
})(window);
