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
    // 지금 듣고 있는 인식기 — 하나만 존재해야 한다.
    // 아이폰 사파리는 결과를 준 뒤에도 onend를 늦게 주거나 안 주는 경우가 있어, 이전 세션이 남아 있으면
    // 다음 start()가 조용히 실패한다(사용자 보고: '첫 번째만 인식되고 이후 안 됨'). 그래서 종료를 기다리지 않는다.
    var activeRec = null;
    var SILENCE_MS = 1500;   // 말이 이만큼 멈추면 끝난 것으로 본다
    var MAX_MS = 10000;      // 한 번에 최대 10초

    function release(rec) {
        if (!rec) return;
        rec.onresult = rec.onerror = rec.onend = null;
        try { rec.abort(); } catch (e) { /* 이미 끝남 */ }
        if (activeRec === rec) activeRec = null;
    }

    /**
     * 한 문장 듣기. onInterim으로 중간 결과를 흘려준다.
     * 최종 결과·침묵·최대 시간 중 먼저 오는 것으로 끝내고, onend를 기다리지 않는다.
     * @returns {{ promise: Promise<string>, stop: Function }}
     */
    function listen(onInterim) {
        if (!canListen) return { promise: Promise.reject(new Error("unsupported")), stop: function () {} };
        stopSpeaking();
        release(activeRec);                       // 남아 있는 이전 세션을 먼저 정리
        var rec = new Recognition();
        rec.lang = "en-US";
        rec.interimResults = true;
        rec.maxAlternatives = 1;
        rec.continuous = false;
        activeRec = rec;
        var finalText = "", interimText = "", settled = false, silenceTimer = null, maxTimer = null;
        var resolveFn, rejectFn;
        var promise = new Promise(function (resolve, reject) { resolveFn = resolve; rejectFn = reject; });

        function finish(err) {
            if (settled) return;
            settled = true;
            clearTimeout(silenceTimer); clearTimeout(maxTimer);
            var text = (finalText || interimText).trim();   // 최종 결과가 없으면 마지막 중간 결과라도
            release(rec);
            if (err && !text) rejectFn(err); else resolveFn(text);
        }

        rec.onresult = function (e) {
            var interim = "", gotFinal = false;
            for (var i = e.resultIndex; i < e.results.length; i++) {
                var t = e.results[i][0].transcript;
                if (e.results[i].isFinal) { finalText += t; gotFinal = true; } else interim += t;
            }
            interimText = (finalText + " " + interim).trim();
            if (onInterim) onInterim(interimText);
            if (gotFinal && !interim) { finish(); return; }          // 최종 결과 → 바로 끝(onend를 기다리지 않음)
            clearTimeout(silenceTimer);
            silenceTimer = setTimeout(function () { finish(); }, SILENCE_MS);
        };
        rec.onerror = function (e) {
            if (e.error === "no-speech" || e.error === "aborted") finish();
            else finish(new Error(e.error));
        };
        rec.onend = function () { finish(); };
        maxTimer = setTimeout(function () { finish(); }, MAX_MS);
        try { rec.start(); } catch (e) { release(rec); return { promise: Promise.reject(e), stop: function () {} }; }
        return { promise: promise, stop: function () { finish(); } };
    }

    root.EESpeech = {
        speak: speak,
        stopSpeaking: stopSpeaking,
        listen: listen,
        canSpeak: !!synth || Object.keys(manifest.clips).length > 0,
        canListen: canListen,
        hasRecordedAudio: function () { return Object.keys(manifest.clips).length > 0; },
        hasClip: function (text) { return !!clipFor(text); },
        voices: englishVoices,
        on: function (type, fn) { speechListeners[type].push(fn); },
        off: function (type, fn) { speechListeners[type] = speechListeners[type].filter(function (f) { return f !== fn; }); },
        partnerVoice: function (speakerKey) { return (manifest.speakers || {})[speakerKey] || null; },
        voiceScore: voiceScore
    };
})(window);
