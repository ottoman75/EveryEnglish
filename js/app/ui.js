/* 공용 UI 헬퍼 — 아이콘, 토스트, 축하 효과, 정답 입력기 */
(function (root) {
    "use strict";

    function esc(s) {
        return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    var ICONS = {
        home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
        book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/>',
        target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
        cards: '<rect x="3" y="6" width="14" height="15" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v13"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
        stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
        send: '<path d="M5 12h14M13 6l6 6-6 6"/>',
        speaker: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
        play: '<path d="M7 4v16l13-8z" fill="currentColor"/>',
        close: '<path d="M6 6l12 12M18 6 6 18"/>',
        chev: '<path d="m9 6 6 6-6 6"/>',
        back: '<path d="m15 6-6 6 6 6"/>',
        bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
        refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"/>',
        trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
        eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
        keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'
    };

    function icon(name, extra) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
            (extra ? " " + extra : "") + ">" + (ICONS[name] || "") + "</svg>";
    }

    function gradient(ch) {
        return "linear-gradient(135deg, " + ch.gradient[0] + " 0%, " + ch.gradient[1] + " 100%)";
    }

    function ring(value, max, size) {
        var r = 44, c = 2 * Math.PI * r;
        var pct = Math.max(0, Math.min(1, max ? value / max : 0));
        return '<svg viewBox="0 0 100 100" width="' + (size || 104) + '" height="' + (size || 104) + '">' +
            '<circle class="track" cx="50" cy="50" r="' + r + '" fill="none" stroke-width="9"/>' +
            '<circle class="bar" cx="50" cy="50" r="' + r + '" fill="none" stroke-width="9" stroke-dasharray="' + c +
            '" stroke-dashoffset="' + (c * (1 - pct)) + '"/></svg>';
    }

    // ---------- 토스트 ----------
    function toast(msg, emoji) {
        var wrap = document.querySelector(".toast-wrap");
        if (!wrap) {
            wrap = document.createElement("div");
            wrap.className = "toast-wrap";
            wrap.setAttribute("role", "status");
            document.body.appendChild(wrap);
        }
        var el = document.createElement("div");
        el.className = "toast";
        el.innerHTML = (emoji ? "<span>" + emoji + "</span>" : "") + "<span>" + esc(msg) + "</span>";
        wrap.appendChild(el);
        setTimeout(function () { el.style.opacity = "0"; el.style.transition = "opacity .3s"; }, 2200);
        setTimeout(function () { el.remove(); }, 2600);
    }

    function xpFloat(amount, anchor) {
        var el = document.createElement("div");
        el.className = "xp-float";
        el.textContent = "+" + amount + " XP";
        var rect = anchor ? anchor.getBoundingClientRect() : { left: innerWidth / 2 - 40, top: innerHeight / 2, width: 80 };
        el.style.left = (rect.left + rect.width / 2 - 36) + "px";
        el.style.top = (rect.top - 10) + "px";
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 1200);
    }

    // ---------- 축하 효과 ----------
    function confetti(durationMs) {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        var canvas = document.createElement("canvas");
        canvas.id = "confetti";
        document.body.appendChild(canvas);
        var ctx = canvas.getContext("2d");
        var dpr = devicePixelRatio || 1;
        canvas.width = innerWidth * dpr;
        canvas.height = innerHeight * dpr;
        ctx.scale(dpr, dpr);
        var colors = ["#7C5CFF", "#FF5CA8", "#FFB547", "#10B981", "#38BDF8", "#F472B6"];
        var pieces = [];
        for (var i = 0; i < 160; i++) {
            pieces.push({
                x: innerWidth / 2 + (Math.random() - 0.5) * 80, y: innerHeight * 0.35,
                vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
                size: 6 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
                color: colors[i % colors.length], shape: i % 3
            });
        }
        var end = performance.now() + (durationMs || 2600);
        (function frame(now) {
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            pieces.forEach(function (p) {
                p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
                if (p.shape === 0) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2); ctx.fill(); }
                else { ctx.beginPath(); ctx.moveTo(0, -p.size / 2); ctx.lineTo(p.size / 2, p.size / 2); ctx.lineTo(-p.size / 2, p.size / 2); ctx.fill(); }
                ctx.restore();
            });
            if (now < end) requestAnimationFrame(frame); else canvas.remove();
        })(performance.now());
    }

    // ---------- 시트(모달) ----------
    function sheet(html, onMount) {
        var back = document.createElement("div");
        back.className = "sheet-backdrop";
        back.innerHTML = '<div class="sheet" role="dialog" aria-modal="true">' + html + "</div>";
        document.body.appendChild(back);
        function close() { back.remove(); }
        back.addEventListener("click", function (e) { if (e.target === back) close(); });
        if (onMount) onMount(back.querySelector(".sheet"), close);
        return close;
    }

    // ---------- 채점 결과 diff ----------
    function diffHTML(ops) {
        return ops.map(function (o) {
            if (o.op === "eq") return '<span class="w">' + esc(o.answer) + "</span>";
            if (o.op === "miss") return '<span class="w miss" title="빠진 단어">' + esc(o.answer) + "</span>";
            if (o.op === "sub") return '<span class="w sub" title="틀린 단어">' + esc(o.user) + '</span><span class="w miss">' + esc(o.answer) + "</span>";
            return '<span class="w extra" title="불필요한 단어">' + esc(o.user) + "</span>";
        }).join(" ");
    }

    var VERDICT_COPY = {
        correct: { title: "완벽해요!", emoji: "🎉", praise: ["Perfect!", "Nailed it!", "Awesome!", "Great job!"] },
        close: { title: "거의 맞았어요", emoji: "👍", praise: [] },
        wrong: { title: "아쉬워요, 이렇게 말해요", emoji: "💡", praise: [] }
    };

    function feedbackHTML(result, options) {
        var v = VERDICT_COPY[result.verdict];
        var html = '<div class="feedback ' + result.verdict + '"><div class="title">' + v.emoji + " " +
            (result.verdict === "correct" ? v.praise[Math.floor(Math.random() * v.praise.length)] : v.title) + "</div>";
        if (result.verdict === "close") {
            html += '<div class="diff">' + diffHTML(result.ops) + "</div>";
        }
        if (result.verdict !== "correct") {
            html += '<div class="model en">' + esc(result.answer) +
                ' <button class="icon-btn" style="width:34px;height:34px" data-speak="' + esc(result.answer) + '" aria-label="모범답안 듣기">' + icon("speaker") + "</button></div>";
        }
        if (result.verdict === "wrong" && result.empty) {
            html += '<div class="small muted" style="margin-top:6px">답을 입력하지 않아 오답으로 기록했어요</div>';
        }
        if (options && options.note) html += '<div class="small muted" style="margin-top:6px">' + options.note + "</div>";
        html += '<div class="actions">' + (options && options.actions || "") + "</div></div>";
        return html;
    }

    /**
     * 정답 입력기: 마이크(지원 시) + 키보드. 제출하면 onSubmit(text) 호출.
     * @returns {{ el: HTMLElement, focus: Function, destroy: Function, setText: Function }}
     */
    function answerInput(container, opts) {
        var canListen = root.EESpeech.canListen;
        container.innerHTML =
            '<div class="input-row">' +
            '<textarea class="text-input" rows="1" placeholder="' + esc(opts.placeholder || "영어로 말하거나 입력하세요") + '" autocapitalize="sentences" autocomplete="off" spellcheck="false" enterkeyhint="send" lang="en"></textarea>' +
            (canListen ? '<button class="mic" type="button" aria-label="말하기">' + icon("mic") + "</button>" : "") +
            '<button class="send" type="button" aria-label="제출" disabled>' + icon("send") + "</button>" +
            "</div>" +
            '<div class="interim" aria-live="polite"></div>';
        var ta = container.querySelector("textarea");
        var mic = container.querySelector(".mic");
        var send = container.querySelector(".send");
        var interim = container.querySelector(".interim");
        var session = null;

        function sync() {
            send.disabled = !ta.value.trim();
            ta.style.height = "auto";
            ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
        }
        function submit() {
            var text = ta.value.trim();
            if (!text) return;
            stop();
            opts.onSubmit(text);
        }
        function stop() {
            if (session) { session.stop(); session = null; }
            if (mic) mic.classList.remove("listening");
        }
        ta.addEventListener("input", sync);
        ta.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); }
        });
        send.addEventListener("click", submit);
        if (mic) {
            root.EESpeech.prepareListening();
            mic.addEventListener("click", function () {
                if (session) { stop(); return; }
                mic.classList.add("listening");
                interim.textContent = "듣고 있어요…";
                session = root.EESpeech.listen({ hints: opts.hints }, function (t) { interim.textContent = t; });
                session.promise.then(function (text) {
                    mic.classList.remove("listening");
                    session = null;
                    if (text) {
                        ta.value = text;
                        interim.textContent = "";
                        sync();
                        if (opts.autoSubmitSpeech !== false) submit();
                    } else {
                        interim.textContent = "잘 안 들렸어요. 다시 눌러 말해 보세요.";
                    }
                }).catch(function (err) {
                    mic.classList.remove("listening");
                    session = null;
                    interim.textContent = err.message === "not-allowed"
                        ? "마이크 권한이 없어요. 키보드로 입력해 주세요."
                        : "음성 인식을 쓸 수 없어요. 키보드로 입력해 주세요.";
                });
            });
        }
        return {
            focus: function () { if (!("ontouchstart" in root)) ta.focus(); },
            destroy: stop,
            setText: function (t) { ta.value = t; sync(); }
        };
    }

    root.EEUI = {
        esc: esc, icon: icon, gradient: gradient, ring: ring, toast: toast, xpFloat: xpFloat,
        confetti: confetti, sheet: sheet, diffHTML: diffHTML, feedbackHTML: feedbackHTML, answerInput: answerInput
    };
})(window);
