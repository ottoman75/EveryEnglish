#!/usr/bin/env node
/*
 * 정답 변형 탐침: 각 you 줄/드릴의 answers에서 원어민이 흔히 바꿔 말하는 변형을 만들어 채점하고,
 * wrong이 나오는 사례를 출력한다. 출력 = "후보". 진짜 맞는 답인지는 사람이 판단한다.
 * 사용: node .claude/skills/ee-qa/scripts/probe-answers.js [챕터순번...]
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..", "..", "..", "..");
const G = require(path.join(root, "js/core/grader.js"));

const SWAPS = [
    [/^Can I\b/i, "Could I"], [/^Could I\b/i, "Can I"], [/^Can you\b/i, "Could you"], [/^Could you\b/i, "Can you"],
    [/\bCan I get\b/i, "Can I have"], [/\bI'd like\b(?! to)/i, "I'll have"], [/\bThanks\b/, "Thank you"], [/\bThank you\b/, "Thanks"],
    [/^Yes,\s*/i, "Yeah, "], [/^Yeah,\s*/i, "Yes, "], [/^(Yes|Yeah|Sure|No),\s*/i, ""], [/^Hi,\s*/i, "Hello, "],
    [/[,]?\s*please([.?!]?)$/i, "$1"], [/([.?!])$/, ", please$1"], [/\bokay\b/i, "all right"], [/\bgreat\b/i, "good"]
];

function load(only) {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    const dir = path.join(root, "js/data/chapters");
    fs.readdirSync(dir).filter((f) => /^\d\d-/.test(f)).sort()
        .filter((f) => !only.length || only.includes(f.slice(0, 2)))
        .forEach((f) => vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), sandbox));
    return sandbox.window.EE_CHAPTERS || [];
}

const only = process.argv.slice(2).map((a) => a.padStart(2, "0"));
let probes = 0, flagged = 0;
for (const ch of load(only)) {
    const items = [];
    ch.dialogues.forEach((s) => s.lines.forEach((l, i) => { if (l.speaker === "you") items.push({ where: `${s.id}.lines[${i}]`, ko: l.ko, answers: l.answers }); }));
    ch.drills.forEach((d, i) => { if (d.type === "translate") items.push({ where: `drills[${i}]`, ko: d.ko, answers: d.answers }); });
    for (const it of items) {
        const seen = new Set();
        for (const a of it.answers) {
            for (const [re, rep] of SWAPS) {
                if (!re.test(a)) continue;
                const v = a.replace(re, rep).replace(/\s+/g, " ").trim();
                if (!v || v === a || seen.has(v)) continue;
                seen.add(v);
                probes++;
                const r = G.grade(v, it.answers);
                if (r.verdict === "wrong") {
                    flagged++;
                    console.log(`${ch.order}-${ch.id} ${it.where}  "${it.ko}"\n    변형: ${v}\n    가장 가까운 정답(${Math.round(r.score * 100)}%): ${r.answer}`);
                }
            }
        }
    }
}
console.log(`\n탐침 ${probes}개 · wrong 후보 ${flagged}개`);
