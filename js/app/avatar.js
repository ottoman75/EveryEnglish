/*
 * 3D 대화 상대 — 화면 쪽 연결.
 *  - 엔진(js/vendor/avatar.bundle.js, ~200KB gzip)과 모델(assets/avatars/*.vrm)은 롤플레이에 들어갈 때만 불러온다
 *  - 등장인물 성별(js/data/cast.js)에 맞는 모델을 고른다. 같은 챕터의 같은 인물은 항상 같은 모델
 *  - 실패하면(구형 기기·WebGL 없음·file://) 조용히 빠지고 기존 채팅 화면만 남는다
 */
(function (root) {
    "use strict";
    var BUNDLE = "js/vendor/avatar.bundle.js";
    var enginePromise = null;

    function enabled() {
        var s = root.EEStore.get().settings;
        return s.avatar !== false && (root.EE_AVATARS || []).length > 0;
    }

    function loadEngine() {
        if (root.EEAvatarEngine) return Promise.resolve(root.EEAvatarEngine);
        if (!enginePromise) {
            enginePromise = new Promise(function (resolve, reject) {
                var s = document.createElement("script");
                var stamp = (document.querySelector('script[src*="js/app/avatar.js"]') || {}).src || "";
                var v = /[?&]v=(\w+)/.exec(stamp);
                s.src = BUNDLE + (v ? "?v=" + v[1] : "");
                s.onload = function () { root.EEAvatarEngine ? resolve(root.EEAvatarEngine) : reject(new Error("engine")); };
                s.onerror = function () { enginePromise = null; reject(new Error("engine load failed")); };
                document.head.appendChild(s);
            });
        }
        return enginePromise;
    }

    function hash(str) {
        var h = 2166136261;
        for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
        return h >>> 0;
    }

    /** 인물 → 모델. 성별이 맞는 모델 중에서 인물 이름 해시로 고정 선택 */
    function modelFor(speakerKey) {
        var gender = (root.EE_CAST || {})[speakerKey] || "f";
        var list = root.EE_AVATARS || [];
        var pool = list.filter(function (a) { return a.gender === gender; });
        if (!pool.length) pool = list;
        return pool[hash(speakerKey) % pool.length];
    }

    /**
     * 롤플레이 장면에 아바타 무대를 붙인다.
     * @returns {{ setSpeaker(key, name), react(verdict), destroy() } | null}
     */
    function attach(container) {
        if (!enabled()) return null;
        container.innerHTML =
            '<div class="avatar-stage loading"><div class="avatar-loading" aria-hidden="true"><span class="spinner"></span>대화 상대를 불러오는 중…</div>' +
            '<div class="avatar-caption en" aria-hidden="true"></div>' +
            '<button class="avatar-tap" type="button" hidden>🔊 탭해서 대화 듣기</button>' +
            '<span class="avatar-name"></span><span class="avatar-credit"></span></div>';
        var host = container.querySelector(".avatar-stage");
        var nameEl = host.querySelector(".avatar-name");
        var creditEl = host.querySelector(".avatar-credit");
        var captionEl = host.querySelector(".avatar-caption");
        var tapBtn = host.querySelector(".avatar-tap");
        var lastLine = "", captionTimer = null;

        function showCaption(text) {
            clearTimeout(captionTimer);
            captionEl.textContent = text;
            captionEl.classList.toggle("on", !!text);
        }
        function hideCaptionSoon(ms) {
            clearTimeout(captionTimer);
            captionTimer = setTimeout(function () { captionEl.classList.remove("on"); }, ms);
        }
        // 자동재생이 막힌 기기(첫 진입 직후의 iPhone 등): 탭 한 번이면 이후 대사는 자동으로 나온다
        tapBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            tapBtn.hidden = true;
            if (lastLine) root.EESpeech.speak(lastLine, { who: "partner" });
        });
        var stage = null, alive = true, pendingKey = null, pendingName = "";
        var offStart, offEnd;

        function apply(key, name) {
            var m = modelFor(key);
            nameEl.textContent = name || "";
            if (!stage || !m) return;
            creditEl.textContent = m.credit ? "Model: " + m.credit : "";
            host.classList.add("loading");
            stage.show(m.file, { hide: m.hide || [] }).then(function () {
                if (alive) host.classList.remove("loading");
            }).catch(function (e) { fail(e); });
        }

        function fail(err) {
            root.EEAvatar.lastError = String((err && err.message) || err || "unknown");
            if (root.console) console.warn("[EEAvatar] 3D 대화 상대를 끕니다:", root.EEAvatar.lastError);
            alive = false;
            container.innerHTML = "";        // 아바타 없이 계속
        }

        loadEngine().then(function (engine) {
            if (!alive) return;
            if (!engine.supported) { fail("WebGL not supported"); return; }
            stage = engine.createStage(host);
            if (pendingKey) apply(pendingKey, pendingName);
        }).catch(fail);  // 엔진 로딩 실패

        var speakingPartner = false;
        var onStart = function (info) {
            speakingPartner = info.who === "partner";
            if (!speakingPartner) return;
            tapBtn.hidden = true;
            host.classList.add("talking");
            if (lastLine) showCaption(lastLine);
            if (!stage) return;
            if (info.audio) stage.speakAudio(info.audio, info.src); else stage.speakSynthetic();
        };
        var onEnd = function () {
            if (stage) stage.stopSpeaking();
            if (speakingPartner) hideCaptionSoon(1500);
            speakingPartner = false;
            host.classList.remove("talking");
        };
        var onBlocked = function (info) {
            if (info.who !== "partner") return;
            tapBtn.hidden = false;
            if (lastLine) showCaption(lastLine);
        };
        root.EESpeech.on("start", onStart);
        root.EESpeech.on("end", onEnd);
        root.EESpeech.on("blocked", onBlocked);
        offStart = onStart; offEnd = onEnd;

        return {
            setSpeaker: function (key, name) {
                pendingKey = key; pendingName = name;
                apply(key, name);
            },
            react: function (verdict) { if (stage) stage.react(verdict); },
            /** 상대가 이제 말할 문장 — 자막으로 띄우고, 자동재생이 막히면 '탭해서 듣기'에 쓴다 */
            line: function (text, willSpeak) {
                lastLine = text;
                showCaption(text);
                if (!willSpeak) hideCaptionSoon(3500);
            },
            debug: function () { return stage && stage.debug ? stage.debug() : null; },
            destroy: function () {
                alive = false;
                root.EESpeech.off("start", offStart);
                root.EESpeech.off("end", offEnd);
                root.EESpeech.off("blocked", onBlocked);
                clearTimeout(captionTimer);
                if (stage) stage.dispose();
                stage = null;
            }
        };
    }

    root.EEAvatar = { attach: attach, enabled: enabled, modelFor: modelFor };
})(window);
