/*
 * GitHub 비공개 gist를 공유 사본으로 쓰는 기기 간 동기화.
 *  - 토큰(gist 권한만)은 이 기기 localStorage의 별도 키에만 저장한다. 학습 기록·백업 파일에는 넣지 않는다
 *  - 순서: 가져오기 → 병합(EESync.merge) → 바뀌었으면 올리기. 병합이 멱등이라 동시에 써도 다음 동기화에서 맞춰진다
 */
(function (root) {
    "use strict";
    var Store = root.EEStore, Sync = root.EESync;

    var CFG_KEY = "everyenglish:sync";
    var FILE = "everyenglish-sync.json";
    var API = "https://api.github.com";
    var THROTTLE_MS = 30000;            // 학습 중에는 최대 30초에 한 번
    var GIST_SEARCH_PAGES = 5;

    var status = { state: "off", message: "", lastSyncAt: null };
    var running = null;
    var timer = null;
    var subscribers = [];

    function readCfg() {
        try { return JSON.parse(localStorage.getItem(CFG_KEY) || "null"); } catch (e) { return null; }
    }
    function writeCfg(cfg) {
        try {
            if (cfg) localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
            else localStorage.removeItem(CFG_KEY);
        } catch (e) { /* 저장 불가 환경: 이번 접속 동안만 */ }
    }

    function setStatus(state, message) {
        var cfg = readCfg();
        status = { state: state, message: message || "", lastSyncAt: cfg && cfg.lastSyncAt, login: cfg && cfg.login };
        subscribers.forEach(function (fn) { fn(status); });
    }

    function api(path, token, options) {
        var opts = options || {};
        return fetch(API + path, {
            method: opts.method || "GET",
            headers: Object.assign({
                Accept: "application/vnd.github+json",
                Authorization: "Bearer " + token,
                "X-GitHub-Api-Version": "2022-11-28"
            }, opts.body ? { "Content-Type": "application/json" } : {}),
            body: opts.body ? JSON.stringify(opts.body) : undefined,
            cache: "no-store",
            keepalive: !!opts.keepalive
        }).then(function (res) {
            if (res.status === 401) throw Object.assign(new Error("토큰이 올바르지 않거나 만료됐어요"), { code: "auth" });
            if (res.status === 404) throw Object.assign(new Error("not found"), { code: "notfound" });
            if (res.status === 403) throw Object.assign(new Error("토큰에 gist 권한이 없거나 요청 한도를 넘었어요"), { code: "forbidden" });
            if (!res.ok) throw new Error("GitHub 응답 오류 " + res.status);
            return res.json();
        });
    }

    function findGist(token) {
        var page = 1;
        function next() {
            return api("/gists?per_page=100&page=" + page, token).then(function (list) {
                var hit = list.find(function (g) { return g.files && g.files[FILE]; });
                if (hit) return hit.id;
                if (list.length < 100 || page >= GIST_SEARCH_PAGES) return null;
                page++;
                return next();
            });
        }
        return next();
    }

    function createGist(token) {
        var payload = Sync.toPayload(Store.get());
        var files = {};
        files[FILE] = { content: JSON.stringify(payload) };
        return api("/gists", token, {
            method: "POST",
            body: { description: "EveryEnglish 학습 기록 동기화 (앱이 자동 관리)", public: false, files: files }
        }).then(function (g) { return g.id; });
    }

    function readRemote(token, gistId) {
        return api("/gists/" + gistId, token).then(function (g) {
            var f = g.files && g.files[FILE];
            if (!f) return null;
            var text = f.truncated
                ? fetch(f.raw_url, { cache: "no-store" }).then(function (r) { return r.text(); })
                : Promise.resolve(f.content);
            return text.then(function (t) {
                var parsed = JSON.parse(t);
                if (!parsed || parsed.app !== "everyenglish") throw new Error("동기화 파일 형식이 아니에요");
                return parsed.state;
            });
        });
    }

    function writeRemote(token, gistId, state, keepalive) {
        var files = {};
        files[FILE] = { content: JSON.stringify(Sync.toPayload(state)) };
        return api("/gists/" + gistId, token, { method: "PATCH", body: { files: files }, keepalive: keepalive });
    }

    /** 지금 동기화. 이미 진행 중이면 그 작업을 기다린다 */
    function syncNow(opts) {
        var cfg = readCfg();
        if (!cfg || !cfg.token) return Promise.resolve({ changed: false });
        if (running) return running;
        clearTimeout(timer);
        timer = null;
        setStatus("syncing");
        running = readRemote(cfg.token, cfg.gistId).catch(function (err) {
            if (err.code === "notfound") {
                // gist가 지워졌으면 새로 만든다
                return createGist(cfg.token).then(function (id) { cfg.gistId = id; writeCfg(cfg); return null; });
            }
            throw err;
        }).then(function (remote) {
            var local = Store.get();
            var merged = Sync.merge(local, remote, Store.deviceId);
            var localChanged = !Sync.sameContent(local, merged);
            if (localChanged) Store.replace(merged, true);
            var push = !remote || !Sync.sameContent(merged, Object.assign({}, remote))
                ? writeRemote(cfg.token, cfg.gistId, merged, opts && opts.keepalive) : Promise.resolve();
            return push.then(function () {
                cfg.lastSyncAt = Date.now();
                writeCfg(cfg);
                setStatus("ok");
                return { changed: localChanged };
            });
        }).catch(function (err) {
            setStatus(err.code === "auth" || err.code === "forbidden" ? "auth-error" : "error",
                err.code ? err.message : (navigator.onLine === false ? "오프라인이에요. 연결되면 다시 맞출게요" : err.message));
            return { changed: false, error: err };
        }).then(function (result) {
            running = null;
            if (result.changed && root.EEApp) root.EEApp.refreshIfIdle();
            return result;
        });
        return running;
    }

    /** 토큰으로 연결: 계정 확인 → 기존 gist 찾기(없으면 생성) → 첫 동기화 */
    function connect(token) {
        token = String(token || "").trim();
        if (!/^(gh[pousr]_|github_pat_)[A-Za-z0-9_]{20,}$/.test(token)) {
            return Promise.reject(new Error("GitHub 토큰 형식이 아니에요 (ghp_ 또는 github_pat_ 로 시작)"));
        }
        setStatus("syncing", "연결하는 중…");
        return api("/user", token).then(function (user) {
            return findGist(token).then(function (id) { return id || createGist(token); }).then(function (gistId) {
                writeCfg({ token: token, gistId: gistId, login: user.login, lastSyncAt: null });
                return syncNow();
            });
        }).catch(function (err) {
            setStatus("off", err.message);
            throw err;
        });
    }

    function disconnect() {
        writeCfg(null);
        setStatus("off");
    }

    function isConnected() { var c = readCfg(); return !!(c && c.token); }

    function schedule() {
        if (!isConnected() || timer || running) return;
        timer = setTimeout(function () { timer = null; syncNow(); }, THROTTLE_MS);
    }

    // 나중에 연결해도 동작하도록 리스너는 항상 건다 (각 리스너가 연결 여부를 확인)
    function start() {
        setStatus(isConnected() ? "ok" : "off");
        Store.onChange(schedule);
        if (isConnected()) syncNow();
        document.addEventListener("visibilitychange", function () {
            if (!isConnected()) return;
            // 앱을 닫거나 다른 앱으로 갈 때 올리고, 돌아오면 가져온다
            syncNow(document.hidden ? { keepalive: true } : null);
        });
        root.addEventListener("online", function () { syncNow(); });
    }

    root.EEGistSync = {
        start: start, connect: connect, disconnect: disconnect, syncNow: syncNow, isConnected: isConnected,
        status: function () { return status; },
        onStatus: function (fn) { subscribers.push(fn); },
        TOKEN_URL: "https://github.com/settings/tokens/new?scopes=gist&description=EveryEnglish%20sync"
    };
})(window);
