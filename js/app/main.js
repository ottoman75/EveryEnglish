/* 라우터 · 앱 셸 · 공용 이벤트 */
(function (root) {
    "use strict";
    var UI = root.EEUI, Store = root.EEStore, A = root.EEActions, V = root.EEViews;
    var THEME_KEY = "everyenglish:theme";

    // immersive: 탭바를 숨기는 몰입 화면 / study: 학습 시간으로 집계하는 화면
    var ROUTES = [
        { re: /^#\/home$/, view: "Home", tab: "home" },
        { re: /^#\/chapters$/, view: "Chapters", tab: "chapters" },
        { re: /^#\/chapter\/([\w-]+)$/, view: "ChapterDetail", tab: "chapters" },
        { re: /^#\/learn\/([\w-]+)$/, view: "Learn", immersive: true, study: true },
        { re: /^#\/care(\?.*)?$/, view: "Care", tab: "care" },
        { re: /^#\/care\/practice(\?.*)?$/, view: "CarePractice", immersive: true, study: true },
        { re: /^#\/words$/, view: "Words", tab: "words" },
        { re: /^#\/words\/review$/, view: "WordsReview", immersive: true, study: true },
        { re: /^#\/shadow\/([\w-]+)$/, view: "Shadow", immersive: true, study: true },
        { re: /^#\/me$/, view: "Me", tab: "me" }
    ];

    var NAV = [
        { tab: "home", href: "#/home", label: "홈", icon: "home" },
        { tab: "chapters", href: "#/chapters", label: "챕터", icon: "book" },
        { tab: "care", href: "#/care", label: "집중케어", icon: "target" },
        { tab: "words", href: "#/words", label: "단어장", icon: "cards" },
        { tab: "me", href: "#/me", label: "내 정보", icon: "user" }
    ];

    var main, destroyCurrent = null, currentRoute = null;

    function navHTML(cls) {
        var due = A.dueWrong().length;
        var items = cls === "tabbar" ? NAV.filter(function (n) { return n.tab !== "me"; }) : NAV;
        return items.map(function (n) {
            var active = currentRoute && currentRoute.tab === n.tab;
            return '<a href="' + n.href + '" class="' + (active ? "active" : "") + '"' + (active ? ' aria-current="page"' : "") + ">" +
                UI.icon(n.icon) + "<span>" + n.label + "</span>" +
                (n.tab === "care" && due ? '<span class="dot">' + due + "</span>" : "") + "</a>";
        }).join("");
    }

    function renderNav() {
        document.querySelector(".tabbar").innerHTML = navHTML("tabbar");
        document.querySelector(".sidebar nav").innerHTML = navHTML("sidebar");
    }

    function route() {
        var hash = location.hash || "#/home";
        var match = null, params = [];
        for (var i = 0; i < ROUTES.length; i++) {
            var m = ROUTES[i].re.exec(hash);
            if (m) { match = ROUTES[i]; params = m.slice(1); break; }
        }
        if (!match) { location.replace("#/home"); return; }
        if (typeof destroyCurrent === "function") destroyCurrent();
        destroyCurrent = null;
        root.EESpeech.stopSpeaking();
        currentRoute = match;
        document.body.classList.toggle("immersive", !!match.immersive);
        main.classList.toggle("immersive", !!match.immersive);

        // 이전 화면의 이벤트 리스너를 남기지 않도록 매번 새 컨테이너
        var view = document.createElement("div");
        view.className = "view";
        main.replaceChildren(view);
        destroyCurrent = V[match.view](view, params);
        renderNav();
        if (!match.immersive) root.scrollTo(0, 0);
    }

    function setTheme(t) {
        if (t === "system") delete document.documentElement.dataset.theme;
        else document.documentElement.dataset.theme = t;
        try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* 저장 불가 환경 */ }
        var meta = document.querySelector('meta[name="theme-color"]');
        var dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
        if (meta) meta.content = dark ? "#0A0720" : "#F5F3FF";
    }

    function askName(onDone) {
        var current = Store.get().profile.name || "";
        UI.sheet(
            '<div style="font-size:44px">👋</div><h2>반가워요! 뭐라고 불러드릴까요?</h2><p class="muted small">매일 30분, 상황별 회화로 영어 말문을 틔워 드릴게요.</p>' +
            '<input class="field" style="margin-top:14px" maxlength="12" placeholder="이름 또는 닉네임" value="' + UI.esc(current) + '">' +
            '<div class="btn-row" style="margin-top:14px"><button class="btn btn-soft" data-x="skip">나중에</button><button class="btn btn-primary" data-x="ok">시작하기</button></div>' +
            '<button class="btn btn-ghost btn-block btn-s" style="margin-top:8px" data-x="sync">☁️ 다른 기기에서 하던 기록 가져오기</button>',
            function (sh, close) {
                var input = sh.querySelector("input");
                setTimeout(function () { input.focus(); }, 300);
                function done(save) {
                    Store.update(function (s) {
                        if (save) { s.profile.name = input.value.trim(); s.profile.nameUpdatedAt = Date.now(); }
                        if (!s.profile.createdAt) s.profile.createdAt = Store.today();
                    });
                    close();
                    if (onDone) onDone(); else route();
                }
                input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.isComposing) done(true); });
                sh.addEventListener("click", function (e) {
                    var b = e.target.closest("[data-x]");
                    if (!b) return;
                    if (b.dataset.x === "sync") {
                        done(false);
                        location.hash = "#/me";
                        setTimeout(function () { var c = document.getElementById("sync"); if (c) c.scrollIntoView({ behavior: "smooth" }); }, 300);
                        return;
                    }
                    done(b.dataset.x === "ok");
                });
            }
        );
    }

    function boot() {
        main = document.querySelector(".main");
        root.EE_CHAPTERS.sort(function (a, b) { return a.order - b.order; });
        try { setTheme(localStorage.getItem(THEME_KEY) || "system"); } catch (e) { setTheme("system"); }

        // 화면 어디서든 data-speak 버튼은 발음을 들려준다. 클릭을 직접 처리하는 뷰는 stopPropagation 한다
        document.addEventListener("click", function (e) {
            var t = e.target.closest("[data-speak]");
            if (t && !t.dataset.act) root.EESpeech.speak(t.dataset.speak);
        });

        root.addEventListener("hashchange", route);
        setInterval(function () { A.tick(currentRoute && currentRoute.study); }, 1000);
        document.addEventListener("visibilitychange", function () { if (!document.hidden && currentRoute && !currentRoute.immersive) route(); });

        route();
        root.EEGistSync.start();
        if (!Store.get().profile.createdAt) askName();
    }

    // 동기화로 기록이 바뀌었을 때 화면 갱신. 학습 중인 화면은 건드리지 않는다
    function refreshIfIdle() {
        if (currentRoute && !currentRoute.immersive) route();
        else if (main) renderNav();
    }

    root.EEApp = { setTheme: setTheme, askName: askName, route: route, refreshIfIdle: refreshIfIdle };
    document.addEventListener("DOMContentLoaded", boot);
})(window);
