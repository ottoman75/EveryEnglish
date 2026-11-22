/*
 * 2D '말하는 초상화' — 같은 구도의 이미지 3~5장을 겹쳐, 녹음에 맞춰 입·눈만 바꾸고 고개를 움직인다.
 *   base  : 입 다문 기본 (필수)      talk : 입 벌림 '아' (필수)      blink : 눈 감음 (필수)
 *   talkS : 살짝 벌린 입 (선택 — 있으면 작은 소리는 talkS, 큰 소리는 talk로 2단계)
 *   ※ talk는 '적당히' 벌린 입(윗니, 혀 X). 크게 벌린 '아~' 입은 소리 지르는 것처럼 보인다
 *   talkO : 입 오므림 '우/오' (선택) smile: 활짝 웃음 (선택, 정답 반응)
 * 입·눈 영역은 마스크로만 드러낸다 → 생성 AI가 변형 이미지의 다른 부분을 조금 다르게 그려도 티가 안 난다.
 * 영역 좌표(mouth/eyes)는 이미지 기준 비율(0~1). tools/portrait-detect 로 얼굴 인식해 자동으로 채운다.
 *
 * 입 영상(선택, 권장): videos { "<녹음파일명>.m4a": "assets/portraits/<id>/v/<..>.mp4" } + videoBox {x0,y0,x1,y1}
 *   SadTalker로 미리 만든 '그 대사의 입·턱 움직임' 영상. 있으면 입은 영상으로(녹음 재생 시각에 맞춰), 없으면 이미지 3장 전환.
 */
