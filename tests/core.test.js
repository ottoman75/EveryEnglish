"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const G = require("../js/core/grader.js");
const S = require("../js/core/srs.js");
const P = require("../js/core/plan.js");

// ---------- grader ----------
test("정규화: 대소문자·구두점·축약형을 무시한다", () => {
    assert.deepEqual(G.normalize("I'm fine, thanks!"), ["i", "am", "fine", "thanks"]);
    assert.deepEqual(G.normalize("I don't know."), ["i", "do", "not", "know"]);
    assert.deepEqual(G.normalize("Can't"), ["can", "not"]);
    assert.deepEqual(G.normalize("I CANNOT"), ["i", "can", "not"]);
    assert.deepEqual(G.normalize("That’s it."), ["that", "is", "it"]); // 둥근 따옴표
});

test("정규화: 음성인식 숫자 표기와 단어 표기를 같게 본다", () => {
    assert.deepEqual(G.normalize("seven o'clock"), G.normalize("7 o'clock"));
    assert.deepEqual(G.normalize("at 7:30"), G.normalize("at seven thirty"));
    assert.deepEqual(G.normalize("$20"), G.normalize("twenty dollars"));
});

test("채점: 축약형만 다른 답은 correct", () => {
    const r = G.grade("I am good, thank you", ["I'm good, thank you."]);
    assert.equal(r.verdict, "correct");
});

test("채점: answers 중 가장 가까운 것과 비교한다", () => {
    const r = G.grade("Could I get an iced latte", ["Can I get an iced latte?", "Could I get an iced latte?"]);
    assert.equal(r.verdict, "correct");
    assert.equal(r.answer, "Could I get an iced latte?");
});

test("채점: 관사 하나 빠지면 close (통과) + 빠진 단어를 알려준다", () => {
    const r = G.grade("Can I get iced latte with oat milk", ["Can I get an iced latte with oat milk?"]);
    assert.equal(r.verdict, "close");
    assert.ok(G.isPass(r));
    assert.ok(r.ops.some((o) => o.op === "miss" && o.answer === "an"));
});

test("채점: 의미가 다른 답은 wrong", () => {
    const r = G.grade("I want coffee", ["Can I get an iced latte?"]);
    assert.equal(r.verdict, "wrong");
    assert.ok(!G.isPass(r));
});

test("채점: 빈 답은 wrong + empty 표시", () => {
    const r = G.grade("   ", ["Hello."]);
    assert.equal(r.verdict, "wrong");
    assert.equal(r.empty, true);
});

test("채점: strict 모드(빈칸)에서는 부분점수가 없다", () => {
    assert.equal(G.grade("gets", ["get"], { strict: true }).verdict, "wrong");
    assert.equal(G.grade("Get", ["get"], { strict: true }).verdict, "correct");
});

test("채점: 짧은 문장에서 한 단어 틀리면 close가 아니라 wrong (과대평가 방지)", () => {
    // 3단어 중 1개 틀림 → 0.67
    assert.equal(G.grade("No, I fine", ["No, I'm fine."]).verdict, "wrong");
});

// ---------- srs ----------
test("srs: 틀리면 box 0, 내일 복습", () => {
    const item = S.markWrong(null, "2026-11-20");
    assert.equal(item.box, 0);
    assert.equal(item.due, "2026-11-21");
    assert.equal(item.wrongCount, 1);
});

test("srs: 맞힐수록 간격이 늘고 5번 연속 맞히면 졸업", () => {
    let item = S.markWrong(null, "2026-11-20");
    let today = "2026-11-21";
    const dues = [];
    for (let i = 0; i < S.MASTERED_BOX; i++) {
        item = S.review(item, true, today);
        dues.push(item.due);
        if (item.due) today = item.due;
    }
    assert.equal(item.mastered, true);
    assert.equal(item.due, null);
    assert.deepEqual(dues.slice(0, 4), ["2026-11-23", "2026-11-27", "2026-12-04", "2026-12-19"]);
});

test("srs: 복습 중 틀리면 처음부터", () => {
    let item = S.markWrong(null, "2026-11-20");
    item = S.review(item, true, "2026-11-21");
    item = S.review(item, false, "2026-11-23");
    assert.equal(item.box, 0);
    assert.equal(item.wrongCount, 2);
    assert.equal(item.due, "2026-11-24");
});

test("srs: 월말·연말 경계에서도 날짜가 맞다", () => {
    assert.equal(S.addDays("2026-12-31", 1), "2027-01-01");
    assert.equal(S.addDays("2028-02-28", 1), "2028-02-29");
    assert.equal(S.daysBetween("2026-11-20", "2026-12-01"), 11);
});

// ---------- plan ----------
const chapters = [{ id: "a" }, { id: "b" }, { id: "c" }];

test("plan: 안 끝낸 첫 챕터를 추천", () => {
    const p = { a: { completedCount: 1, bestScore: 90, lastDone: "2026-11-19" } };
    assert.equal(P.pickTodayChapter(chapters, p, "2026-11-20").id, "b");
});

test("plan: 오늘 이미 한 챕터가 있으면 하루 동안 그 챕터를 유지", () => {
    const p = { a: { completedCount: 1, bestScore: 90, lastDone: "2026-11-20" } };
    assert.equal(P.pickTodayChapter(chapters, p, "2026-11-20").id, "a");
});

