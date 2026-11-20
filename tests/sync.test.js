"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Y = require("../js/core/sync.js");

function base(over) {
    return Object.assign({
        version: 1, profile: { name: "", createdAt: "2026-11-20" }, settings: { rate: 0.95 },
        progress: {}, wrongNotes: {}, words: {}, daily: {}, xp: 0
    }, over);
}

const mac = base({
    profile: { name: "민수", createdAt: "2026-11-20" },
    xp: 500,
    daily: { "2026-11-20": { seconds: 845, xp: 500, tasks: { chapter: true } } },
    progress: { "self-intro": { completedCount: 1, bestScore: 37, lastScore: 37, lastDone: "2026-11-20" } },
    wrongNotes: { "self-intro:s1:1": { box: 0, due: "2026-11-21", wrongCount: 1, lastWrong: "2026-11-20" } },
    settings: { rate: 0.8, voiceURI: "Samantha" }
});

test("동기화 이전 기록은 이 기기의 장부로 옮겨지고 합계는 유지된다", () => {
    const m = Y.merge(mac, null, "mac");
    assert.equal(m.xp, 500);
    assert.deepEqual(m.xpByDevice, { mac: 500 });
    assert.equal(m.daily["2026-11-20"].seconds, 845);
    assert.deepEqual(m.daily["2026-11-20"].secondsByDevice, { mac: 845 });
});

test("두 기기의 학습 시간·XP는 기기별로 더해진다", () => {
    const shared = Y.merge(mac, null, "mac");
    const phone = Y.merge(base({ xp: 30, daily: { "2026-11-20": { seconds: 300, xp: 30, tasks: { review: true } } } }), null, "phone");
    const m = Y.merge(phone, Y.toPayload(shared).state, "phone");
    assert.equal(m.xp, 530);
    assert.equal(m.daily["2026-11-20"].seconds, 1145);
    assert.deepEqual(m.daily["2026-11-20"].tasks, { review: true, chapter: true });
});

test("멱등: 같은 기록을 여러 번 주고받아도 값이 불어나지 않는다", () => {
    const shared = Y.merge(mac, null, "mac");
    const phone = Y.merge(base({ xp: 30 }), null, "phone");
    const once = Y.merge(phone, Y.toPayload(shared).state, "phone");
    const twice = Y.merge(once, Y.toPayload(once).state, "phone");
    const back = Y.merge(shared, Y.toPayload(twice).state, "mac");
    assert.equal(twice.xp, 530);
    assert.equal(back.xp, 530);
    assert.ok(Y.sameContent(twice, back));
});

test("오답 항목은 최근에 활동한 쪽을 택한다", () => {
    const shared = Y.merge(mac, null, "mac");
    const phone = Y.merge(base({}), Y.toPayload(shared).state, "phone");
    // 폰에서 복습해서 맞힘
    phone.wrongNotes["self-intro:s1:1"] = Object.assign({}, phone.wrongNotes["self-intro:s1:1"],
        { box: 1, due: "2026-11-23", reviewCount: 1, lastReviewed: "2026-11-21", updatedAt: 2000 });
    const m = Y.merge(shared, Y.toPayload(phone).state, "mac");
    assert.equal(m.wrongNotes["self-intro:s1:1"].box, 1);
});

test("한 기기에서 지운 오답은 다른 기기에서 되살아나지 않는다", () => {
    const shared = Y.merge(mac, null, "mac");
    const phone = Y.merge(base({}), Y.toPayload(shared).state, "phone");
    delete phone.wrongNotes["self-intro:s1:1"];
    phone.tombstones["self-intro:s1:1"] = 3000;
    const m = Y.merge(shared, Y.toPayload(phone).state, "mac");
    assert.equal(m.wrongNotes["self-intro:s1:1"], undefined);
});

test("지운 뒤 다시 틀린 문장은 다시 살아난다", () => {
    const s = Y.merge(base({ tombstones: { x: 1000 }, wrongNotes: { x: { box: 0, wrongCount: 1, updatedAt: 5000 } } }), null, "a");
    assert.ok(s.wrongNotes.x);
});

test("챕터 진도: 최고점은 큰 값, 완료 횟수는 과소(최댓값)", () => {
    const a = base({ progress: { c: { completedCount: 2, bestScore: 70, lastScore: 70, lastDone: "2026-11-19" } } });
    const b = base({ progress: { c: { completedCount: 1, bestScore: 90, lastScore: 90, lastDone: "2026-11-20" } } });
    const m = Y.merge(a, b, "a");
    assert.deepEqual(m.progress.c, { completedCount: 2, bestScore: 90, lastScore: 90, lastDone: "2026-11-20" });
});

test("기기 전용 값(설정·진행 중 세션)은 공유 사본에 올라가지 않고, 병합해도 바뀌지 않는다", () => {
    const shared = Y.merge(mac, null, "mac");
    const payload = Y.toPayload(shared);
    assert.equal(payload.state.settings, undefined);
    const phone = Y.merge(base({ settings: { rate: 1.1 } }), payload.state, "phone");
    assert.equal(phone.settings.rate, 1.1);
    assert.equal(phone.profile.name, "민수");
});

test("이름은 나중에 바꾼 쪽을 따른다", () => {
    const a = base({ profile: { name: "민수", nameUpdatedAt: 100 } });
    const b = base({ profile: { name: "Minsu", nameUpdatedAt: 200 } });
    assert.equal(Y.merge(a, b, "a").profile.name, "Minsu");
    assert.equal(Y.merge(b, a, "b").profile.name, "Minsu");
});
