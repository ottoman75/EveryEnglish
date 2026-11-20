/* 홈 · 챕터 목록 · 챕터 상세 · 내 정보 */
(function (root) {
    "use strict";
    var UI = root.EEUI, Store = root.EEStore, Plan = root.EEPlan, Srs = root.EESrs, A = root.EEActions;
    var esc = UI.esc, icon = UI.icon;
    var DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

    function chapters() { return root.EE_CHAPTERS; }
    function chapterById(id) { return chapters().find(function (c) { return c.id === id; }); }
    function todayChapter() { return Plan.pickTodayChapter(chapters(), Store.get().progress, Store.today()); }

    function minutesToday() { return Math.floor(((Store.get().daily[Store.today()] || {}).seconds || 0) / 60); }

    // 복습할 게 없으면 그 과제는 끝난 것으로 본다
    function taskStatus() {
        var tasks = (Store.get().daily[Store.today()] || {}).tasks || {};
        return {
            review: !!tasks.review || A.dueWrong().length === 0,
            chapter: !!tasks.chapter,
            words: !!tasks.words,
            shadow: !!tasks.shadow
        };
    }

    function greeting() {
        var h = new Date().getHours();
        if (h < 6) return "늦은 밤에도 열공";
        if (h < 12) return "좋은 아침이에요";
        if (h < 18) return "좋은 오후예요";
        return "좋은 저녁이에요";
    }

    // ---------------- 홈 ----------------
    function Home(el) {
        var s = Store.get();
        var today = Store.today();
        var ch = todayChapter();
        var mins = minutesToday();
        var goal = Plan.DAILY_GOAL_MINUTES;
        var status = taskStatus();
        var dueWrong = A.dueWrong().length;
        var dueWords = A.dueWords().length;
        var streak = Plan.streak(s.daily, today);
        var doneCount = Object.keys(status).filter(function (k) { return status[k]; }).length;
        var notes = Object.keys(s.wrongNotes).map(function (k) { return s.wrongNotes[k]; });
        var mastered = notes.filter(function (n) { return n.mastered; }).length;
        var completed = Object.keys(s.progress).filter(function (k) { return s.progress[k].completedCount; }).length;
        var lv = A.level(s.xp || 0);

        var links = {
            review: dueWrong ? "#/care/practice" : "#/care",
            chapter: ch ? "#/learn/" + ch.id : "#/chapters",
            words: "#/words/review",
            shadow: ch ? "#/shadow/" + ch.id : "#/chapters"
        };
        var subtitles = {
            review: dueWrong ? "오늘 복습할 문장 " + dueWrong + "개" : "복습할 오답이 없어요",
            chapter: ch ? ch.title : "",
            words: dueWords ? "복습할 단어 " + dueWords + "개" : "오늘 챕터 단어 훑어보기",
            shadow: "원어민 따라 말하기"
        };

        var week = [];
        for (var i = 6; i >= 0; i--) {
            var key = Srs.addDays(today, -i);
            var p = key.split("-").map(Number);
            var d = new Date(p[0], p[1] - 1, p[2]);
            var m = Math.floor(((s.daily[key] || {}).seconds || 0) / 60);
            week.push({ key: key, label: i === 0 ? "오늘" : DAY_LABELS[d.getDay()], minutes: m });
        }

        el.innerHTML =
            '<div class="greet stage">' +
            '<div><p>' + greeting() + (s.profile.name ? ", " + esc(s.profile.name) + "님" : "") + ' 👋</p><h1>오늘도 30분,<br>영어로 말해볼까요?</h1></div>' +
            '<div class="streak-pill" title="연속 학습일"><span class="flame">🔥</span><span class="en">' + streak + "</span></div>" +
            "</div>" +

            '<section class="today-hero stage">' +
            '<div class="top"><div class="ring">' + UI.ring(Math.min(mins, goal), goal) +
            '<div class="label"><div><b>' + mins + '</b><span>/ ' + goal + "분</span></div></div></div>" +
            "<div><h2>오늘의 30분 루틴</h2><p>" +
            (mins >= goal ? "목표 달성! 오늘도 해냈어요 🎉" : doneCount + " / 4 완료 · " + Math.max(goal - mins, 0) + "분 남았어요") +
            '</p><div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap"><span class="badge glass">Lv.' + lv.level + '</span><span class="badge glass">⚡ ' + ((s.daily[today] || {}).xp || 0) + " XP</span></div></div></div>" +
            '<div class="task-list">' +
            Plan.TASKS.map(function (t) {
                return '<a class="task' + (status[t.key] ? " done" : "") + '" href="' + links[t.key] + '">' +
                    '<span class="ico">' + t.icon + "</span>" +
                    '<span class="grow"><div class="t">' + t.title + '</div><div class="s">' + esc(subtitles[t.key]) + "</div></span>" +
                    '<span class="min">' + t.minutes + "분</span>" +
                    '<span class="check" style="margin-left:8px">' + (status[t.key] ? "✓" : "") + "</span></a>";
            }).join("") +
            "</div></section>" +

            (dueWrong ? '<div class="section-title"><h2>집중케어 필요</h2></div>' +
                '<a class="alert-card stage" href="#/care/practice"><span class="ico">🎯</span><span><b>틀렸던 문장 ' + dueWrong + '개가 기다려요</b><span>지금 복습하면 기억에 오래 남아요</span></span><span class="chev">' + icon("chev", 'width="20" height="20"') + "</span></a>" : "") +

            (ch ? '<div class="section-title"><h2>오늘의 챕터</h2><a href="#/chapters">전체 보기</a></div>' +
                '<a class="chapter-hero stage" href="#/chapter/' + ch.id + '" style="background:' + UI.gradient(ch) + '">' +
                '<span class="badge glass">CH.' + ch.order + " · " + ch.level + "</span>" +
                '<h3>' + esc(ch.title) + '</h3><div class="en">' + esc(ch.titleEn) + "</div>" +
                '<span class="cta">' + (s.progress[ch.id] && s.progress[ch.id].completedCount ? "다시 연습하기" : "15분 학습 시작") + " " + icon("chev", 'width="16" height="16"') + "</span>" +
                '<span class="emoji-big">' + ch.emoji + "</span></a>" : "") +

            '<div class="section-title"><h2>이번 주 학습</h2><span class="small faint">목표 ' + goal + "분</span></div>" +
            '<div class="card stage"><div class="week">' +
            week.map(function (w) {
                var pct = Math.min(100, Math.round(w.minutes / goal * 100));
                return '<div class="col' + (w.key === today ? " today" : "") + '"><div class="bar' + (w.minutes >= goal ? " goal" : "") +
                    '" title="' + w.minutes + '분"><i style="height:' + pct + '%"></i></div><span>' + w.label + "</span></div>";
            }).join("") +
            "</div></div>" +

            '<div class="section-title"><h2>나의 기록</h2></div>' +
            '<div class="stats stage">' +
            '<div class="stat"><b>' + completed + '<small class="faint" style="font-size:14px">/' + chapters().length + "</small></b><span>완료한 챕터</span></div>" +
            '<div class="stat"><b>' + mastered + "</b><span>정복한 오답</span></div>" +
            '<div class="stat"><b>' + (s.xp || 0) + "</b><span>누적 XP</span></div>" +
            "</div>";
    }

    // ---------------- 챕터 목록 ----------------
    function Chapters(el) {
        var s = Store.get();
        var todayId = (todayChapter() || {}).id;
        var levels = ["전체"].concat(Array.from(new Set(chapters().map(function (c) { return c.level; }))).sort());
        var filter = "전체";
        function render() {
            var list = chapters().filter(function (c) { return filter === "전체" || c.level === filter; });
            el.innerHTML =
                '<div class="page-head stage"><div><h1>상황별 챕터</h1><p>챕터 하나 = 15분 실전 회화</p></div></div>' +
                '<div class="filter-row" style="margin-bottom:16px">' +
                levels.map(function (l) { return '<button data-level="' + l + '" class="' + (l === filter ? "active" : "") + '">' + l + "</button>"; }).join("") +
                "</div>" +
                '<div class="chapter-grid">' +
                list.map(function (c, i) {
                    var p = s.progress[c.id];
                    return '<a class="ch-card stage' + (c.id === todayId ? " today-ring" : "") + '" href="#/chapter/' + c.id + '" style="background:' + UI.gradient(c) + ";animation-delay:" + (i * 30) + 'ms">' +
                        (p && p.completedCount ? '<span class="done-badge">✓</span>' : "") +
                        '<span class="num">CH.' + String(c.order).padStart(2, "0") + " · " + c.level + "</span>" +
                        '<span class="emo">' + c.emoji + "</span>" +
                        "<div><h3>" + esc(c.title) + '</h3><div class="meter"><i style="width:' + (p ? p.bestScore : 0) + '%"></i></div></div></a>';
                }).join("") +
                "</div>";
        }
        el.addEventListener("click", function (e) {
            var b = e.target.closest("[data-level]");
            if (b) { filter = b.dataset.level; render(); }
        });
        render();
    }

    // ---------------- 챕터 상세 ----------------
    function ChapterDetail(el, params) {
        var c = chapterById(params[0]);
        if (!c) { location.hash = "#/chapters"; return; }
        var s = Store.get();
        var p = s.progress[c.id];
        var resume = s.inProgress && s.inProgress.chapterId === c.id && s.inProgress.stepIndex > 0;
        var youLines = c.dialogues.reduce(function (n, d) { return n + d.lines.filter(function (l) { return l.speaker === "you"; }).length; }, 0);
        var noteCount = Object.keys(s.wrongNotes).filter(function (k) { return s.wrongNotes[k].chapterId === c.id && !s.wrongNotes[k].mastered; }).length;

        el.innerHTML =
            '<div class="row stage" style="margin-bottom:14px"><a class="icon-btn" href="#/chapters" aria-label="뒤로">' + icon("back") + "</a></div>" +
            '<section class="detail-hero stage" style="background:' + UI.gradient(c) + '">' +
            '<span class="badge glass">CH.' + c.order + " · " + c.level + "</span>" +
            "<h1>" + esc(c.title) + '</h1><p class="en" style="font-weight:700">' + esc(c.titleEn) + "</p>" +
            '<p style="margin-top:8px">🎯 ' + esc(c.goal) + "</p>" +
            '<span class="emoji-big">' + c.emoji + "</span>" +
            '<div class="flow"><div><b>' + c.vocab.length + '</b><span>단어</span></div><div><b>' + c.expressions.length + '</b><span>핵심표현</span></div>' +
            "<div><b>" + youLines + '</b><span>롤플레이</span></div><div><b>' + c.drills.length + "</b><span>드릴</span></div></div>" +
            "</section>" +

            '<div class="stack" style="margin-top:16px">' +
            '<a class="btn btn-primary btn-block" href="#/learn/' + c.id + '">' + (resume ? "이어서 학습하기" : p && p.completedCount ? "다시 학습하기" : "15분 학습 시작") + "</a>" +
            '<div class="btn-row"><a class="btn btn-soft" href="#/shadow/' + c.id + '">🎧 쉐도잉</a>' +
            '<a class="btn btn-soft" href="#/care?ch=' + c.id + '">🎯 오답 ' + noteCount + "</a></div>" +
            (p ? '<div class="card row between"><span class="small muted">최고 점수 <b class="en" style="color:var(--text)">' + p.bestScore + '</b> · 완료 ' + p.completedCount + '회</span><span class="small faint">' + p.lastDone + "</span></div>" : "") +
            "</div>" +

            '<div class="section-title"><h2>핵심 표현</h2></div>' +
            '<div class="list">' + c.expressions.map(function (x) {
                return '<button class="list-item" data-speak="' + esc(x.example) + '"><span class="lead" style="background:' + UI.gradient(c) + ';color:#fff">' + icon("speaker", 'width="18" height="18"') + '</span><span class="grow"><div class="en bold">' + esc(x.en) + '</div><div class="small muted">' + esc(x.ko) + "</div></span></button>";
            }).join("") + "</div>" +

            '<div class="section-title"><h2>장면</h2></div>' +
            '<div class="list">' + c.dialogues.map(function (d, i) {
                return '<div class="list-item"><span class="lead">' + (i + 1) + '</span><span class="grow"><div class="bold">' + esc(d.title) + '</div><div class="small muted">' + esc(d.setting) + "</div></span></div>";
            }).join("") + "</div>" +

            '<div class="section-title"><h2>단어 ' + c.vocab.length + "</h2></div>" +
            '<div class="card"><div class="list">' + c.vocab.map(function (v) {
                return '<button class="row" style="padding:6px 0;text-align:left;width:100%" data-speak="' + esc(v.word) + '"><span class="en bold" style="min-width:110px">' + esc(v.word) + '</span><span class="small muted grow">' + esc(v.meaning) + '</span><span class="faint">' + icon("speaker", 'width="16" height="16"') + "</span></button>";
            }).join("") + "</div></div>";
    }

    // ---------------- 내 정보 ----------------
    function Me(el) {
        function render() {
            var s = Store.get();
            var lv = A.level(s.xp || 0);
            var voices = root.EESpeech.voices();
            var theme = document.documentElement.dataset.theme || "system";
            var totalMin = Math.floor(Object.keys(s.daily).reduce(function (n, k) { return n + (s.daily[k].seconds || 0); }, 0) / 60);
            var days = Object.keys(s.daily).filter(function (k) { return (s.daily[k].seconds || 0) >= 60; }).length;
            var learningWords = Object.keys(s.words).filter(function (k) { return !s.words[k].mastered; }).length;

            el.innerHTML =
                '<div class="page-head stage"><div><h1>내 정보</h1><p>기록은 이 기기의 브라우저에 저장돼요</p></div></div>' +
                '<div class="card pad-l stage"><div class="row"><div class="avatar-big">' + esc((s.profile.name || "나").slice(0, 1)) + '</div>' +
                '<div class="grow"><div class="row between"><b style="font-size:20px">' + esc(s.profile.name || "학습자") + '</b><button class="btn btn-soft btn-s" data-act="rename">이름 변경</button></div>' +
                '<div class="small muted">Lv.' + lv.level + " · " + lv.into + " / " + lv.span + " XP</div>" +
                '<div class="level-bar"><i style="width:' + Math.round(lv.into / lv.span * 100) + '%"></i></div></div></div></div>' +

                '<div class="stats stage" style="margin-top:12px">' +
                '<div class="stat"><b>' + totalMin + '</b><span>총 학습(분)</span></div>' +
                '<div class="stat"><b>' + days + '</b><span>학습한 날</span></div>' +
                '<div class="stat"><b>' + learningWords + '</b><span>외우는 단어</span></div></div>' +

                '<div class="section-title"><h2>학습 설정</h2></div>' +
                '<div class="card stage">' +
                '<div class="setting"><div><b>상대방 대사 자동 재생</b><span>롤플레이에서 상대 말을 바로 들려줘요</span></div><button class="switch' + (s.settings.autoSpeak ? " on" : "") + '" data-act="autospeak" role="switch" aria-checked="' + !!s.settings.autoSpeak + '" aria-label="자동 재생"></button></div>' +
                '<div class="setting"><div><b>말하기 속도</b><span class="en">' + s.settings.rate.toFixed(2) + 'x</span></div><input type="range" min="0.6" max="1.2" step="0.05" value="' + s.settings.rate + '" data-act="rate" aria-label="말하기 속도"></div>' +
                '<div class="setting"><div><b>목소리</b><span>' + (root.EESpeech.hasRecordedAudio() && !s.settings.voiceURI
                    ? "원어민 뉴럴 음성으로 녹음된 오디오를 재생해요"
                    : "브라우저 음성 — 기기마다 품질이 달라요") + '</span></div>' +
                '<div class="row" style="gap:6px"><select data-act="voice" aria-label="목소리">' +
                '<option value="">' + (root.EESpeech.hasRecordedAudio() ? "🎙️ 원어민 녹음 (추천)" : "자동 (가장 자연스러운 음성)") + "</option>" +
                voices.filter(function (v) { return root.EESpeech.voiceScore(v) > 0; }).map(function (v) {
                    return '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === s.settings.voiceURI ? " selected" : "") + ">" + esc(v.name) + " · " + esc(v.lang) + "</option>";
                }).join("") +
                '</select><button class="icon-btn" style="width:38px;height:38px" data-act="preview-voice" aria-label="미리 듣기">' + icon("speaker", 'width="18" height="18"') + "</button></div></div>" +
                '<div class="setting"><div><b>화면 테마</b></div><div class="segmented" style="width:200px">' +
                ["system", "light", "dark"].map(function (t) { return '<button data-theme-set="' + t + '" class="' + (t === theme ? "active" : "") + '">' + { system: "자동", light: "라이트", dark: "다크" }[t] + "</button>"; }).join("") +
                "</div></div>" +
                '<div class="setting"><div><b>음성 인식</b><span>' + (root.EESpeech.canListen ? "사용 가능 — 마이크 버튼으로 말해 보세요" : "이 브라우저/주소에서는 사용할 수 없어요. 크롬·사파리에서 https 또는 localhost로 열어 주세요") + "</span></div></div>" +
                "</div>" +

                '<div class="section-title"><h2>데이터</h2></div>' +
                '<div class="card stage">' +
                '<div class="setting"><div><b>백업 내보내기</b><span>다른 기기로 옮길 때 사용</span></div><button class="btn btn-soft btn-s" data-act="export">내보내기</button></div>' +
                '<div class="setting"><div><b>백업 불러오기</b><span>현재 기록을 덮어써요</span></div><label class="btn btn-soft btn-s">불러오기<input type="file" accept="application/json" hidden data-act="import"></label></div>' +
                '<div class="setting"><div><b style="color:var(--bad)">모든 기록 초기화</b><span>되돌릴 수 없어요</span></div><button class="btn btn-s" style="color:var(--bad)" data-act="reset">초기화</button></div>' +
                "</div>";
        }

        el.addEventListener("click", function (e) {
            var t = e.target.closest("[data-act],[data-theme-set]");
            if (!t) return;
            if (t.dataset.themeSet) {
                root.EEApp.setTheme(t.dataset.themeSet);
                render();
                return;
            }
            var act = t.dataset.act;
            if (act === "preview-voice") root.EESpeech.speak("Hi there! What can I get for you?");
            if (act === "autospeak") { Store.update(function (s) { s.settings.autoSpeak = !s.settings.autoSpeak; }); render(); }
            if (act === "rename") root.EEApp.askName(render);
            if (act === "export") {
                var blob = new Blob([Store.exportJSON()], { type: "application/json" });
                var a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "everyenglish-backup-" + Store.today() + ".json";
                a.click();
                setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
            }
            if (act === "reset") {
                UI.sheet('<h2>모든 기록을 지울까요?</h2><p class="muted">연속 학습일, 오답노트, 단어장이 모두 사라져요.</p><div class="btn-row" style="margin-top:18px"><button class="btn btn-soft" data-x="no">취소</button><button class="btn btn-bad" data-x="yes">초기화</button></div>', function (sh, close) {
                    sh.addEventListener("click", function (ev) {
                        var b = ev.target.closest("[data-x]");
                        if (!b) return;
                        if (b.dataset.x === "yes") { Store.reset(); UI.toast("초기화했어요", "🧹"); }
                        close(); render();
                    });
                });
            }
        });
        el.addEventListener("change", function (e) {
            var t = e.target;
            if (t.dataset.act === "voice") {
                Store.update(function (s) { s.settings.voiceURI = t.value; });
                root.EESpeech.speak("Hi there! What can I get for you?");
                render();
            }
            if (t.dataset.act === "import" && t.files[0]) {
                t.files[0].text().then(function (text) {
                    try { Store.importJSON(text); UI.toast("백업을 불러왔어요", "✅"); render(); }
                    catch (err) { UI.toast(err.message, "⚠️"); }
                });
            }
        });
        el.addEventListener("input", function (e) {
            if (e.target.dataset.act === "rate") {
                var v = parseFloat(e.target.value);
                Store.update(function (s) { s.settings.rate = v; });
                e.target.closest(".setting").querySelector(".en").textContent = v.toFixed(2) + "x";
            }
        });
        el.addEventListener("change", function (e) {
            if (e.target.dataset.act === "rate") root.EESpeech.speak("Hi there! What can I get for you?");
        });
        render();
    }

    root.EEViews = Object.assign(root.EEViews || {}, {
        Home: Home, Chapters: Chapters, ChapterDetail: ChapterDetail, Me: Me,
        chapterById: chapterById, todayChapter: todayChapter, taskStatus: taskStatus
    });
})(window);
