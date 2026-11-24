/*
 * 음성 출력/입력.
 *
 * 출력 우선순위
 *   1) 미리 녹음한 뉴럴 TTS 오디오 (audio/, js/data/audio-manifest.js) — 기기와 무관하게 같은 원어민 음성
 *   2) 브라우저 음성(speechSynthesis) 중 품질 점수가 가장 높은 영어 음성
 * 영어 음성이 없으면 말하지 않는다. 기본 음성이 한국어인 기기에서 한국어 음성이 영어를 읽으면
 * 억양이 완전히 틀려서, 차라리 무음이 낫다.
 *
 * 입력(SpeechRecognition): Chrome·Edge·Safari. https 또는 localhost에서만 동작.
 */
(function (root) {
    "use strict";

    var synth = root.speechSynthesis;
    var Recognition = root.SpeechRecognition || root.webkitSpeechRecognition;
    var DEFAULT_RATE = 0.95;          // 설정 기본값. 녹음 오디오는 이 값일 때 원래 속도(1.0)로 재생
    var VOICE_WAIT_MS = 1500;         // 음성 목록 비동기 로딩 대기 상한

    // ---------- 1) 녹음 오디오 ----------
    var manifest = root.EE_AUDIO || { base: "audio/", clips: {} };
    var currentAudio = null;

    // 말하기 시작/끝 알림 — 아바타 립싱크가 구독한다
    // start: { text, audio?: HTMLAudioElement (녹음일 때), synth: boolean }
    var speechListeners = { start: [], end: [], blocked: [] };
    function emit(type, info) { speechListeners[type].forEach(function (fn) { try { fn(info); } catch (e) { /* 구독자 오류가 재생을 막지 않게 */ } }); }

    function clipFor(text) {
        var key = String(text || "").trim();
        return manifest.clips[key] ? manifest.base + manifest.clips[key] : null;
    }

    // 오디오 요소는 하나만 만들어 계속 재사용한다.
    // iPhone은 '사용자가 탭해서 한 번 재생된 요소'만 나중에(타이머 뒤에) 소리를 낼 수 있게 허용한다.
    // 매번 new Audio()를 만들면 상대 대사(타이핑 연출 뒤 재생)가 전부 막혀 무음이 된다.
    var player = null;
    var unlocked = false;

    function getPlayer() {
        if (!player) {
            player = new Audio();
            player.preload = "auto";
            player.preservesPitch = true;
            player.setAttribute("playsinline", "");
        }
        return player;
    }

    // 0.05초 무음 WAV — 첫 탭에서 재생해 요소를 '허용된 상태'로 만든다
    function silentWavUrl() {
        var n = 400, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
        var w = function (o, str) { for (var i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
        w(0, "RIFF"); v.setUint32(4, 36 + n, true); w(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
        v.setUint16(22, 1, true); v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true);
        v.setUint16(34, 8, true); w(36, "data"); v.setUint32(40, n, true);
        for (var i = 0; i < n; i++) v.setUint8(44 + i, 128);
        return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
    }

    function unlockPlayback() {
        if (unlocked) return;
        var a = getPlayer();
        if (a.src && !a.paused) { unlocked = true; return; }   // 이미 재생 중이면 그 자체로 허용됨
        a.src = silentWavUrl();
        var p = a.play();
        if (p && p.then) p.then(function () { unlocked = true; }).catch(function () { /* 다음 탭에서 다시 */ });
        else unlocked = true;
    }
    ["touchend", "pointerup", "click", "keydown"].forEach(function (ev) {
        root.addEventListener(ev, unlockPlayback, { capture: true, passive: true });
    });

    function playClip(src, rate, who) {
        return new Promise(function (resolve) {
            stopSpeaking();
            var a = getPlayer();
            var done = false;
            var finish = function () {
                if (done) return;
                done = true;
                if (currentAudio === a) currentAudio = null;
                emit("end", { text: src });
                resolve();
            };
            a.onended = finish;
            a.onerror = finish;
            a.onplay = function () { emit("start", { text: src, audio: a, src: src, synth: false, who: who }); };
            a.src = src;
            a.playbackRate = Math.max(0.5, Math.min(2, rate / DEFAULT_RATE));
            currentAudio = a;
            var p = a.play();
            if (p && p.catch) {
                p.catch(function (err) {
                    // 자동재생 차단: 화면이 '탭해서 듣기'를 띄울 수 있게 알린다
                    if (err && err.name === "NotAllowedError") emit("blocked", { src: src, who: who, rate: rate });
                    a.onplay = null;
                    done = true;
                    if (currentAudio === a) currentAudio = null;
                    resolve({ blocked: true });
                });
            }
        });
    }

    // ---------- 2) 브라우저 음성 ----------
    // 이름만 '영어'이고 실제로는 장난감·구형 합성기인 음성들 (macOS 기본 설치)
    var NOVELTY = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Wobble|Fred|Good News|Jester|Junior|Organ|Superstar|Trinoids|Whisper|Zarvox|Ralph|Kathy|Grandma|Grandpa|Rocko|Eddy|Flo|Reed|Sandy|Shelley)\b/i;

    function voiceScore(v) {
        if (!/^en[-_]/i.test(v.lang)) return -Infinity;
        var s = 0;
        if (/^en[-_]US/i.test(v.lang)) s += 3;
        else if (/^en[-_](GB|AU|CA)/i.test(v.lang)) s += 1;
        if (/Natural|Neural/i.test(v.name)) s += 12;         // Edge·Windows 뉴럴 음성
        if (/Premium/i.test(v.name)) s += 10;                // Apple 프리미엄
        if (/Enhanced|Siri/i.test(v.name)) s += 8;           // Apple 고품질
        if (/^Google/i.test(v.name)) s += 7;                 // Chrome 네트워크 음성
        if (/\b(Aria|Jenny|Guy|Ava|Zoe|Allison|Evan|Nathan|Tom|Susan)\b/i.test(v.name)) s += 4;
        if (/^Samantha\b/i.test(v.name)) s += 2;
        if (NOVELTY.test(v.name)) s -= 20;
        return s;
    }

    function englishVoices() {
        if (!synth) return [];
        return synth.getVoices()
            .filter(function (v) { return voiceScore(v) > -Infinity; })
            .sort(function (a, b) { return voiceScore(b) - voiceScore(a); });
    }

    var voicesReady = new Promise(function (resolve) {
        if (!synth) return resolve();
        if (synth.getVoices().length) return resolve();
        var done = function () { resolve(); };
        if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", done, { once: true });
        setTimeout(done, VOICE_WAIT_MS);
    });

    function pickVoice(voiceURI) {
        var voices = englishVoices();
        if (voiceURI) {
            var chosen = voices.find(function (v) { return v.voiceURI === voiceURI; });
            if (chosen) return chosen;
        }
        return voices.find(function (v) { return !NOVELTY.test(v.name); }) || null;
    }

    function synthSpeak(text, rate, voiceURI, who) {
        return voicesReady.then(function () {
            return new Promise(function (resolve) {
                var voice = pickVoice(voiceURI);
                if (!voice) return resolve();
                stopSpeaking();
                var u = new SpeechSynthesisUtterance(text);
                u.voice = voice;
                u.lang = voice.lang;
                u.rate = rate;
                u.onstart = function () { emit("start", { text: text, synth: true, who: who }); };
                u.onend = u.onerror = function () { emit("end", { text: text }); resolve(); };
                synth.speak(u);
            });
        });
    }

    // ---------- 공개 API ----------
    function speak(text, options) {
        if (!text) return Promise.resolve();
        var settings = (root.EEStore && root.EEStore.get().settings) || {};
        var rate = (options && options.rate) || settings.rate || DEFAULT_RATE;
        var src = settings.voiceURI ? null : clipFor(text); // 사용자가 브라우저 음성을 직접 고르면 그 음성으로
        var who = options && options.who;   // "partner"면 아바타가 입을 움직인다
        if (src) return playClip(src, rate, who);
        if (!synth) return Promise.resolve();
        return synthSpeak(text, rate, settings.voiceURI, who);
    }

    function stopSpeaking() {
        if (currentAudio) {
            var a = currentAudio;
            currentAudio = null;
            a.onended = a.onerror = a.onplay = null;
            a.pause();
            emit("end", {});
        }
        if (synth) synth.cancel();
    }

    var canListen = !!Recognition && (root.isSecureContext !== false);

    /**
     * 한 문장 듣기. onInterim으로 중간 결과를 흘려준다.
     * @returns {{ promise: Promise<string>, stop: Function }}
     */
    /*
     * 음성 인식 — 인식기는 페이지 전체에서 하나만 만들어 재사용한다.
     * 아이폰 사파리: (1) 결과 뒤 onend를 늦게/안 준다 (2) abort()해도 마이크를 바로 놓지 않는다
     * (사용자 보고: 첫 번째 이후 인식 안 됨, 다이내믹 아일랜드에 마이크 표시가 계속 켜짐).
     * 그래서 새 인식기를 만들지 않고, 끝낼 때는 stop()으로 정상 종료를 요청하고,
     * 다음 시작은 onend(=마이크 해제)를 받은 뒤에 한다.
     */
    var SILENCE_MS = 1500;   // 말이 이만큼 멈추면 끝난 것으로 본다
    var MAX_MS = 10000;      // 한 번에 최대 10초
    var END_WAIT_MS = 1500;  // 이전 세션 종료(onend)를 기다리는 최대 시간
    var rec = null, recRunning = false, current = null, endWaiters = [];
    var stopRequested = false;   // stop()은 세션당 한 번만 — 두 번 보내면 onend가 두 번 와서 다음 요청을 끝내 버린다
    var runSession = null;   // 지금 인식기를 '돌리고 있는' 요청 — 결과·끝 신호는 이 요청에만 보낸다
                             // (늦게 온 이전 onend가 새 요청을 끝내 버리는 문제가 있었다)
    var debugLog = [];

    // 진단 기록 첫 줄: 어떤 코드 버전이 돌고 있는지(폰 캐시로 예전 코드가 도는 경우를 가려낸다)
    var SCRIPT_VER = (function () {
        var cs = document.currentScript;
        var m = cs && /[?&]v=([^&]+)/.exec(cs.src);
        return m ? m[1] : "dev";
    })();
    var loggedHeader = false;

    function log(msg) {
        if (!loggedHeader) {
            loggedHeader = true;
            var ios = /OS (\d+)_(\d+)/.exec(navigator.userAgent);
            log("speech.js v=" + SCRIPT_VER + " · 새인식기방식 · audioSession " + (navigator.audioSession ? "있음" : "없음") +
                (ios ? " · iOS " + ios[1] + "." + ios[2] : ""));
        }
        var line = (performance.now() / 1000).toFixed(1) + "s " + msg;
        debugLog.push(line);
        if (debugLog.length > 40) debugLog.shift();
        if (root.EESpeechDebug) root.EESpeechDebug(line);
    }

    // 인식기는 매번 새로 만든다(아이폰은 끝난 인식기를 다시 start()하면 audiostart까지만 가고 결과가 없다 — 실기기 로그).
    // 단, 이전 인식기가 onend로 마이크를 놓은 뒤에 만든다(놓기 전에 만들면 마이크를 못 잡는다).
    function newRec() {
        var r = new Recognition();
        r.lang = "en-US";
        r.interimResults = true;
        r.maxAlternatives = 1;
        r.continuous = false;
        r.onstart = function () { log("start"); };
        r.onaudiostart = function () { log("audiostart"); };
        r.onspeechstart = function () { log("speechstart"); };
        r.onresult = function (e) { if (r.__session) r.__session.onresult(e); };
        r.onerror = function (e) { log("error " + e.error); if (r.__session) r.__session.onerror(e); };
        r.onend = function () {
            log("end");
            var s = r.__session; r.__session = null;
            if (rec === r) { recRunning = false; runSession = null; }
            restoreAudioSession();
            if (s) s.onend();
            var w = endWaiters; endWaiters = [];
            w.forEach(function (fn) { fn(); });
        };
        return r;
    }

    // 아이폰: 음성을 재생하고 나면 오디오 세션이 '재생 전용'이 되어 다음 녹음에 소리가 안 들어온다
    // (실기기 로그: audiostart 후 speechstart·결과 없음). 듣는 동안만 '녹음+재생'으로 바꾸고 재생기를 내려놓는다.
    function prepareAudioForListening() {
        if (player) {
            // src는 지우지 않는다 — 공유 재생기의 자동재생 허용(아이폰 첫 탭 잠금 해제)이 풀릴 수 있다
            try { player.pause(); } catch (e) { /* 무시 */ }
            log("재생기 정지");
        }
        if (synth) synth.cancel();
        try {
            if (navigator.audioSession) { navigator.audioSession.type = "play-and-record"; log("audioSession=play-and-record"); }
        } catch (e) { log("audioSession 실패 " + e.name); }
    }
    function restoreAudioSession() {
        // 녹음+재생 모드로 두면 이후 음성이 수화기(작은 스피커)로 나갈 수 있어 원래대로
        try { if (navigator.audioSession && navigator.audioSession.type !== "auto") navigator.audioSession.type = "auto"; } catch (e) { /* 무시 */ }
    }

    // 지금 돌고 있는 세션이 있으면 정상 종료를 요청하고 onend(또는 시간 초과)를 기다린다
    function whenIdle() {
        return new Promise(function (resolve) {
            if (!recRunning) { resolve(); return; }
            var done = false;
            var go = function () { if (!done) { done = true; resolve(); } };
            endWaiters.push(go);
            if (rec) requestStop(rec);
            setTimeout(function () {
                if (done) return;
                log("end 대기 초과 → abort");
                try { if (rec) rec.abort(); } catch (e) { /* 무시 */ }
                setTimeout(function () { recRunning = false; go(); }, 300);
            }, END_WAIT_MS);
        });
    }

    function requestStop(r) {
        if (stopRequested) return;
        stopRequested = true;
        try { r.stop(); } catch (e) { /* 이미 끝남 */ }
    }

    function tryStart(session) {
        prepareAudioForListening();
        var r = newRec();
        r.__session = session;
        try { r.start(); rec = r; runSession = session; recRunning = true; stopRequested = false; session.rec = r; log("start() 호출"); return true; }
        catch (e) { log("start() 실패 " + e.name); return false; }
    }

    /**
     * 한 문장 듣기. onInterim으로 중간 결과를 흘려준다.
     * 최종 결과·침묵·최대 시간 중 먼저 오는 것으로 끝내고, 끝낼 때는 stop()으로 마이크를 놓는다.
     * @returns {{ promise: Promise<string>, stop: Function }}
     */
    function listen(onInterim) {
        if (!canListen) return { promise: Promise.reject(new Error("unsupported")), stop: function () {} };
        stopSpeaking();
        if (current) current.finish();             // 이전 듣기 요청은 마무리
        var finalText = "", interimText = "", settled = false, silenceTimer = null, maxTimer = null;
        var resolveFn, rejectFn;
        var promise = new Promise(function (resolve, reject) { resolveFn = resolve; rejectFn = reject; });
        var session = {
            finish: function (err) {
                if (settled) return;
                settled = true;
                clearTimeout(silenceTimer); clearTimeout(maxTimer);
                if (current === session) current = null;
                // 내가 돌리던 세션이면 마이크 해제 요청(abort 아님 — 아이폰은 abort로 마이크를 놓지 않는다)
                if (runSession === session && recRunning && session.rec) requestStop(session.rec);
                var text = (finalText || interimText).trim();   // 최종 결과가 없으면 마지막 중간 결과라도
                if (err && !text) rejectFn(err); else resolveFn(text);
            },
            onresult: function (e) {
                var interim = "", gotFinal = false;
                for (var i = e.resultIndex; i < e.results.length; i++) {
                    var t = e.results[i][0].transcript;
                    if (e.results[i].isFinal) { finalText += t; gotFinal = true; } else interim += t;
                }
                interimText = (finalText + " " + interim).trim();
                log("result " + (gotFinal ? "final" : "interim") + " \"" + interimText.slice(0, 30) + "\"");
                if (onInterim) onInterim(interimText);
                if (gotFinal && !interim) { session.finish(); return; }
                clearTimeout(silenceTimer);
                silenceTimer = setTimeout(function () { session.finish(); }, SILENCE_MS);
            },
            onerror: function (e) {
                if (e.error === "no-speech" || e.error === "aborted") session.finish();
                else session.finish(new Error(e.error));
            },
            onend: function () { session.finish(); }
        };
        current = session;
        maxTimer = setTimeout(function () { session.finish(); }, MAX_MS);
        // 쉬고 있으면 바로(사용자 탭 안에서) 시작, 이전 세션이 남아 있으면 끝나길 기다렸다 시작
        if (recRunning || !tryStart(session)) {
            whenIdle().then(function () {
                if (settled) return;
                if (!tryStart(session)) session.finish(new Error("start-failed"));
            });
        }
        return { promise: promise, stop: function () { session.finish(); } };
    }

    root.EESpeech = {
        speak: speak,
        stopSpeaking: stopSpeaking,
        listen: listen,
        canSpeak: !!synth || Object.keys(manifest.clips).length > 0,
        canListen: canListen,
        debugLog: function () { return debugLog.slice(); },
        hasRecordedAudio: function () { return Object.keys(manifest.clips).length > 0; },
        hasClip: function (text) { return !!clipFor(text); },
        voices: englishVoices,
        on: function (type, fn) { speechListeners[type].push(fn); },
        off: function (type, fn) { speechListeners[type] = speechListeners[type].filter(function (f) { return f !== fn; }); },
        partnerVoice: function (speakerKey) { return (manifest.speakers || {})[speakerKey] || null; },
        voiceScore: voiceScore
    };
})(window);

/* 음성 인식 진단: 주소에 ?srdebug 를 붙이면 화면 아래에 인식 과정(start/audiostart/result/end/error)을 표시 — 실기기 문제 확인용 */
(function (root) {
    if (!/[?&]srdebug/.test(root.location.search)) return;
    var box = null;
    root.EESpeechDebug = function (line) {
        if (!box) {
            box = document.createElement("pre");
            box.style.cssText = "position:fixed;left:6px;right:6px;bottom:6px;max-height:30vh;overflow:auto;z-index:9999;margin:0;" +
                "padding:8px;border-radius:10px;background:rgba(0,0,0,.82);color:#9f9;font:11px/1.35 ui-monospace,monospace;pointer-events:none";
            document.body.appendChild(box);
        }
        box.textContent += line + "\n";
        box.scrollTop = box.scrollHeight;
    };
})(window);
