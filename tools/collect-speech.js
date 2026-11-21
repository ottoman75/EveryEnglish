#!/usr/bin/env node
/*
 * 앱이 소리 내어 읽을 수 있는 모든 문장을 모은다 → tools/build-audio.py 입력.
 * 화면에서 EESpeech.speak()에 넘기는 텍스트와 정확히 같아야 녹음이 재생된다.
 * (새 화면에서 다른 문장을 읽게 되면 여기에도 추가할 것)
 *
 * 출력(JSON, stdout): [{ text, role: "partner" | "main", speaker? }]
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = path.join(__dirname, "..", "js", "data", "chapters");
// 화면 코드에 직접 들어 있는 문장
const UI_TEXTS = ["Hi there! What can I get for you?"];

function loadChapters() {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    fs.readdirSync(DIR).filter((f) => /^\d\d-.+\.js$/.test(f)).sort()
        .forEach((f) => vm.runInContext(fs.readFileSync(path.join(DIR, f), "utf8"), sandbox));
    return sandbox.window.EE_CHAPTERS || [];
}

const items = [];
const seen = new Set();
function add(text, role, speaker) {
    const t = String(text || "").trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    items.push(speaker ? { text: t, role, speaker } : { text: t, role });
}

for (const ch of loadChapters()) {
    // 상대 대사를 먼저 등록해 같은 문장이 모범답안에도 있으면 상대 목소리를 쓴다
    ch.dialogues.forEach((s) => s.lines.forEach((l) => {
        if (l.speaker === "partner") add(l.en, "partner", `${ch.id}:${l.name}`);
    }));
    ch.dialogues.forEach((s) => s.lines.forEach((l) => {
        if (l.speaker === "you") l.answers.forEach((a) => add(a, "main"));  // 피드백은 가장 가까운 정답 변형을 읽는다
    }));
    ch.vocab.forEach((v) => { add(v.word, "main"); add(v.example, "main"); });
    ch.expressions.forEach((x) => add(x.example, "main"));
    ch.drills.forEach((d) => {
        if (d.type === "blank") d.answers.forEach((a) => add(d.en.replace("___", a), "main"));
        else d.answers.forEach((a) => add(a, "main"));
    });
}
UI_TEXTS.forEach((t) => add(t, "partner", "ui:barista"));

// 배역표의 성별을 붙인다 (목소리·아바타 외형 선택)
const castBox = { window: {} };
vm.createContext(castBox);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "data", "cast.js"), "utf8"), castBox);
items.forEach((it) => { if (it.speaker) it.gender = castBox.window.EE_CAST[it.speaker] || null; });

process.stdout.write(JSON.stringify(items));
