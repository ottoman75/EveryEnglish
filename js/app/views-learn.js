/*
 * 15분 학습 세션: 시작 → 단어 10 → 표현 6 → 롤플레이 3장면 → 드릴 10 → 결과
 * 문항마다 "첫 시도"만 점수·오답노트에 반영한다. 다시 시도는 연습일 뿐 기록을 덮어쓰지 않는다.
 */
(function (root) {
    "use strict";
    var UI = root.EEUI, Store = root.EEStore, A = root.EEActions, G = root.EEGrader, Speech = root.EESpeech;
    var esc = UI.esc, icon = UI.icon;
    var PARTNER_DELAY_MS = 650;
    var AUTO_NEXT_MS = 1300;
    var DRILL_LABEL = { translate: "영작하기", blank: "빈칸 채우기", arrange: "단어 배열하기" };

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function buildSteps(ch) {
        var steps = [{ type: "intro" }];
        ch.vocab.forEach(function (v, i) { steps.push({ type: "vocab", i: i, units: 1 }); });
        ch.expressions.forEach(function (x, i) { steps.push({ type: "expr", i: i, units: 1 }); });
        ch.dialogues.forEach(function (d, i) {
            steps.push({ type: "scene", i: i, units: d.lines.filter(function (l) { return l.speaker === "you"; }).length });
        });
        ch.drills.forEach(function (d, i) { steps.push({ type: "drill", i: i, units: 1 }); });
        steps.push({ type: "result" });
        return steps;
    }

    function Learn(el, params) {
        var ch = root.EEViews.chapterById(params[0]);
        if (!ch) { location.hash = "#/chapters"; return; }
        var steps = buildSteps(ch);
        var totalUnits = steps.reduce(function (n, s) { return n + (s.units || 0); }, 0);
        var saved = Store.get().inProgress;
        var session = saved && saved.chapterId === ch.id ? saved : { chapterId: ch.id, stepIndex: 0, attempts: {}, xp: 0 };
        session.startedAt = Date.now(); // 며칠 뒤 이어해도 학습 시간은 이번 접속부터 잰다
        var cleanup = [];
        var unitsDoneInStep = 0;
        var timerId;

        el.innerHTML =
            '<div class="session-top"><button class="icon-btn" data-act="quit" aria-label="그만하기">' + icon("close") + "</button>" +
            '<div class="progress" role="progressbar" aria-label="학습 진행률"><i style="width:0"></i></div><span class="timer en">0:00</span></div>' +
            '<div class="stage-host"></div>';
        var host = el.querySelector(".stage-host");
        var bar = el.querySelector(".progress i");
        var timerEl = el.querySelector(".timer");
        el.style.setProperty("--card-grad", UI.gradient(ch));

        timerId = setInterval(function () {
            var sec = Math.floor((Date.now() - session.startedAt) / 1000);
            timerEl.textContent = Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
        }, 1000);

        function persist() {
            Store.update(function (s) { s.inProgress = session.stepIndex > 0 && steps[session.stepIndex].type !== "result" ? session : null; });
        }

        function updateProgress() {
            var done = 0;
            for (var i = 0; i < session.stepIndex; i++) done += steps[i].units || 0;
            done += unitsDoneInStep;
            bar.style.width = Math.round(done / totalUnits * 100) + "%";
        }

        function runCleanup() { cleanup.forEach(function (fn) { fn(); }); cleanup = []; }

        function next() {
            runCleanup();
            session.stepIndex++;
            unitsDoneInStep = 0;
            persist();
            render();
            root.scrollTo({ top: 0, behavior: "smooth" });
        }

        // 첫 시도만 기록
        function attempt(item, text, result, anchor) {
            if (session.attempts[item.id]) return;
            session.attempts[item.id] = result.verdict;
            var gained = A.recordAttempt(item, text, result);
            session.xp += gained;
            UI.xpFloat(gained, anchor);
            persist();
        }

        function render() {
            var step = steps[session.stepIndex];
            updateProgress();
            ({ intro: renderIntro, vocab: renderVocab, expr: renderExpr, scene: renderScene, drill: renderDrill, result: renderResult })[step.type](step);
        }

        // ---------- 시작 ----------
        function renderIntro() {
            host.innerHTML =
                '<div class="stage"><section class="detail-hero" style="background:' + UI.gradient(ch) + '"><span class="badge glass">오늘의 15분</span>' +
                "<h1>" + esc(ch.title) + '</h1><p class="en" style="font-weight:700">' + esc(ch.titleEn) + '</p><span class="emoji-big">' + ch.emoji + "</span></section>" +
                '<div class="card pad-l" style="margin-top:14px"><div class="step-label">🎯 오늘의 목표</div><div class="bold" style="font-size:17px">' + esc(ch.goal) + "</div></div>" +
                '<div class="list" style="margin-top:12px">' +
                [["🧠", "단어 익히기", ch.vocab.length + "개 · 약 3분"], ["💡", "핵심 표현", ch.expressions.length + "개 · 약 2분"],
                    ["💬", "롤플레이", ch.dialogues.length + "개 장면 · 약 7분"], ["✍️", "드릴", ch.drills.length + "문제 · 약 3분"]].map(function (r) {
                    return '<div class="list-item"><span class="lead">' + r[0] + '</span><span class="grow"><div class="bold">' + r[1] + '</div><div class="small muted">' + r[2] + "</div></span></div>";
                }).join("") + "</div>" +
                '<p class="small faint center" style="margin:16px 0">🎙️ ' + (Speech.canListen ? "마이크 버튼을 눌러 영어로 말하거나, 키보드로 입력할 수 있어요" : "이 브라우저에서는 음성 인식이 안 돼서 키보드로 입력해요") + "</p>" +
                '<button class="btn btn-primary btn-block" data-act="next">시작하기</button></div>';
        }

        // ---------- 단어 ----------
        function renderVocab(step) {
            var v = ch.vocab[step.i];
            host.innerHTML =
                '<div class="stage"><div class="step-label">🧠 단어 ' + (step.i + 1) + " / " + ch.vocab.length + "</div>" +
                '<div class="flashcard" data-act="flip" role="button" aria-label="카드 뒤집기"><div class="inner">' +
                '<div class="face front"><button class="icon-btn speak-fab" data-speak="' + esc(v.word) + '" aria-label="발음 듣기">' + icon("speaker") + "</button>" +
                '<div class="word">' + esc(v.word) + '</div><div class="pos">' + esc(v.pos) + '</div><div class="tap">👆 탭해서 뜻 보기</div></div>' +
                '<div class="face back"><button class="icon-btn speak-fab" data-speak="' + esc(v.example) + '" aria-label="예문 듣기">' + icon("speaker") + "</button>" +
                '<div class="faint en bold">' + esc(v.word) + '</div><div class="meaning">' + esc(v.meaning) + "</div>" +
                '<div class="ex"><div class="en">' + esc(v.example) + '</div><div class="small muted">' + esc(v.exampleKo) + "</div></div></div>" +
                "</div></div>" +
                '<div class="btn-row" style="margin-top:18px"><button class="btn btn-soft" data-act="word-unknown">🤔 헷갈려요</button><button class="btn btn-primary" data-act="word-known">알아요 👍</button></div>' +
                '<p class="tiny faint center" style="margin-top:10px">헷갈리는 단어는 단어장에 담아 내일부터 복습해요</p></div>';
            if (Store.get().settings.autoSpeak) Speech.speak(v.word);
        }

        // ---------- 표현 ----------
        function renderExpr(step) {
            var x = ch.expressions[step.i];
            host.innerHTML =
                '<div class="stage"><div class="step-label">💡 핵심 표현 ' + (step.i + 1) + " / " + ch.expressions.length + "</div>" +
                '<div class="expr-card"><div class="pattern">' + esc(x.en) + '</div><div class="ko">' + esc(x.ko) + "</div>" +
                '<div class="note">💬 ' + esc(x.note) + "</div>" +
                '<div class="example"><button class="icon-btn" data-speak="' + esc(x.example) + '" aria-label="예문 듣기">' + icon("speaker") + '</button><div class="en bold" style="font-size:17px">' + esc(x.example) + "</div></div></div>" +
                '<div class="card" style="margin-top:12px"><div class="small bold muted" style="margin-bottom:4px">따라 말해 보세요</div><div class="echo"></div></div>' +
                '<button class="btn btn-primary btn-block" style="margin-top:16px" data-act="next">다음</button></div>';
            var input = UI.answerInput(host.querySelector(".echo"), {
                placeholder: "예문을 따라 말하거나 입력해 보세요",
                onSubmit: function (text) {
                    var r = G.grade(text, [x.example]);
                    var box = host.querySelector(".echo");
                    var fb = document.createElement("div");
                    fb.innerHTML = r.verdict === "correct"
                        ? '<div class="feedback correct"><div class="title">🎉 발음 인식 완벽!</div></div>'
                        : '<div class="feedback close"><div class="title">' + Math.round(r.score * 100) + '% 일치</div><div class="diff">' + UI.diffHTML(r.ops) + "</div></div>";
                    var old = box.querySelector(".feedback");
                    if (old) old.parentNode.remove();
                    box.appendChild(fb);
                    input.setText("");
                }
            });
            cleanup.push(input.destroy);
            if (Store.get().settings.autoSpeak) Speech.speak(x.example);
        }

        // ---------- 롤플레이 ----------
        function renderScene(step) {
            var scene = ch.dialogues[step.i];
            var lineIndex = 0;
            var alive = true;
            cleanup.push(function () { alive = false; Speech.stopSpeaking(); });

            host.innerHTML =
                '<div class="stage"><div class="step-label">💬 롤플레이 ' + (step.i + 1) + " / " + ch.dialogues.length + "</div>" +
                '<div class="scene-head"><b>' + esc(scene.title) + "</b><span>📍 " + esc(scene.setting) + "</span></div>" +
                '<div class="avatar-host"></div>' +
                '<div class="chat" aria-live="polite"></div><div class="composer-host"></div></div>';
            var chat = host.querySelector(".chat");
            var avatar = root.EEAvatar ? root.EEAvatar.attach(host.querySelector(".avatar-host")) : null;
            if (avatar) {
                root.__eeAvatar = avatar; // 점검용
                var firstPartner = scene.lines.find(function (l) { return l.speaker === "partner"; });
                avatar.setSpeaker(ch.id + ":" + firstPartner.name, firstPartner.name);
                cleanup.push(avatar.destroy);
            }
            var composerHost = host.querySelector(".composer-host");

            function partnerBubble(line) {
                var m = document.createElement("div");
                m.className = "msg partner";
                m.innerHTML = '<div class="avatar">' + ch.emoji + '</div><div class="bubble"><div class="name">' + esc(line.name) + "</div>" +
                    '<div class="en">' + esc(line.en) + '</div><div class="ko hidden" data-act="reveal" title="탭해서 해석 보기">' + esc(line.ko) + "</div>" +
                    '<button class="replay" data-speak="' + esc(line.en) + '" data-who="partner" aria-label="다시 듣기">' + icon("speaker", 'width="18" height="18"') + "</button></div>";
                chat.appendChild(m);
                m.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            function typing() {
                var t = document.createElement("div");
                t.className = "msg partner";
                t.innerHTML = '<div class="avatar">' + ch.emoji + '</div><div class="bubble typing"><i></i><i></i><i></i></div>';
                chat.appendChild(t);
                return t;
            }

            function advance() {
                if (!alive) return;
                if (lineIndex >= scene.lines.length) {
                    composerHost.innerHTML = '<button class="btn btn-primary btn-block" style="margin-top:18px" data-act="next">' +
                        (step.i + 1 < ch.dialogues.length ? "다음 장면으로" : "드릴로 넘어가기") + "</button>";
                    return;
                }
                var line = scene.lines[lineIndex];
                if (line.speaker === "partner") {
                    composerHost.innerHTML = "";
                    var t = typing();
                    setTimeout(function () {
                        if (!alive) return;
                        t.remove();
                        partnerBubble(line);
                        var autoSpeak = Store.get().settings.autoSpeak;
                        if (avatar) {
                            avatar.setSpeaker(ch.id + ":" + line.name, line.name);
                            avatar.line(line.en, autoSpeak);
                        }
                        if (autoSpeak) Speech.speak(line.en, { who: "partner" });
                        lineIndex++;
                        advance();
                    }, PARTNER_DELAY_MS);
                } else {
                    askYou(line, scene.lines[lineIndex - 1]);
                }
            }

            function askYou(line, prevPartner) {
                var item = {
                    id: ch.id + ":" + scene.id + ":" + lineIndex, chapterId: ch.id, kind: "dialogue",
                    ko: line.ko, hint: line.hint, answers: line.answers,
                    context: prevPartner ? prevPartner.en : "", contextKo: prevPartner ? prevPartner.ko : ""
                };
                composerHost.innerHTML =
                    '<div class="composer"><div class="prompt-sub">이렇게 대답해 보세요</div><div class="prompt-ko">' + esc(line.ko) + "</div>" +
                    '<button class="hint-toggle" data-act="hint">' + icon("bulb", 'width="16" height="16"') + ' 힌트 <span class="hint-text" hidden>' + esc(line.hint) + "</span></button>" +
                    '<div class="answer-host"></div><div class="fb-host"></div></div>';
                var input = UI.answerInput(composerHost.querySelector(".answer-host"), {
                    onSubmit: function (text) { submit(text); }
                });
                cleanup.push(input.destroy);
                input.focus();

                function submit(text) {
                    var r = G.grade(text, line.answers);
                    var m = document.createElement("div");
                    m.className = "msg you " + r.verdict;
                    m.innerHTML = '<span class="mark">' + (r.verdict === "wrong" ? "✕" : "✓") + '</span><div class="bubble en">' + esc(text) + "</div>";
                    chat.appendChild(m);
                    var firstTry = !session.attempts[item.id];
                    attempt(item, text, r, m);
                    if (avatar) avatar.react(r.verdict);
                    input.destroy();
                    composerHost.querySelector(".answer-host").innerHTML = "";

                    var actions;
                    if (r.verdict === "wrong") {
                        actions = '<button class="btn btn-soft" data-act="retry">' + icon("refresh", 'width="18" height="18"') + ' 다시 말하기</button><button class="btn btn-primary" data-act="continue">다음</button>';
                    } else if (r.verdict === "close") {
                        actions = '<button class="btn btn-soft" data-act="save-note">📌 오답노트에 저장</button><button class="btn btn-primary" data-act="continue">다음</button>';
                    } else {
                        actions = '<button class="btn btn-primary" data-act="continue">다음</button>';
                    }
                    var fbHost = composerHost.querySelector(".fb-host");
                    fbHost.innerHTML = UI.feedbackHTML(r, {
                        actions: actions,
                        note: r.verdict === "wrong" && firstTry ? "📌 오답노트에 담았어요. 내일 다시 물어볼게요." : ""
                    });
                    if (r.verdict !== "correct") Speech.speak(r.answer);
                    m.scrollIntoView({ behavior: "smooth", block: "nearest" });

                    var autoTimer = r.verdict === "correct" ? setTimeout(proceed, AUTO_NEXT_MS) : null;
                    function proceed() {
                        clearTimeout(autoTimer);
                        if (!alive) return;
                        lineIndex++;
                        unitsDoneInStep++;
                        updateProgress();
                        advance();
                    }
                    fbHost.addEventListener("click", function (e) {
                        var b = e.target.closest("[data-act]");
                        if (!b) return;
                        e.stopPropagation();
                        if (b.dataset.act === "continue") proceed();
                        if (b.dataset.act === "retry") askYou(line, prevPartner);
                        if (b.dataset.act === "save-note") {
                            A.saveToNotes(item, text);
                            b.disabled = true;
                            b.textContent = "✓ 저장됨";
                        }
                    });
                }
            }

            advance();
        }

        // ---------- 드릴 ----------
        function renderDrill(step) {
            var d = ch.drills[step.i];
            var item = {
                id: ch.id + ":drill:" + step.i, chapterId: ch.id, kind: d.type, ko: d.ko, answers: d.answers,
                strict: d.type !== "translate", blankEn: d.en || ""
            };
            var body = "";
            if (d.type === "blank") {
                var parts = d.en.split("___");
                body = '<div class="blank-sentence en">' + esc(parts[0]) + '<input class="blank-input" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="빈칸" enterkeyhint="done">' + esc(parts[1]) + "</div>" +
                    '<button class="btn btn-primary btn-block" style="margin-top:20px" data-act="check-blank">확인</button>';
            } else if (d.type === "arrange") {
                var tokens = G.tokenizeForArrange(d.answers[0]);
                var shuffled = shuffle(tokens.map(function (t, i) { return { t: t, i: i }; }));
                if (tokens.length > 1 && shuffled.every(function (s, i) { return s.i === i; })) shuffled.reverse();
                body = '<div class="answer-zone"></div><div class="word-bank">' +
                    shuffled.map(function (s) { return '<button class="chip-word en" data-tok="' + s.i + '">' + esc(s.t) + "</button>"; }).join("") +
                    '</div><button class="btn btn-primary btn-block" style="margin-top:20px" data-act="check-arrange" disabled>확인</button>';
            } else {
                body = '<div class="answer-host" style="margin-top:6px"></div>';
            }
            host.innerHTML =
                '<div class="stage"><div class="step-label">✍️ 드릴 ' + (step.i + 1) + " / " + ch.drills.length + "</div>" +
                '<div class="drill-card"><div class="kind">' + DRILL_LABEL[d.type] + '</div><div class="q">' + esc(d.ko) + "</div>" + body + "</div>" +
                '<div class="fb-host"></div></div>';

            var fbHost = host.querySelector(".fb-host");
            var done = false;
            function showResult(text, r, anchor) {
                if (done) return;
                done = true;
                attempt(item, text, r, anchor);
                fbHost.innerHTML = UI.feedbackHTML(r, {
                    actions: '<button class="btn btn-primary" data-act="next">다음</button>',
                    note: r.verdict === "wrong" ? "📌 오답노트에 담았어요." : ""
                });
                Speech.speak(d.type === "blank" ? d.en.replace("___", r.answer) : r.answer);
                if (r.verdict === "correct") UI.confetti(900);
                fbHost.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            if (d.type === "translate") {
                var input = UI.answerInput(host.querySelector(".answer-host"), {
                    onSubmit: function (text) {
                        var r = G.grade(text, d.answers);
                        showResult(text, r, host.querySelector(".drill-card"));
                        input.destroy();
                        host.querySelector(".answer-host").innerHTML = '<div class="en bold" style="margin-top:14px;font-size:17px">' + esc(text) + "</div>";
                    }
                });
                cleanup.push(input.destroy);
                input.focus();
            }
            if (d.type === "blank") {
                var bi = host.querySelector(".blank-input");
                if (!("ontouchstart" in root)) bi.focus();
                var checkBlank = function () {
                    if (!bi.value.trim()) { bi.focus(); return; }
                    var r = G.grade(bi.value, d.answers, { strict: true });
                    bi.disabled = true;
                    bi.style.color = r.verdict === "correct" ? "var(--ok)" : "var(--bad)";
                    host.querySelector('[data-act="check-blank"]').remove();
                    showResult(bi.value, r, bi);
                };
                bi.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.isComposing) checkBlank(); });
                host.querySelector('[data-act="check-blank"]').addEventListener("click", checkBlank);
            }
            if (d.type === "arrange") {
                var zone = host.querySelector(".answer-zone");
                var bank = host.querySelector(".word-bank");
                var check = host.querySelector('[data-act="check-arrange"]');
                var picked = [];
                var tokensA = G.tokenizeForArrange(d.answers[0]);
                var drawZone = function () {
                    zone.innerHTML = picked.map(function (i, pos) { return '<button class="chip-word en" data-pos="' + pos + '">' + esc(tokensA[i]) + "</button>"; }).join("");
                    bank.querySelectorAll("[data-tok]").forEach(function (b) { b.classList.toggle("used", picked.indexOf(+b.dataset.tok) >= 0); });
                    check.disabled = picked.length !== tokensA.length;
                };
                bank.addEventListener("click", function (e) {
                    var b = e.target.closest("[data-tok]");
                    if (!b || done) return;
                    picked.push(+b.dataset.tok);
                    drawZone();
                });
                zone.addEventListener("click", function (e) {
                    var b = e.target.closest("[data-pos]");
                    if (!b || done) return;
                    picked.splice(+b.dataset.pos, 1);
                    drawZone();
                });
                check.addEventListener("click", function () {
                    var text = picked.map(function (i) { return tokensA[i]; }).join(" ");
                    check.remove();
                    showResult(text, G.grade(text, d.answers, { strict: true }), zone);
                });
            }
        }

        // ---------- 결과 ----------
        function renderResult() {
            var ids = Object.keys(session.attempts);
            var graded = ids.length;
            var passed = ids.filter(function (k) { return session.attempts[k] !== "wrong"; }).length;
            var wrong = graded - passed;
            var score = graded ? Math.round(passed / graded * 100) : 0;
            var minutes = Math.max(1, Math.round((Date.now() - session.startedAt) / 60000));
            A.completeChapter(ch.id, score);
            Store.update(function (s) { s.inProgress = null; });
            var trophy = score >= 90 ? "🏆" : score >= 70 ? "🥇" : score >= 50 ? "💪" : "🌱";
            var message = score >= 90 ? "원어민급이에요!" : score >= 70 ? "훌륭해요! 조금만 더 다듬어요" : score >= 50 ? "좋아요, 오답노트로 마무리해요" : "시작이 반! 내일 다시 도전해요";
            host.innerHTML =
                '<div class="stage"><section class="result-hero" style="background:' + UI.gradient(ch) + '"><div class="trophy">' + trophy + '</div>' +
                '<div class="big" style="margin-top:6px">' + score + '<span style="font-size:28px">점</span></div><div style="margin-top:6px;font-weight:700">' + message + "</div></section>" +
                '<div class="result-grid"><div class="stat"><b>' + passed + "/" + graded + '</b><span>통과</span></div><div class="stat"><b>+' + (session.xp + A.XP.chapterBonus) + '</b><span>획득 XP</span></div><div class="stat"><b>' + minutes + "분</b><span>학습 시간</span></div></div>" +
                (wrong ? '<a class="alert-card" style="margin-top:12px" href="#/care?ch=' + ch.id + '"><span class="ico">📌</span><span><b>오답노트에 ' + wrong + "개를 담았어요</b><span>내일 집중케어에서 다시 물어볼게요</span></span><span class=\"chev\">" + icon("chev", 'width="20" height="20"') + "</span></a>" : "") +
                '<div class="stack" style="margin-top:16px"><a class="btn btn-warm btn-block" href="#/shadow/' + ch.id + '">🎧 쉐도잉으로 마무리 (5분)</a>' +
                '<div class="btn-row"><a class="btn btn-soft" href="#/learn/' + ch.id + '" data-act="restart">다시 하기</a><a class="btn btn-soft" href="#/home">홈으로</a></div></div></div>';
            UI.confetti(score >= 70 ? 3200 : 1600);
        }

        // ---------- 이벤트 ----------
        function onClick(e) {
            var t = e.target.closest("[data-act],[data-speak]");
            if (!t) return;
            if (t.dataset.speak !== undefined && !t.dataset.act) { e.stopPropagation(); Speech.speak(t.dataset.speak, { who: t.dataset.who }); return; }
            var act = t.dataset.act;
            if (act === "next") next();
            if (act === "flip") t.classList.toggle("flipped");
            if (act === "word-known" || act === "word-unknown") {
                var v = ch.vocab[steps[session.stepIndex].i];
                if (act === "word-unknown") { A.markWordUnknown(ch, v); UI.toast("단어장에 담았어요", "🧠"); }
                else A.markWordKnown(ch, v);
                next();
            }
            if (act === "reveal") t.classList.remove("hidden");
            if (act === "hint") t.querySelector(".hint-text").hidden = false;
            if (act === "restart") {
                // 같은 해시라 hashchange가 일어나지 않는다 → 직접 다시 그린다
                e.preventDefault();
                Store.update(function (s) { s.inProgress = null; });
                root.EEApp.route();
            }
            if (act === "quit") {
                UI.sheet('<h2>학습을 잠시 멈출까요?</h2><p class="muted">지금까지 진행한 곳은 저장돼요. 챕터에서 이어서 할 수 있어요.</p>' +
                    '<div class="btn-row" style="margin-top:18px"><button class="btn btn-soft" data-x="stay">계속하기</button><button class="btn btn-primary" data-x="leave">나가기</button></div>', function (sh, close) {
                    sh.addEventListener("click", function (ev) {
                        var b = ev.target.closest("[data-x]");
                        if (!b) return;
                        close();
                        if (b.dataset.x === "leave") location.hash = "#/chapter/" + ch.id;
                    });
                });
            }
        }
        el.addEventListener("click", onClick);

        // 장면 중간에서 이어하면 장면 처음부터. 이미 기록된 첫 시도는 유지된다
        // 저장 뒤 챕터 구성이 바뀌어 단계 번호가 범위를 벗어나도 처음부터 다시 시작한다
        if (!steps[session.stepIndex] || steps[session.stepIndex].type === "result") session.stepIndex = 0;
        render();

        return function destroy() {
            runCleanup();
            clearInterval(timerId);
            Speech.stopSpeaking();
        };
    }

    root.EEViews = Object.assign(root.EEViews || {}, { Learn: Learn });
})(window);
