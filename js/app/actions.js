/*
 * 배선 계층: 채점 결과 → 저장소. 화면 코드는 저장소를 직접 만지지 않고 여기를 거친다.
 * (같은 로직이 여러 화면에 흩어지면 화면마다 다른 기준으로 오답을 기록하게 된다)
 */
(function (root) {
    "use strict";
    var Store = root.EEStore, Srs = root.EESrs, Plan = root.EEPlan;

    var XP = { correct: 10, close: 7, wrong: 2, review: 8, word: 3, chapterBonus: 50, shadow: 4 };
    var HISTORY_LIMIT = 5;

    // 합계와 이 기기 장부를 함께 올린다 (장부 = 동기화 병합의 기준)
    function addXP(state, n) {
        var dev = Store.deviceId;
        state.xp = (state.xp || 0) + n;
        state.xpByDevice = state.xpByDevice || {};
        state.xpByDevice[dev] = (state.xpByDevice[dev] || 0) + n;
        var day = Store.dayRecord();
        day.xp = (day.xp || 0) + n;
        day.xpByDevice[dev] = (day.xpByDevice[dev] || 0) + n;
    }

    /**
     * 학습 중 한 문항의 첫 시도 결과 기록. wrong이면 오답노트에 넣는다.
     * @param {{id, chapterId, kind, ko, context?, contextKo?, answers, hint?, strict?}} item
     */
    function recordAttempt(item, userText, result) {
        var gained = XP[result.verdict];
        Store.update(function (s) {
            addXP(s, gained);
            if (result.verdict !== "wrong") return;
            var today = Store.today();
            var prev = s.wrongNotes[item.id];
            var next = Srs.markWrong(prev, today);
            next.chapterId = item.chapterId;
            next.kind = item.kind;
            next.ko = item.ko;
            next.context = item.context || "";
            next.contextKo = item.contextKo || "";
            next.hint = item.hint || "";
            next.answers = item.answers;
            next.strict = !!item.strict;
            next.blankEn = item.blankEn || "";
            next.history = [{ date: today, answer: userText }].concat((prev && prev.history) || []).slice(0, HISTORY_LIMIT);
            next.updatedAt = Date.now();
            s.wrongNotes[item.id] = next;
        });
        return gained;
    }

    // close 판정을 사용자가 직접 오답노트에 넣고 싶을 때
    function saveToNotes(item, userText) {
        var prev = Store.get().wrongNotes[item.id];
        if (prev && prev.lastWrong === Store.today() && !prev.mastered) return;
        recordAttempt(item, userText, { verdict: "wrong" });
        Store.update(function (s) { addXP(s, -XP.wrong); });
    }

    /** 집중케어 복습. early=true면 아직 복습일이 아닌 항목의 자율 연습 — 맞혀도 간격을 올리지 않는다 */
    function reviewWrong(id, userText, result, early) {
        var pass = root.EEGrader.isPass(result);
        Store.update(function (s) {
            var item = s.wrongNotes[id];
            if (!item) return;
            var today = Store.today();
            if (early && pass) {
                item.lastPracticed = today;
                item.updatedAt = Date.now();
            } else {
                var next = Srs.review(item, pass, today);
                if (!pass) next.history = [{ date: today, answer: userText }].concat(item.history || []).slice(0, HISTORY_LIMIT);
                next.updatedAt = Date.now();
                s.wrongNotes[id] = next;
            }
            addXP(s, pass ? XP.review : XP.wrong);
        });
        return pass ? XP.review : XP.wrong;
    }

    function deleteNote(id) {
        Store.update(function (s) {
            delete s.wrongNotes[id];
            s.tombstones = s.tombstones || {};
            s.tombstones[id] = Date.now(); // 다른 기기에서 되살아나지 않게
        });
    }

    function wordId(chapterId, word) { return chapterId + "::" + word; }

    /** 단어 카드에서 '헷갈려요' — 단어장에 넣고 내일부터 복습 */
    function markWordUnknown(chapter, v) {
        Store.update(function (s) {
            var id = wordId(chapter.id, v.word);
            var next = Srs.markWrong(s.words[id], Store.today());
            s.words[id] = Object.assign(next, {
                updatedAt: Date.now(),
                chapterId: chapter.id, word: v.word, pos: v.pos, meaning: v.meaning, example: v.example, exampleKo: v.exampleKo
            });
        });
    }

    function markWordKnown(chapter, v) {
        Store.update(function (s) { addXP(s, XP.word); });
    }

    function reviewWord(id, pass) {
        Store.update(function (s) {
            var w = s.words[id];
            if (!w) return;
            s.words[id] = Object.assign(Srs.review(w, pass, Store.today()), { updatedAt: Date.now() });
            addXP(s, pass ? XP.word : 1);
        });
    }

    function completeChapter(chapterId, score) {
        Store.update(function (s) {
            var p = s.progress[chapterId] || { completedCount: 0, bestScore: 0 };
            p.completedCount = (p.completedCount || 0) + 1;
            p.bestScore = Math.max(p.bestScore || 0, score);
            p.lastScore = score;
            p.lastDone = Store.today();
            s.progress[chapterId] = p;
            Store.dayRecord().tasks.chapter = true;
            addXP(s, XP.chapterBonus);
        });
    }

    function completeTask(key) {
        Store.update(function () { Store.dayRecord().tasks[key] = true; });
    }

    function addShadowXP() {
        Store.update(function (s) { addXP(s, XP.shadow); });
    }

    // 학습 화면에 머문 시간만 센다 (탭이 보이고, 최근 90초 안에 조작이 있었을 때)
    var lastInteraction = Date.now();
    ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
        root.addEventListener(ev, function () { lastInteraction = Date.now(); }, { passive: true });
    });
    var IDLE_LIMIT_MS = 90000;
    var pendingSeconds = 0;
    function tick(active) {
        if (!active || document.hidden || Date.now() - lastInteraction > IDLE_LIMIT_MS) return;
        pendingSeconds++;
        if (pendingSeconds >= 5) {
            var add = pendingSeconds;
            pendingSeconds = 0;
            Store.update(function () {
                var day = Store.dayRecord();
                day.seconds = (day.seconds || 0) + add;
                day.secondsByDevice[Store.deviceId] = (day.secondsByDevice[Store.deviceId] || 0) + add;
            });
        }
    }

    function dueWrong() { return Plan.dueItems(Store.get().wrongNotes, Store.today(), Plan.REVIEW_LIMIT); }
    function dueWords() { return Plan.dueItems(Store.get().words, Store.today(), Plan.WORD_LIMIT); }

    function level(xp) {
        // 레벨 n에 필요한 누적 XP: 100 * n * (n+1) / 2
        var lv = 1;
        while (100 * lv * (lv + 1) / 2 <= xp) lv++;
        var prevNeed = 100 * (lv - 1) * lv / 2, need = 100 * lv * (lv + 1) / 2;
        return { level: lv, into: xp - prevNeed, span: need - prevNeed };
    }

    root.EEActions = {
        XP: XP, recordAttempt: recordAttempt, saveToNotes: saveToNotes, reviewWrong: reviewWrong, deleteNote: deleteNote,
        wordId: wordId, markWordUnknown: markWordUnknown, markWordKnown: markWordKnown, reviewWord: reviewWord,
        completeChapter: completeChapter, completeTask: completeTask, addShadowXP: addShadowXP, tick: tick,
        dueWrong: dueWrong, dueWords: dueWords, level: level
    };
})(window);
