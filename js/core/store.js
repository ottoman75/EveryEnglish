/*
 * localStorage 저장소. 스키마는 Optional 필드로만 확장하고 version을 올리지 않는다
 * (버전을 올리면 기존 학습 기록이 전부 무효가 된다). 없는 필드는 load() 시 기본값으로 채운다.
 */
(function (root) {
    "use strict";

    var KEY = "everyenglish:v1";
    var DEVICE_KEY = "everyenglish:device";   // 기기 식별자 — 동기화되지 않는다

    var deviceId = (function () {
        try {
            var id = localStorage.getItem(DEVICE_KEY);
            if (!id) {
                id = "d-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
                localStorage.setItem(DEVICE_KEY, id);
            }
            return id;
        } catch (e) {
            return "d-ephemeral";
        }
    })();

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

    // 학습 시간·XP를 기기별 장부로 관리한다(동기화 병합용). 장부가 이미 있으면 그대로
    function withLedgers(s) { return root.EESync.recomputeTotals(root.EESync.adoptLegacy(s, deviceId)); }

    var state = withLedgers(load());
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
        var d = state.daily[k];
        if (!d.tasks) d.tasks = {};
        if (!d.secondsByDevice) d.secondsByDevice = {};
        if (!d.xpByDevice) d.xpByDevice = {};
        return d;
    }

    function exportJSON() { return JSON.stringify(state, null, 2); }

    function importJSON(text) {
        var parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== "object" || !parsed.progress) throw new Error("EveryEnglish 백업 파일이 아닙니다");
        state = withLedgers(Object.assign(defaults(), parsed));
        save();
    }

    function reset() {
        state = withLedgers(defaults());
        save();
    }

    // 동기화 결과로 상태를 통째로 교체. silent면 변경 알림을 보내지 않는다(동기화가 동기화를 부르는 고리 방지)
    function replace(next, silent) {
        state = next;
        save();
        if (!silent) listeners.forEach(function (l) { l(state); });
    }

    root.EEStore = {
        deviceId: deviceId, replace: replace,
        get: get, update: update, save: save, today: today, dayRecord: dayRecord,
        exportJSON: exportJSON, importJSON: importJSON, reset: reset,
        onChange: function (fn) { listeners.push(fn); }
    };
})(window);
