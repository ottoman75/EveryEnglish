/*
 * 간격 반복(Leitner) — 오답노트와 단어장이 공유한다. 순수 함수만.
 *
 * box 0~4: 복습 대상. 맞히면 한 칸 올라가고 INTERVALS[box]일 뒤 다시 나온다.
 * box 5  : 졸업(mastered). 더 이상 집중케어에 나오지 않는다.
 * 틀리면 box 0, 내일 다시.
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) module.exports = factory();
    else root.EESrs = factory();
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";

    var INTERVALS = [1, 2, 4, 7, 15];
    var MASTERED_BOX = INTERVALS.length;

    function dateKey(date) {
        var d = date instanceof Date ? date : new Date(date);
        var m = d.getMonth() + 1, day = d.getDate();
        return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
    }

    function addDays(key, days) {
        var p = key.split("-").map(Number);
        return dateKey(new Date(p[0], p[1] - 1, p[2] + days));
    }

    function daysBetween(fromKey, toKey) {
        var a = fromKey.split("-").map(Number), b = toKey.split("-").map(Number);
        var ms = new Date(b[0], b[1] - 1, b[2]) - new Date(a[0], a[1] - 1, a[2]);
        return Math.round(ms / 86400000);
    }

    // 처음 틀렸거나 다시 틀렸을 때
    function markWrong(item, today) {
        var base = item || { wrongCount: 0, reviewCount: 0, createdAt: today };
        return Object.assign({}, base, {
            box: 0,
            due: addDays(today, 1),
            wrongCount: (base.wrongCount || 0) + 1,
            lastWrong: today,
            mastered: false
        });
    }

    // 복습 결과 반영
    function review(item, pass, today) {
        if (!pass) {
            var wrong = markWrong(item, today);
            wrong.reviewCount = (item.reviewCount || 0) + 1;
            return wrong;
        }
        var box = Math.min((item.box || 0) + 1, MASTERED_BOX);
        return Object.assign({}, item, {
            box: box,
            due: box >= MASTERED_BOX ? null : addDays(today, INTERVALS[box]),
            reviewCount: (item.reviewCount || 0) + 1,
            lastReviewed: today,
            mastered: box >= MASTERED_BOX
        });
    }

    function isDue(item, today) {
        return !item.mastered && !!item.due && item.due <= today;
    }

    // 복습 우선순위: 많이 틀린 것 → 오래 밀린 것
    function sortForReview(items) {
        return items.slice().sort(function (a, b) {
            if ((b.wrongCount || 0) !== (a.wrongCount || 0)) return (b.wrongCount || 0) - (a.wrongCount || 0);
            return String(a.due).localeCompare(String(b.due));
        });
    }

    return {
        INTERVALS: INTERVALS,
        MASTERED_BOX: MASTERED_BOX,
        dateKey: dateKey,
        addDays: addDays,
        daysBetween: daysBetween,
        markWrong: markWrong,
        review: review,
        isDue: isDue,
        sortForReview: sortForReview
    };
});
