/*
 * 하루 30분 학습 계획 — 순수 함수만.
 *
 *  1) 집중케어  ~5분  : 오늘 복습할 오답 (최대 REVIEW_LIMIT)
 *  2) 오늘의 챕터 ~15분 : 단어 → 표현 → 롤플레이 → 드릴
 *  3) 단어 복습  ~5분  : 오늘 복습할 단어 카드
 *  4) 쉐도잉    ~5분  : 오늘 챕터 핵심 문장 따라 말하기
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) module.exports = factory(require("./srs.js"));
    else root.EEPlan = factory(root.EESrs);
})(typeof self !== "undefined" ? self : this, function (Srs) {
    "use strict";

    var REVIEW_LIMIT = 12;
    var WORD_LIMIT = 20;
    var DAILY_GOAL_MINUTES = 30;

    var TASKS = [
        { key: "review", title: "집중케어", subtitle: "어제까지 틀린 문장 다시 말하기", minutes: 5, icon: "🎯" },
        { key: "chapter", title: "오늘의 챕터", subtitle: "상황 회화 15분", minutes: 15, icon: "💬" },
        { key: "words", title: "단어 복습", subtitle: "외울 때까지 반복", minutes: 5, icon: "🧠" },
        { key: "shadow", title: "쉐도잉", subtitle: "원어민 따라 말하기", minutes: 5, icon: "🎧" }
    ];

    /**
     * 오늘의 챕터: 아직 안 끝낸 첫 챕터. 전부 끝냈으면 점수가 가장 낮고 오래된 챕터.
     * @param {Array} chapters order 순으로 정렬된 챕터
     * @param {Object} progress { [chapterId]: { completedCount, bestScore, lastDone } }
     * @param {string} today YYYY-MM-DD
     */
    function pickTodayChapter(chapters, progress, today) {
        if (!chapters.length) return null;
        progress = progress || {};
        // 오늘 이미 시작/완료한 챕터가 있으면 그대로 유지 (하루 안에 추천이 바뀌지 않게)
        var doneToday = chapters.filter(function (c) { return progress[c.id] && progress[c.id].lastDone === today; });
        if (doneToday.length) return doneToday[doneToday.length - 1];
        var fresh = chapters.filter(function (c) { return !progress[c.id] || !progress[c.id].completedCount; });
        if (fresh.length) return fresh[0];
        return chapters.slice().sort(function (a, b) {
            var pa = progress[a.id], pb = progress[b.id];
            if ((pa.bestScore || 0) !== (pb.bestScore || 0)) return (pa.bestScore || 0) - (pb.bestScore || 0);
            return String(pa.lastDone).localeCompare(String(pb.lastDone));
        })[0];
    }

    function dueItems(map, today, limit) {
        var items = Object.keys(map || {}).map(function (id) { return Object.assign({ id: id }, map[id]); })
            .filter(function (item) { return Srs.isDue(item, today); });
        return Srs.sortForReview(items).slice(0, limit);
    }

    /**
     * 연속 학습일. 오늘 아직 안 했으면 어제까지의 연속도 유지된 것으로 본다.
     * @param {Object} daily { [YYYY-MM-DD]: { seconds } }
     */
    function streak(daily, today, minSeconds) {
        var threshold = minSeconds || 60;
        var studied = function (key) { return daily && daily[key] && (daily[key].seconds || 0) >= threshold; };
        var cursor = studied(today) ? today : Srs.addDays(today, -1);
        var count = 0;
        while (studied(cursor)) {
            count++;
            cursor = Srs.addDays(cursor, -1);
        }
        return count;
    }

    return {
        REVIEW_LIMIT: REVIEW_LIMIT,
        WORD_LIMIT: WORD_LIMIT,
        DAILY_GOAL_MINUTES: DAILY_GOAL_MINUTES,
        TASKS: TASKS,
        pickTodayChapter: pickTodayChapter,
        dueItems: dueItems,
        streak: streak
    };
});
