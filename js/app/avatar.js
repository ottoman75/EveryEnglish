/*
 * 대화 상대 — 화면 쪽 연결. 인물마다 두 가지 중 하나로 보여준다:
 *  1) 2D 말하는 초상화 (js/app/portrait.js) — assets/portraits/portraits.js에 그 인물의 이미지가 있으면 우선
 *  2) 3D VRM 아바타 (js/vendor/avatar.bundle.js) — 초상화가 없을 때
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
        var portraits = root.EE_PORTRAITS && Object.keys(root.EE_PORTRAITS.characters || {}).length;
        return s.avatar !== false && ((root.EE_AVATARS || []).length > 0 || !!portraits);
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

    /** 인물 → 초상화 정의 (없으면 null → 3D) */
    function portraitFor(speakerKey) {
        var P = root.EE_PORTRAITS;
        if (!P || !P.cast) return null;
        var id = P.cast[speakerKey];
        return id && P.characters[id] ? Object.assign({ id: id }, P.characters[id]) : null;
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
        var stage3d = null, portrait = null, active = null, alive = true;
        var offStart, offEnd;

        function ensure3d() {
            if (stage3d) return Promise.resolve(stage3d);
            return loadEngine().then(function (engine) {
                if (!engine.supported) throw new Error("WebGL not supported");
                if (!stage3d && alive) stage3d = engine.createStage(host);
                return stage3d;
            });
        }

        function apply(key, name) {
            nameEl.textContent = name || "";
            host.classList.add("loading");
            var pd = portraitFor(key);
            if (pd && root.EEPortrait) {
                if (stage3d) { stage3d.dispose(); stage3d = null; }
                if (!portrait) portrait = root.EEPortrait.createPortrait(host);
                active = portrait;
                creditEl.textContent = pd.credit || "";
                portrait.show(pd).then(function () { if (alive) host.classList.remove("loading"); }).catch(fail);
                return;
            }
            if (portrait) { portrait.dispose(); portrait = null; }
            var m = modelFor(key);
            if (!m) { fail("no model"); return; }
            creditEl.textContent = m.credit ? "Model: " + m.credit : "";
            ensure3d().then(function (stage) {
                if (!alive || !stage) return null;
                active = stage;
                return stage.show(m.file, { hide: m.hide || [] }).then(function () {
                    if (alive) host.classList.remove("loading");
                });
            }).catch(fail);
        }

        function fail(err) {
            root.EEAvatar.lastError = String((err && err.message) || err || "unknown");
            if (root.console) console.warn("[EEAvatar] 대화 상대를 끕니다:", root.EEAvatar.lastError);
            alive = false;
            container.innerHTML = "";        // 아바타 없이 계속
        }

        var speakingPartner = false;
        var onStart = function (info) {
            speakingPartner = info.who === "partner";
            if (!speakingPartner) return;
            tapBtn.hidden = true;
            host.classList.add("talking");
            if (lastLine) showCaption(lastLine);
            if (!active) return;
            if (info.audio) active.speakAudio(info.audio, info.src); else active.speakSynthetic();
        };
        var onEnd = function () {
            if (active) active.stopSpeaking();
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
                if (key === this._key) { nameEl.textContent = name || ""; return; }
                this._key = key;
                apply(key, name);
            },
            react: function (verdict) { if (active) active.react(verdict); },
            /** 상대가 이제 말할 문장 — 자막으로 띄우고, 자동재생이 막히면 '탭해서 듣기'에 쓴다 */
            line: function (text, willSpeak) {
                lastLine = text;
                showCaption(text);
                if (!willSpeak) hideCaptionSoon(3500);
            },
            debug: function () { return active && active.debug ? active.debug() : null; },
            mode: function () { return active === portrait && portrait ? "portrait" : active ? "3d" : null; },
            destroy: function () {
                alive = false;
                root.EESpeech.off("start", offStart);
                root.EESpeech.off("end", offEnd);
                root.EESpeech.off("blocked", onBlocked);
                clearTimeout(captionTimer);
                if (stage3d) stage3d.dispose();
                if (portrait) portrait.dispose();
                stage3d = portrait = active = null;
            }
        };
    }

    root.EEAvatar = { attach: attach, enabled: enabled, modelFor: modelFor, portraitFor: portraitFor };
})(window);
