/*
 * localStorage 저장소. 스키마는 Optional 필드로만 확장하고 version을 올리지 않는다
 * (버전을 올리면 기존 학습 기록이 전부 무효가 된다). 없는 필드는 load() 시 기본값으로 채운다.
 */
(function (root) {
    "use strict";

    var KEY = "everyenglish:v1";

    function defaults() {
        return {
            version: 1,
            profile: { name: "", createdAt: null },
            settings: { rate: 0.95, autoSpeak: true, voiceURI: "" },
            progress: {},    // { [chapterId]: { completedCount, bestScore, lastScore, lastDone } }
            wrongNotes: {},  // { [itemId]: 오답 항목 + srs 필드 }
            words: {},       // { [chapterId::word]: 단어 + srs 필드 }
            daily: {},       // { [YYYY-MM-DD]: { seconds, xp, tasks: { review, chapter, words, shadow } } }
            xp: 0
        };
    }

    var memoryFallback = null; // 사파리 개인정보 보호 모드 등 저장 불가 환경

    function load() {
        var base = defaults();
        try {
            var raw = localStorage.getItem(KEY);
            if (!raw) return memoryFallback || base;
            var saved = JSON.parse(raw);
            Object.keys(base).forEach(function (k) {
                if (saved[k] === undefined) saved[k] = base[k];
                else if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) {
                    saved[k] = Object.assign({}, base[k], saved[k]);
                }
            });
            return saved;
        } catch (e) {
            return memoryFallback || base;
        }
    }

    var state = load();
    var listeners = [];

    function save() {
        try {
            localStorage.setItem(KEY, JSON.stringify(state));
        } catch (e) {
            memoryFallback = state;
        }
    }

    function get() { return state; }

    function update(fn) {
        fn(state);
        save();
        listeners.forEach(function (l) { l(state); });
    }

    function today() { return root.EESrs.dateKey(new Date()); }

    function dayRecord(key) {
        var k = key || today();
        if (!state.daily[k]) state.daily[k] = { seconds: 0, xp: 0, tasks: {} };
        if (!state.daily[k].tasks) state.daily[k].tasks = {};
        return state.daily[k];
    }

    function exportJSON() { return JSON.stringify(state, null, 2); }

    function importJSON(text) {
        var parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== "object" || !parsed.progress) throw new Error("EveryEnglish 백업 파일이 아닙니다");
        state = Object.assign(defaults(), parsed);
        save();
    }

    function reset() {
        state = defaults();
        save();
    }

    root.EEStore = {
        get: get, update: update, save: save, today: today, dayRecord: dayRecord,
        exportJSON: exportJSON, importJSON: importJSON, reset: reset,
        onChange: function (fn) { listeners.push(fn); }
    };
})(window);
