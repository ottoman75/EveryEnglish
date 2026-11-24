/* 집중케어(오답노트) · 단어장 · 쉐도잉 */
(function (root) {
    "use strict";
    var UI = root.EEUI, Store = root.EEStore, A = root.EEActions, G = root.EEGrader, Speech = root.EESpeech, Srs = root.EESrs;
    var esc = UI.esc, icon = UI.icon;
    var SHADOW_COUNT = 12;
    var KIND_LABEL = { dialogue: "롤플레이", translate: "영작", blank: "빈칸", arrange: "배열" };

    function chapterById(id) { return root.EEViews.chapterById(id); }

    function boxesHTML(box) {
        var html = '<span class="boxes" title="정복까지 ' + (Srs.MASTERED_BOX - (box || 0)) + '번 남음">';
        for (var i = 0; i < Srs.MASTERED_BOX; i++) html += "<i" + (i < (box || 0) ? ' class="on"' : "") + "></i>";
        return html + "</span>";
    }

    function dueLabel(item, today) {
        if (item.mastered) return "🏅 정복";
        var d = Srs.daysBetween(today, item.due);
        if (d <= 0) return "오늘 복습";
        if (d === 1) return "내일 복습";
        return d + "일 뒤 복습";
    }

    function query() {
        var q = {};
        (location.hash.split("?")[1] || "").split("&").forEach(function (kv) {
            var p = kv.split("=");
            if (p[0]) q[p[0]] = decodeURIComponent(p[1] || "");
        });
        return q;
    }

    // ---------------- 오답노트 ----------------
    function Care(el) {
        var tab = "active";
        var chFilter = query().ch || "";
        function render() {
            var s = Store.get();
            var today = Store.today();
            var all = Object.keys(s.wrongNotes).map(function (id) { return Object.assign({ id: id }, s.wrongNotes[id]); });
            var due = A.dueWrong();
            var active = all.filter(function (n) { return !n.mastered; });
            var mastered = all.filter(function (n) { return n.mastered; });
            var list = (tab === "due" ? due : tab === "mastered" ? mastered : Srs.sortForReview(active))
                .filter(function (n) { return !chFilter || n.chapterId === chFilter; });
            var chIds = Array.from(new Set(all.map(function (n) { return n.chapterId; })));

            el.innerHTML =
                '<div class="page-head stage"><div><h1>집중케어</h1><p>틀린 문장은 맞힐 때까지, 간격을 늘려가며 다시 물어봐요</p></div></div>' +
                '<section class="care-hero stage"><div class="small bold" style="opacity:.9">오늘 복습할 문장</div><div class="num en">' + due.length + "</div>" +
                '<div class="small" style="opacity:.9;margin-top:4px">학습 중 ' + active.length + "개 · 정복 " + mastered.length + "개</div>" +
                '<div class="row" style="margin-top:16px;gap:8px;position:relative;z-index:1">' +
                (due.length ? '<a class="btn" style="background:#fff;color:#E64A6E" href="#/care/practice">🎯 집중케어 시작</a>' : '<span class="badge glass">오늘 몫은 끝! 🎉</span>') +
                (active.length ? '<a class="btn btn-s" style="background:rgba(255,255,255,.22);color:#fff;height:52px" href="#/care/practice?mode=all">전체 연습</a>' : "") +
                '</div><span class="emoji-big">🎯</span></section>' +
                '<div class="segmented" style="margin:18px 0 12px">' +
                [["active", "학습 중 " + active.length], ["due", "오늘 " + due.length], ["mastered", "정복 " + mastered.length]].map(function (t) {
                    return '<button data-tab="' + t[0] + '" class="' + (tab === t[0] ? "active" : "") + '">' + t[1] + "</button>";
                }).join("") + "</div>" +
                (chIds.length > 1 ? '<div class="filter-row" style="margin-bottom:12px"><button data-ch="" class="' + (!chFilter ? "active" : "") + '">전체 챕터</button>' +
                    chIds.map(function (id) { var c = chapterById(id); return c ? '<button data-ch="' + id + '" class="' + (chFilter === id ? "active" : "") + '">' + c.emoji + " " + esc(c.title) + "</button>" : ""; }).join("") + "</div>" : "") +
                (list.length ? '<div class="stack">' + list.map(function (n) {
                    var c = chapterById(n.chapterId);
                    var mine = n.history && n.history[0] ? n.history[0].answer : "";
                    return '<div class="note-item stage">' +
                        '<div class="row between"><span class="badge">' + (c ? c.emoji + " " + esc(c.title) : "") + " · " + (KIND_LABEL[n.kind] || "") + '</span><button class="icon-btn" style="width:34px;height:34px" data-del="' + esc(n.id) + '" aria-label="삭제">' + icon("trash", 'width="16" height="16"') + "</button></div>" +
                        (n.context ? '<div class="ctx" style="margin-top:8px">“' + esc(n.context) + '”</div>' : "") +
                        '<div class="ko">' + esc(n.ko) + "</div>" +
                        (mine ? '<div class="mine">' + esc(mine) + "</div>" : "") +
                        '<div class="right">✓ ' + esc(n.blankEn ? n.blankEn.replace("___", n.answers[0]) : n.answers[0]) +
                        ' <button class="icon-btn" style="width:30px;height:30px;display:inline-grid;vertical-align:middle" data-speak="' + esc(n.blankEn ? n.blankEn.replace("___", n.answers[0]) : n.answers[0]) + '" aria-label="듣기">' + icon("speaker", 'width="15" height="15"') + "</button></div>" +
                        '<div class="meta">' + boxesHTML(n.box) + '<span class="badge ' + (n.mastered ? "ok" : Srs.isDue(n, today) ? "bad" : "") + '">' + dueLabel(n, today) + "</span>" +
                        (n.wrongCount > 1 ? '<span class="badge warn">' + n.wrongCount + "번 틀림</span>" : "") + "</div></div>";
                }).join("") + "</div>"
                    : '<div class="empty"><div class="emo">' + (tab === "mastered" ? "🏅" : "✨") + "</div><h3>" +
                    (tab === "mastered" ? "아직 정복한 문장이 없어요" : all.length ? "여기는 비어 있어요" : "아직 틀린 문장이 없어요") + "</h3><p>" +
                    (tab === "mastered" ? "다섯 번 연속 맞히면 정복으로 옮겨져요" : "챕터를 학습하면서 틀린 문장이 자동으로 모여요") + "</p></div>");
        }
        el.addEventListener("click", function (e) {
            var t = e.target.closest("[data-tab],[data-ch],[data-del]");
            if (!t) return;
            if (t.dataset.tab) { tab = t.dataset.tab; render(); }
            else if (t.dataset.ch !== undefined) { chFilter = t.dataset.ch; render(); }
            else if (t.dataset.del) { A.deleteNote(t.dataset.del); UI.toast("오답노트에서 지웠어요", "🗑️"); render(); }
        });
        render();
    }

    // ---------------- 집중케어 연습 ----------------
    function CarePractice(el) {
        var early = query().mode === "all";
        var s = Store.get();
        var items = early
            ? Srs.sortForReview(Object.keys(s.wrongNotes).map(function (id) { return Object.assign({ id: id }, s.wrongNotes[id]); }).filter(function (n) { return !n.mastered; }))
            : A.dueWrong();
        var idx = 0, passed = 0, xp = 0;
        var cleanup = [];
        var today0 = Store.today();
        // 전체 연습이라도 오늘 복습일인 항목은 정식 복습으로 처리한다. 아직 날짜가 안 된 항목만 자율 연습
        function isEarly(n) { return early && !Srs.isDue(n, today0); }

        el.innerHTML = '<div class="session-top"><a class="icon-btn" href="#/care" aria-label="닫기">' + icon("close") + '</a><div class="progress"><i style="width:0"></i></div><span class="timer en"></span></div><div class="stage-host"></div>';
        var host = el.querySelector(".stage-host");
        var bar = el.querySelector(".progress i");
        var counter = el.querySelector(".timer");

        function finish() {
            if (A.dueWrong().length === 0) A.completeTask("review");
            host.innerHTML = '<div class="stage"><section class="result-hero" style="background:linear-gradient(135deg,#FF6B8B,#FF8E53)"><div class="trophy">' + (items.length ? "🎯" : "✨") + "</div>" +
                '<div class="big" style="margin-top:6px">' + passed + "/" + items.length + '</div><div style="margin-top:6px;font-weight:700">' +
                (items.length ? (passed === items.length ? "전부 맞혔어요! 기억이 단단해지고 있어요" : "틀린 문장은 내일 다시 나와요") : "오늘 복습할 오답이 없어요") + "</div></section>" +
                '<div class="stack" style="margin-top:16px"><a class="btn btn-primary btn-block" href="#/home">홈으로</a><a class="btn btn-soft btn-block" href="#/care">오답노트 보기</a></div></div>';
            bar.style.width = "100%";
            if (items.length) UI.confetti(passed === items.length ? 3000 : 1400);
        }

        function render() {
            cleanup.forEach(function (f) { f(); });
            cleanup = [];
            bar.style.width = Math.round(idx / Math.max(items.length, 1) * 100) + "%";
            counter.textContent = Math.min(idx + 1, items.length) + "/" + items.length;
            if (idx >= items.length) return finish();
            var n = items[idx];
            var c = chapterById(n.chapterId);
            if (c) el.style.setProperty("--card-grad", UI.gradient(c));
            var mine = n.history && n.history[0] ? n.history[0].answer : "";
            var isBlank = n.kind === "blank" && n.blankEn;
            host.innerHTML =
                '<div class="stage"><div class="step-label">🎯 집중케어 ' + (early ? "· 자율 연습" : "") + "</div>" +
                '<div class="drill-card"><div class="row between"><span class="badge">' + (c ? c.emoji + " " + esc(c.title) : "") + "</span>" + boxesHTML(n.box) + "</div>" +
                (n.context ? '<div class="msg partner" style="margin-top:14px;max-width:100%"><div class="avatar">' + (c ? c.emoji : "💬") + '</div><div class="bubble"><div class="en">' + esc(n.context) +
                    '</div><div class="ko">' + esc(n.contextKo) + '</div><button class="replay" data-speak="' + esc(n.context) + '" aria-label="듣기">' + icon("speaker", 'width="18" height="18"') + "</button></div></div>" : "") +
                '<div class="q" style="margin-top:14px">' + esc(n.ko) + "</div>" +
                (n.hint ? '<button class="hint-toggle" data-act="hint">' + icon("bulb", 'width="16" height="16"') + ' 힌트 <span class="hint-text" hidden>' + esc(n.hint) + "</span></button>" : "") +
                (mine ? '<div class="small faint" style="margin-top:8px">지난번 내 답: <span class="en" style="text-decoration:line-through">' + esc(mine) + "</span> · " + n.wrongCount + "번 틀림</div>" : "") +
                (isBlank ? '<div class="blank-sentence en">' + esc(n.blankEn.split("___")[0]) + '<input class="blank-input" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="빈칸">' + esc(n.blankEn.split("___")[1]) +
                    '</div><button class="btn btn-primary btn-block" style="margin-top:18px" data-act="check-blank">확인</button>' : '<div class="answer-host"></div>') +
                '</div><div class="fb-host"></div></div>';
            if (c && n.context && Store.get().settings.autoSpeak) Speech.speak(n.context);

            var fbHost = host.querySelector(".fb-host");
            function judge(text, anchor) {
                var r = G.grade(text, n.answers, { strict: !!n.strict && n.kind !== "arrange" });
                var gained = A.reviewWrong(n.id, text, r, isEarly(n));
                xp += gained;
                if (G.isPass(r)) passed++;
                UI.xpFloat(gained, anchor);
                var pass = G.isPass(r);
                var after = Store.get().wrongNotes[n.id] || {};
                fbHost.innerHTML = UI.feedbackHTML(r, {
                    actions: '<button class="btn btn-primary" data-act="next">' + (idx + 1 < items.length ? "다음 문장" : "결과 보기") + "</button>",
                    note: isEarly(n) ? (pass ? "자율 연습이라 복습 일정은 그대로예요" : "다시 틀려서 내일 복습으로 옮겼어요")
                        : (pass ? (after.mastered ? "🏅 완전히 정복! 오답노트에서 졸업했어요" : "다음 복습: " + dueLabel(after, Store.today())) : "내일 다시 물어볼게요")
                });
                Speech.speak(isBlank ? n.blankEn.replace("___", r.answer) : r.answer);
                if (pass && after.mastered) UI.confetti(1500);
                fbHost.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
            if (isBlank) {
                var bi = host.querySelector(".blank-input");
                var check = function () {
                    if (bi.disabled || !bi.value.trim()) return;
                    bi.disabled = true;
                    host.querySelector('[data-act="check-blank"]').remove();
                    judge(bi.value, bi);
                };
                bi.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.isComposing) check(); });
                host.querySelector('[data-act="check-blank"]').addEventListener("click", check);
            } else {
                var input = UI.answerInput(host.querySelector(".answer-host"), {
                    onSubmit: function (text) {
                        input.destroy();
                        host.querySelector(".answer-host").innerHTML = '<div class="en bold" style="margin-top:14px;font-size:17px">' + esc(text) + "</div>";
                        judge(text, host.querySelector(".drill-card"));
                    }
                });
                cleanup.push(input.destroy);
                input.focus();
            }
        }

        el.addEventListener("click", function (e) {
            var t = e.target.closest("[data-act]");
            if (!t) return;
            if (t.dataset.act === "next") { idx++; render(); root.scrollTo({ top: 0, behavior: "smooth" }); }
            if (t.dataset.act === "hint") t.querySelector(".hint-text").hidden = false;
        });
        render();
        return function () { cleanup.forEach(function (f) { f(); }); Speech.stopSpeaking(); };
    }

    // ---------------- 단어장 ----------------
    function Words(el) {
        var s = Store.get();
        var today = Store.today();
        var words = Object.keys(s.words).map(function (id) { return Object.assign({ id: id }, s.words[id]); });
        var learning = words.filter(function (w) { return !w.mastered; });
        var mastered = words.filter(function (w) { return w.mastered; });
        var due = A.dueWords();
        el.innerHTML =
            '<div class="page-head stage"><div><h1>단어장</h1><p>헷갈렸던 단어를 외울 때까지 반복해요</p></div></div>' +
            '<section class="today-hero stage" style="background:linear-gradient(135deg,#38BDF8 0%,#7C5CFF 60%,#C04CFD 100%)">' +
            '<div class="row between" style="position:relative;z-index:1"><div><div class="small bold" style="opacity:.9">오늘 복습할 단어</div><div class="en" style="font-size:54px;font-weight:800;line-height:1">' + due.length + "</div>" +
            '<div class="small" style="opacity:.9;margin-top:4px">외우는 중 ' + learning.length + " · 정복 " + mastered.length + '</div></div><div style="font-size:80px">🧠</div></div>' +
            '<a class="btn" style="background:#fff;color:#5B3FE0;margin-top:16px;position:relative;z-index:1" href="#/words/review">' + (due.length ? "단어 복습 시작" : "오늘 챕터 단어 훑어보기") + "</a></section>" +
            '<div class="section-title"><h2>외우는 중</h2></div>' +
            (learning.length ? '<div class="card"><div class="list">' + Srs.sortForReview(learning).map(function (w) {
                return '<button class="row" style="padding:8px 0;width:100%;text-align:left;border-bottom:1px solid var(--border)" data-speak="' + esc(w.word) + '"><span class="grow"><span class="en bold">' + esc(w.word) +
                    '</span> <span class="small muted">' + esc(w.meaning) + '</span></span>' + boxesHTML(w.box) + '<span class="badge' + (Srs.isDue(w, today) ? " bad" : "") + '" style="margin-left:6px">' + dueLabel(w, today) + "</span></button>";
            }).join("") + "</div></div>" : '<div class="empty"><div class="emo">📚</div><h3>아직 담은 단어가 없어요</h3><p>챕터 학습에서 \'헷갈려요\'를 누르면 여기에 모여요</p></div>') +
            (mastered.length ? '<div class="section-title"><h2>정복한 단어 🏅</h2></div><div class="row" style="flex-wrap:wrap;gap:8px">' +
                mastered.map(function (w) { return '<button class="badge ok en" data-speak="' + esc(w.word) + '">' + esc(w.word) + "</button>"; }).join("") + "</div>" : "");
    }

    // ---------------- 단어 복습 ----------------
    function WordsReview(el) {
        var due = A.dueWords();
        var fresh = !due.length;
        var ch = root.EEViews.todayChapter();
        var cards = fresh && ch
            ? ch.vocab.map(function (v) { return Object.assign({ id: A.wordId(ch.id, v.word), chapterId: ch.id }, v); })
            : due;
        var idx = 0, known = 0;

        el.innerHTML = '<div class="session-top"><a class="icon-btn" href="#/words" aria-label="닫기">' + icon("close") + '</a><div class="progress"><i style="width:0"></i></div><span class="timer en"></span></div><div class="stage-host"></div>';
        var host = el.querySelector(".stage-host");
        var bar = el.querySelector(".progress i");
        var counter = el.querySelector(".timer");

        function render() {
            bar.style.width = Math.round(idx / Math.max(cards.length, 1) * 100) + "%";
            counter.textContent = Math.min(idx + 1, cards.length) + "/" + cards.length;
            if (idx >= cards.length) {
                A.completeTask("words");
                host.innerHTML = '<div class="stage"><section class="result-hero" style="background:linear-gradient(135deg,#38BDF8,#7C5CFF)"><div class="trophy">🧠</div><div class="big" style="margin-top:6px">' + known + "/" + cards.length +
                    '</div><div style="margin-top:6px;font-weight:700">' + (fresh ? "모르는 단어는 단어장에 담았어요" : "몰랐던 단어는 내일 다시 나와요") + '</div></section><div class="stack" style="margin-top:16px"><a class="btn btn-primary btn-block" href="#/home">홈으로</a><a class="btn btn-soft btn-block" href="#/words">단어장 보기</a></div></div>';
                UI.confetti(1400);
                return;
            }
            var w = cards[idx];
            var c = chapterById(w.chapterId);
            if (c) el.style.setProperty("--card-grad", UI.gradient(c));
            host.innerHTML =
                '<div class="stage"><div class="step-label">🧠 ' + (fresh ? "오늘 챕터 단어" : "단어 복습") + "</div>" +
                '<div class="flashcard" data-act="flip" role="button" aria-label="카드 뒤집기"><div class="inner">' +
                '<div class="face front"><button class="icon-btn speak-fab" data-speak="' + esc(w.word) + '" aria-label="발음 듣기">' + icon("speaker") + "</button>" +
                '<div class="word">' + esc(w.word) + '</div><div class="pos">' + esc(w.pos) + '</div><div class="tap">👆 뜻을 떠올리고 탭하세요</div></div>' +
                '<div class="face back"><button class="icon-btn speak-fab" data-speak="' + esc(w.example) + '" aria-label="예문 듣기">' + icon("speaker") + "</button>" +
                '<div class="faint en bold">' + esc(w.word) + '</div><div class="meaning">' + esc(w.meaning) + '</div><div class="ex"><div class="en">' + esc(w.example) + '</div><div class="small muted">' + esc(w.exampleKo) + "</div></div></div>" +
                "</div></div>" +
                '<div class="btn-row" style="margin-top:18px"><button class="btn btn-soft" data-act="no">😵 몰랐어요</button><button class="btn btn-primary" data-act="yes">알았어요 😎</button></div></div>';
            if (Store.get().settings.autoSpeak) Speech.speak(w.word);
        }
        el.addEventListener("click", function (e) {
            var t = e.target.closest("[data-act],[data-speak]");
            if (!t) return;
            if (t.dataset.speak) { e.stopPropagation(); Speech.speak(t.dataset.speak); return; }
            var act = t.dataset.act;
            if (act === "flip") { t.classList.toggle("flipped"); return; }
            var w = cards[idx];
            var c = chapterById(w.chapterId);
            if (act === "yes") {
                known++;
                if (fresh) A.markWordKnown(c, w); else A.reviewWord(w.id, true);
            }
            if (act === "no") {
                if (fresh) A.markWordUnknown(c, w); else A.reviewWord(w.id, false);
            }
            idx++;
            render();
        });
        render();
        return function () { Speech.stopSpeaking(); };
    }

    // ---------------- 쉐도잉 ----------------
    // 음성인식 결과는 발음 평가가 아니라 '받아쓰기 일치율'이다. 오답노트에는 넣지 않는다 (인식 오류를 사용자 오류로 기록하지 않기 위해)
    function Shadow(el, params) {
        var ch = chapterById(params[0]);
        if (!ch) { location.hash = "#/chapters"; return; }
        var pool = [];
        ch.dialogues.forEach(function (d) {
            d.lines.forEach(function (l) {
                if (l.speaker === "you") pool.push({ en: l.answers[0], ko: l.ko });
            });
        });
        var stepSize = pool.length / SHADOW_COUNT;
        var lines = pool.length <= SHADOW_COUNT ? pool : Array.from({ length: SHADOW_COUNT }, function (_, i) { return pool[Math.floor(i * stepSize)]; });
        var idx = 0, scores = [];
        var session = null;
        el.style.setProperty("--card-grad", UI.gradient(ch));
        el.innerHTML = '<div class="session-top"><a class="icon-btn" href="#/chapter/' + ch.id + '" aria-label="닫기">' + icon("close") + '</a><div class="progress"><i style="width:0"></i></div><span class="timer en"></span></div><div class="stage-host"></div>';
        var host = el.querySelector(".stage-host");
        var bar = el.querySelector(".progress i");
        var counter = el.querySelector(".timer");

        function stopListening() { if (session) { session.stop(); session = null; } }

        function render() {
            stopListening();
            bar.style.width = Math.round(idx / lines.length * 100) + "%";
            counter.textContent = Math.min(idx + 1, lines.length) + "/" + lines.length;
            if (idx >= lines.length) {
                A.completeTask("shadow");
                var avg = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) : null;
                host.innerHTML = '<div class="stage"><section class="result-hero" style="background:' + UI.gradient(ch) + '"><div class="trophy">🎧</div>' +
                    '<div class="big" style="margin-top:6px">' + lines.length + '<span style="font-size:24px">문장</span></div><div style="margin-top:6px;font-weight:700">' +
                    (avg !== null ? "음성 인식 평균 일치율 " + avg + "% (" + scores.length + "문장 측정)" : "따라 말하기 완료!") + "</div></section>" +
                    '<div class="stack" style="margin-top:16px"><a class="btn btn-primary btn-block" href="#/home">홈으로</a></div></div>';
                UI.confetti(1600);
                return;
            }
            var line = lines[idx];
            host.innerHTML =
                '<div class="stage"><div class="step-label">🎧 쉐도잉 — 듣고, 똑같이 따라 말하기</div>' +
                '<div class="shadow-card"><div class="line">' + esc(line.en) + '</div><div class="ko">' + esc(line.ko) + "</div>" +
                '<button class="play-big" data-act="play" aria-label="듣기">' + icon("play") + "</button>" +
                '<div class="row" style="justify-content:center;margin-top:12px"><button class="btn btn-ghost btn-s" data-act="slow">🐢 천천히</button></div>' +
                '<div class="score-meter"></div></div>' +
                '<div class="btn-row" style="margin-top:16px">' +
                (Speech.canListen ? '<button class="btn btn-warm" data-act="record">' + icon("mic", 'width="20" height="20"') + " 따라 말하기</button>" : "") +
                '<button class="btn ' + (Speech.canListen ? "btn-soft" : "btn-primary") + '" data-act="next">' + (Speech.canListen ? "다음" : "따라 했어요 →") + "</button></div></div>";
            if (Speech.canListen) Speech.prepareListening();
            play(1);
        }

        function play(rateFactor) {
            var btn = host.querySelector(".play-big");
            if (btn) btn.classList.add("playing");
            var base = Store.get().settings.rate || 0.95;
            Speech.speak(lines[idx].en, { rate: base * rateFactor }).then(function () { if (btn) btn.classList.remove("playing"); });
        }

        function record(btn) {
            if (session) { stopListening(); return; }
            var meter = host.querySelector(".score-meter");
            btn.innerHTML = icon("stop", 'width="20" height="20"') + " 듣는 중…";
            meter.innerHTML = '<div class="interim">듣고 있어요…</div>';
            session = Speech.listen(function (t) { meter.innerHTML = '<div class="interim">' + esc(t) + "</div>"; });
            session.promise.then(function (text) {
                session = null;
                btn.innerHTML = icon("mic", 'width="20" height="20"') + " 다시 말하기";
                if (!text) { meter.innerHTML = '<div class="small muted">잘 안 들렸어요. 다시 해 볼까요?</div>'; return; }
                var r = G.grade(text, [lines[idx].en]);
                var pct = Math.round(r.score * 100);
                scores.push(pct);
                A.addShadowXP();
                meter.innerHTML = '<div class="num en" style="color:' + (pct >= 90 ? "var(--ok)" : pct >= 70 ? "var(--warn)" : "var(--bad)") + '">' + pct + '%</div><div class="diff" style="margin-top:6px">' + UI.diffHTML(r.ops) + "</div>";
            }).catch(function () {
                session = null;
                btn.innerHTML = icon("mic", 'width="20" height="20"') + " 따라 말하기";
                meter.innerHTML = '<div class="small muted">음성 인식을 쓸 수 없어요. 소리 내어 따라 말하고 다음으로 넘어가세요.</div>';
            });
        }

        el.addEventListener("click", function (e) {
            var t = e.target.closest("[data-act]");
            if (!t) return;
            var act = t.dataset.act;
            if (act === "play") play(1);
            if (act === "slow") play(0.75);
            if (act === "record") record(t);
            if (act === "next") { idx++; render(); }
        });
        render();
        return function () { stopListening(); Speech.stopSpeaking(); };
    }

    root.EEViews = Object.assign(root.EEViews || {}, {
        Care: Care, CarePractice: CarePractice, Words: Words, WordsReview: WordsReview, Shadow: Shadow
    });
})(window);