test("plan: 전부 끝냈으면 점수가 가장 낮은 챕터", () => {
    const p = {
        a: { completedCount: 1, bestScore: 90, lastDone: "2026-11-10" },
        b: { completedCount: 1, bestScore: 60, lastDone: "2026-11-11" },
        c: { completedCount: 1, bestScore: 80, lastDone: "2026-11-12" }
    };
    assert.equal(P.pickTodayChapter(chapters, p, "2026-11-20").id, "b");
});

test("plan: 오늘 복습할 항목만, 많이 틀린 순으로", () => {
    const map = {
        x: { due: "2026-11-20", wrongCount: 1 },
        y: { due: "2026-11-19", wrongCount: 3 },
        z: { due: "2026-11-25", wrongCount: 5 },
        m: { due: null, wrongCount: 9, mastered: true }
    };
    assert.deepEqual(P.dueItems(map, "2026-11-20", 10).map((i) => i.id), ["y", "x"]);
});

test("plan: 연속 학습일 — 오늘 아직 안 했어도 어제까지의 연속은 유지", () => {
    const daily = { "2026-11-18": { seconds: 900 }, "2026-11-19": { seconds: 1200 } };
    assert.equal(P.streak(daily, "2026-11-20"), 2);
    daily["2026-11-20"] = { seconds: 300 };
    assert.equal(P.streak(daily, "2026-11-20"), 3);
    assert.equal(P.streak({ "2026-11-17": { seconds: 900 } }, "2026-11-20"), 0);
});

test("정규화: 's 축약형과 is를 같게 본다 (작가 피드백)", () => {
    assert.equal(G.grade("The shower is not working.", ["The shower's not working."]).verdict, "correct");
    assert.equal(G.grade("Something's wrong with the AC", ["Something is wrong with the AC."]).verdict, "correct");
});

test("정규화: p.m./pm/PM, 3pm/3 pm, 30%/30 percent를 같게 본다", () => {
    assert.deepEqual(G.normalize("at 3 p.m."), G.normalize("at 3pm"));
    assert.deepEqual(G.normalize("at 3 PM"), G.normalize("at three p.m."));
    assert.deepEqual(G.normalize("30% off"), G.normalize("30 percent off"));
});

test("정규화: 복합 숫자·서수를 음성인식 표기와 같게 본다", () => {
    assert.deepEqual(G.normalize("twenty-five dollars"), G.normalize("25 dollars"));
    assert.deepEqual(G.normalize("May fourteenth"), G.normalize("May 14th"));
    assert.deepEqual(G.normalize("the twenty-first"), G.normalize("the 21st"));
    assert.deepEqual(G.normalize("the twelfth"), G.normalize("the 12th"));
});

test("정규화: 철자 불러주기는 붙여 쓴 단어와 같게 본다", () => {
    assert.deepEqual(G.normalize("It's M-I-N-S-U."), G.normalize("It's Minsu."));
    assert.deepEqual(G.normalize("M, I, N, S, U"), ["minsu"]);
    // 1~2글자 단독 단어(a, I)는 합치지 않는다
    assert.deepEqual(G.normalize("I have a car"), ["i", "have", "a", "car"]);
});

test("정규화: 'second'는 '2nd'로 — 단, 의미가 '초'일 때도 양쪽에 똑같이 적용되므로 일치 판정은 유지", () => {
    assert.equal(G.grade("Give me a second.", ["Give me a second."]).verdict, "correct");
});

test("채점: 회화 동의 표현(Thanks/Thank you, Yeah/Yes, please 유무)은 같은 답으로 본다", () => {
    assert.equal(G.grade("Yeah, that's it. Thank you.", ["Yes, that's it. Thanks."]).verdict, "correct");
    assert.equal(G.grade("Large", ["Large, please."]).verdict, "correct");
    assert.equal(G.grade("Oh, okay", ["All right."]).verdict, "correct");
    // 한 단어짜리 답 'Please.'는 지워지지 않는다
    assert.deepEqual(G.normalize("Please."), ["please"]);
});

test("채점: 동의 표현 처리 후에도 다른 뜻의 답은 wrong", () => {
    assert.equal(G.grade("No, thanks.", ["Yes, please."]).verdict, "wrong");
});

test("채점: 뜻을 뒤집는 단어(nothing/something, in/out, not)가 다르면 유사도가 높아도 wrong (QA)", () => {
    assert.equal(G.grade("I have something to declare.", ["I have nothing to declare."]).verdict, "wrong");
    assert.equal(G.grade("I'd like to check out, please.", ["I'd like to check in, please."]).verdict, "wrong");
    assert.equal(G.grade("I do not have a reservation under Minsu", ["I have a reservation under Minsu."]).verdict, "wrong");
    // 뜻이 유지되는 작은 차이는 여전히 close
    assert.equal(G.grade("I would like to check in today", ["I'd like to check in today, please."]).verdict, "correct");
    assert.equal(G.grade("Can I get iced latte with oat milk", ["Can I get an iced latte with oat milk?"]).verdict, "close");
});

test("채점: 맞장구 Yes/No는 빠져도 close, 서로 바뀌면 wrong", () => {
    assert.equal(G.grade("I'm good, thank you so much", ["No, I'm good, thank you so much."]).verdict, "close");
    assert.equal(G.grade("Yes, I'm good, thank you so much", ["No, I'm good, thank you so much."]).verdict, "wrong");
});