(function (root) {
    "use strict";
    var LS = function () { return root.EELipSync; };
    var BLINK_MIN_S = 2, BLINK_MAX_S = 5.5, BLINK_S = 0.14;

    function maskCSS(r, inner) {
        // 타원 가장자리를 부드럽게: 안쪽 inner까지 완전히, 바깥으로 갈수록 투명
        var g = "radial-gradient(ellipse " + (r.rx * 100) + "% " + (r.ry * 100) + "% at " + (r.x * 100) + "% " + (r.y * 100) +
            "%, #000 " + (inner || 55) + "%, transparent 100%)";
        return "-webkit-mask-image:" + g + ";mask-image:" + g + ";";
    }

    function createPortrait(host) {
        host.classList.add("portrait-mode");
        var wrap = document.createElement("div");
        wrap.className = "portrait";
        host.insertBefore(wrap, host.firstChild);
        var def = null, raf = 0, disposed = false, visible = true;
        var speaking = null, mouth = { open: 0, round: 0 }, talkLevel = 0;
        var nextBlink = 2, blinkT = -1, mood = { kind: null, until: 0, v: 0 };
        var videoOn = false;
        var last = performance.now(), t = 0;
        var els = {};

        var io = new IntersectionObserver(function (e) { visible = e[0].isIntersecting; });
        io.observe(host);

        function show(d) {
            if (def && def.id === d.id) return Promise.resolve();
            def = d;
            var layers = ["base", "talkS", "talk", "talkO", "blink", "smile"].filter(function (k) { return d[k]; });
            wrap.innerHTML =
                '<div class="portrait-bg" style="background-image:url(\'' + d.base + '\')"></div>' +
                '<div class="portrait-frame" style="--ar:' + (d.aspect || 0.8) + '">' +
                layers.map(function (k) {
                    var region = k === "blink" ? d.eyes : (k === "talk" || k === "talkS" || k === "talkO") ? d.mouth : null;
                    return '<img class="pl pl-' + k + '" alt="" draggable="false" src="' + d[k] + '" style="' +
                        (region ? maskCSS(region, k === "blink" ? 60 : 50) : "") + (k === "base" ? "" : "opacity:0;") + '">';
                }).join("") + "</div>";
            els = { frame: wrap.querySelector(".portrait-frame") };
            layers.forEach(function (k) { els[k] = wrap.querySelector(".pl-" + k); });
            if (d.videos && d.videoBox) {
                // 입 영상: 입·턱 상자에만, 가장자리를 부드럽게. 눈 깜빡임 층보다 아래
                var v = document.createElement("video");
                v.className = "pl pl-video";
                v.muted = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.setAttribute("muted", "");
                v.preload = "auto";
                var b = d.videoBox;
                v.style.cssText = "left:" + (b.x0 * 100) + "%;top:" + (b.y0 * 100) + "%;width:" + ((b.x1 - b.x0) * 100) + "%;height:" +
                    ((b.y1 - b.y0) * 100) + "%;inset:auto;opacity:0;" + maskCSS({ x: 0.5, y: 0.5, rx: 0.5, ry: 0.5 }, 62);
                els.frame.insertBefore(v, els.blink || null);
                els.video = v;
            }
            // 모든 이미지가 로드돼야 깜빡임 때 빈 화면이 안 보인다
            return Promise.all(layers.map(function (k) {
                var img = els[k];
                return img.complete ? Promise.resolve() : new Promise(function (res, rej) { img.onload = res; img.onerror = rej; });
            })).then(function () { if (!raf) loop(); });
        }

        function setOpacity(el, v) { if (el) el.style.opacity = v.toFixed(3); }

        // 입 상태: closed / talkS(살짝) / talk(벌림). 경계에 여유(히스테리시스)를 두고, 최소 유지 시간 동안은 바꾸지 않는다
        var MOUTH_HOLD_MS = 70;
        var mouthState = "closed", mouthSince = 0;
        function pickMouth(open, now) {
            var hasS = !!els.talkS;
            var next = mouthState;
            var up = hasS ? { closed: 0.14, talkS: 0.55 } : { closed: 0.3 };
            var down = hasS ? { talkS: 0.09, talk: 0.45 } : { talk: 0.22 };
            if (mouthState === "closed" && open > up.closed) next = hasS ? (open > up.talkS ? "talk" : "talkS") : "talk";
            else if (mouthState === "talkS") next = open > up.talkS ? "talk" : open < down.talkS ? "closed" : "talkS";
            else if (mouthState === "talk") next = open < (hasS ? down.talk : down.talk) ? (hasS && open > down.talkS ? "talkS" : "closed") : "talk";
            if (next !== mouthState && now - mouthSince >= MOUTH_HOLD_MS) { mouthState = next; mouthSince = now; }
            return mouthState;
        }

        function loop() {
            raf = requestAnimationFrame(loop);
            var now = performance.now(), dt = Math.min(0.1, (now - last) / 1000);
            last = now;
            if (!visible || document.hidden || !def) return;
            t += dt;

            // 입
            var target = { open: 0, round: 0 };
            if (speaking && speaking.track) {
                var s = LS().shapeAt(speaking.track, speaking.audio.currentTime);
                target = { open: s.aa + s.ee + s.ih, round: s.ou + s.oh };
            } else if (speaking) {
                var y = LS().syntheticAt(t);
                target = { open: y.aa, round: y.oh };
            }
            if (!els.talkO) { target.open += target.round; target.round = 0; }
            ["open", "round"].forEach(function (k) {
                var rate = target[k] > mouth[k] ? 30 : 16;
                mouth[k] += (target[k] - mouth[k]) * Math.min(1, rate * dt);
            });
            // 이미지 교차는 0~1 불투명도: 반쯤 벌린 입은 두 이미지가 섞여 중간 모양처럼 보인다
            // 입 영상이 재생 중이면 영상이 입을 맡는다(녹음 재생 시각에 맞춰 보정)
            if (videoOn && els.video) {
                var a = speaking && speaking.audio;
                if (a && !els.video.paused && Math.abs(els.video.currentTime - a.currentTime) > 0.08) els.video.currentTime = a.currentTime;
                setOpacity(els.talkS, 0); setOpacity(els.talk, 0);
                setOpacity(els.video, 1);
            } else if (els.video) {
                setOpacity(els.video, 0);
            }
            // 입 모양은 섞지 않고 한 장씩 바꾼다(만화 립싱크 방식). 반투명으로 섞으면 입술이 이중으로 보인다
            var want = videoOn ? "closed" : pickMouth(mouth.open, now);
            setOpacity(els.talkS, want === "talkS" ? 1 : 0);
            setOpacity(els.talk, want === "talk" ? 1 : 0);
            setOpacity(els.talkO, Math.min(1, mouth.round * 1.4));
            talkLevel += ((mouth.open + mouth.round) - talkLevel) * Math.min(1, 10 * dt);

            // 눈 깜빡임
            if (blinkT < 0) { nextBlink -= dt; if (nextBlink <= 0) blinkT = 0; }
            var b = 0;
            if (blinkT >= 0) {
                blinkT += dt;
                b = blinkT < BLINK_S / 2 ? blinkT / (BLINK_S / 2) : Math.max(0, 1 - (blinkT - BLINK_S / 2) / (BLINK_S / 2));
                if (blinkT >= BLINK_S) { blinkT = -1; nextBlink = BLINK_MIN_S + Math.random() * (BLINK_MAX_S - BLINK_MIN_S); }
            }
            setOpacity(els.blink, b > 0.5 ? 1 : b * 2);

            // 반응(정답 미소 등)
            var goal = now < mood.until ? 1 : 0;
            mood.v += (goal - mood.v) * Math.min(1, 6 * dt);
            if (els.smile) setOpacity(els.smile, mood.kind === "happy" ? mood.v * 0.9 : 0);

            // 고개·몸: 숨쉬기 + 느린 시선 이동 + 말할 때 음절 끄덕임
            var talking = speaking ? 1 : 0;
            var rot = Math.sin(t * 0.55) * 0.6 + talking * Math.sin(t * 1.7) * 0.7 + (mood.kind === "sad" ? mood.v * -1.5 : 0);
            var tx = Math.sin(t * 0.4) * 0.6 + talking * Math.sin(t * 1.3) * 0.5;
            var ty = Math.sin(t * 1.5) * 0.35 + talkLevel * 1.6 - (mood.kind === "happy" ? mood.v * 1.5 : 0);
            var sc = 1.035 + Math.sin(t * 1.5) * 0.004 + talking * 0.006;
            els.frame.style.transform = "translate(" + tx.toFixed(2) + "%," + ty.toFixed(2) + "%) rotate(" + rot.toFixed(2) + "deg) scale(" + sc.toFixed(4) + ")";
        }

        function startVideo(audio, src) {
            if (!els.video || !def.videos) return false;
            var key = String(src || "").split("/").pop().split("?")[0];
            var file = def.videos[key];
            if (!file) return false;
            var v = els.video;
            if (v.getAttribute("src") !== file) v.src = file;
            v.currentTime = 0;
            var p = v.play();
            videoOn = true;
            if (p && p.catch) p.catch(function () { videoOn = false; });   // 재생 실패 시 이미지 방식으로
            return true;
        }

        function speakAudio(audio, src) {
            speaking = { synthetic: true, audio: audio };
            startVideo(audio, src);
            var token = (speakAudio.token = (speakAudio.token || 0) + 1);
            LS().analyzeClip(src || audio.currentSrc || audio.src).then(function (track) {
                if (token === speakAudio.token && speaking) speaking = { track: track, audio: audio };
            }).catch(function () { /* 리듬 흉내 유지 */ });
        }

        return {
            show: show,
            speakAudio: speakAudio,
            speakSynthetic: function () { speaking = { synthetic: true }; },
            stopSpeaking: function () {
                speaking = null; speakAudio.token = (speakAudio.token || 0) + 1;
                videoOn = false;
                if (els.video) els.video.pause();
            },
            react: function (verdict) {
                var kind = verdict === "wrong" ? "sad" : "happy";
                mood = { kind: kind, until: performance.now() + (verdict === "correct" ? 1600 : 1100), v: mood.kind === kind ? mood.v : 0 };
            },
            debug: function () {
                return { mouth: { aa: mouth.open, ou: mouth.round, ee: 0, ih: 0, oh: 0 }, speaking: speaking ? (speaking.track ? "audio" : "synthetic") : null, mood: mood.kind, moodValue: mood.v };
            },
            dispose: function () {
                disposed = true;
                cancelAnimationFrame(raf);
                io.disconnect();
                wrap.remove();
                host.classList.remove("portrait-mode");
            }
        };
    }

    root.EEPortrait = { createPortrait: createPortrait };
})(window);
