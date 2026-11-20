#!/usr/bin/env node
/*
 * 챕터 데이터 검증기. 스키마: .claude/skills/chapter-authoring/references/schema.md
 * 사용: node tools/validate-chapters.js          → 전체 검증, 오류 있으면 exit 1
 *       node tools/validate-chapters.js 05 06    → 해당 순번 파일만 검증 (병렬 작성 중 다른 작가 파일 무시)
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const grader = require("../js/core/grader.js");

const DIR = path.join(__dirname, "..", "js", "data", "chapters");
const LEVELS = ["A1", "A2", "B1", "B2"];
const DRILL_MIX = { translate: 4, blank: 3, arrange: 3 };
const MAX_ARRANGE_WORDS = 8;
const MAX_ANSWER_WORDS = 12;

function loadChapters() {
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    const files = fs.readdirSync(DIR).filter((f) => /^\d\d-.+\.js$/.test(f)).sort();
    const byFile = [];
    for (const f of files) {
        const before = (sandbox.window.EE_CHAPTERS || []).length;
        vm.runInContext(fs.readFileSync(path.join(DIR, f), "utf8"), sandbox, { filename: f });
        const added = sandbox.window.EE_CHAPTERS.slice(before);
        byFile.push({ file: f, chapters: added });
    }
    return byFile;
}

function nonEmpty(v) { return typeof v === "string" && v.trim().length > 0; }

function validateChapter(ch, file, errors, warnings) {
    const at = (msg) => errors.push(`${file}: ${msg}`);
    const warn = (msg) => warnings.push(`${file}: ${msg}`);
    const nn = parseInt(file.slice(0, 2), 10);

    ["id", "title", "titleEn", "emoji", "goal"].forEach((k) => { if (!nonEmpty(ch[k])) at(`${k} 누락`); });
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(ch.id || "")) at(`id는 kebab-case여야 함: ${ch.id}`);
    if (ch.order !== nn) at(`order(${ch.order})가 파일 순번(${nn})과 다름`);
    if (!file.endsWith(`-${ch.id}.js`)) at(`파일명이 id와 다름`);
    if (!LEVELS.includes(ch.level)) at(`level 잘못됨: ${ch.level}`);
    if (!Array.isArray(ch.gradient) || ch.gradient.length !== 2 || !ch.gradient.every((c) => /^#[0-9A-Fa-f]{6}$/.test(c))) {
        at("gradient는 #RRGGBB 2개");
    }

    // vocab
    if (!Array.isArray(ch.vocab) || ch.vocab.length !== 10) at(`vocab 10개 필요 (현재 ${ch.vocab && ch.vocab.length})`);
    const dialogText = (ch.dialogues || []).flatMap((s) => (s.lines || []).map((l) => (l.en || "") + " " + (l.answers || []).join(" ")))
        .join(" ").toLowerCase();
    (ch.vocab || []).forEach((v, i) => {
        ["word", "pos", "meaning", "example", "exampleKo"].forEach((k) => { if (!nonEmpty(v[k])) at(`vocab[${i}].${k} 누락`); });
        const head = (v.word || "").toLowerCase().replace(/^to /, "").split(/[\s/-]/)[0].replace(/[^a-z']/g, "");
        if (head && !dialogText.includes(head.slice(0, Math.max(3, head.length - 2)))) {
            warn(`vocab "${v.word}"가 대화에 등장하지 않음`);
        }
    });

    // expressions
    if (!Array.isArray(ch.expressions) || ch.expressions.length !== 6) at(`expressions 6개 필요`);
    (ch.expressions || []).forEach((e, i) => {
        ["en", "ko", "note", "example"].forEach((k) => { if (!nonEmpty(e[k])) at(`expressions[${i}].${k} 누락`); });
    });

    // dialogues
    if (!Array.isArray(ch.dialogues) || ch.dialogues.length !== 3) at(`dialogues 3개 필요`);
    let youTotal = 0;
    (ch.dialogues || []).forEach((s, si) => {
        const p = `dialogues[${si}]`;
        ["id", "title", "setting"].forEach((k) => { if (!nonEmpty(s[k])) at(`${p}.${k} 누락`); });
        const lines = s.lines || [];
        if (!lines.length || lines[0].speaker !== "partner") at(`${p} 첫 줄은 partner여야 함`);
        let youCount = 0;
        lines.forEach((l, li) => {
            const lp = `${p}.lines[${li}]`;
            if (l.speaker === "partner") {
                ["name", "en", "ko"].forEach((k) => { if (!nonEmpty(l[k])) at(`${lp}.${k} 누락`); });
            } else if (l.speaker === "you") {
                youCount++;
                if (li === 0 || lines[li - 1].speaker !== "partner") at(`${lp} you 줄 앞에 partner 줄이 없음`);
                if (!nonEmpty(l.ko)) at(`${lp}.ko 누락`);
                if (!nonEmpty(l.hint)) at(`${lp}.hint 누락`);
                else if (l.hint.split(/\s+/).length > 5) warn(`${lp}.hint가 5단어 초과`);
                if (!Array.isArray(l.answers) || l.answers.length < 2) at(`${lp}.answers 2개 이상 필요`);
                (l.answers || []).forEach((a) => {
                    if (!nonEmpty(a)) at(`${lp}.answers에 빈 문자열`);
                    else if (grader.normalize(a).length > MAX_ANSWER_WORDS) warn(`${lp} 정답이 ${MAX_ANSWER_WORDS}단어 초과: ${a}`);
                });
                // 모범답안이 자기 자신으로 correct 판정되는지 (정규화 버그 탐지)
                if (l.answers && l.answers[0] && grader.grade(l.answers[0], l.answers).verdict !== "correct") {
                    at(`${lp} 모범답안이 채점기에서 correct가 아님`);
                }
            } else {
                at(`${lp}.speaker 잘못됨: ${l.speaker}`);
            }
        });
        if (youCount < 5 || youCount > 7) at(`${p} you 줄 ${youCount}개 (5~7 필요)`);
        youTotal += youCount;
    });
    if (youTotal < 16 || youTotal > 20) at(`챕터 you 줄 합계 ${youTotal}개 (16~20 필요)`);
    const sceneIds = (ch.dialogues || []).map((s) => s.id);
    if (new Set(sceneIds).size !== sceneIds.length) at("장면 id 중복");

    // drills
    if (!Array.isArray(ch.drills) || ch.drills.length !== 10) at(`drills 10개 필요`);
    const mix = {};
    (ch.drills || []).forEach((d, i) => {
        const p = `drills[${i}]`;
        mix[d.type] = (mix[d.type] || 0) + 1;
        if (!DRILL_MIX[d.type]) at(`${p}.type 잘못됨: ${d.type}`);
        if (!nonEmpty(d.ko)) at(`${p}.ko 누락`);
        if (!Array.isArray(d.answers) || d.answers.length < 1 || !d.answers.every(nonEmpty)) at(`${p}.answers 필요`);
        if (d.type === "blank") {
            const blanks = (d.en || "").split("___").length - 1;
            if (blanks !== 1) at(`${p} blank의 en에 ___가 정확히 1개여야 함`);
        }
        if (d.type === "arrange" && d.answers && d.answers[0] &&
            grader.tokenizeForArrange(d.answers[0]).length > MAX_ARRANGE_WORDS) {
            at(`${p} arrange 정답이 ${MAX_ARRANGE_WORDS}단어 초과`);
        }
        if (d.type === "translate" && d.answers && d.answers.length < 2) warn(`${p} translate answers 1개뿐 — 변형 추가 권장`);
    });
    Object.keys(DRILL_MIX).forEach((t) => {
        if ((mix[t] || 0) !== DRILL_MIX[t]) at(`drills ${t} ${mix[t] || 0}개 (${DRILL_MIX[t]} 필요)`);
    });
}

function main() {
    const errors = [];
    const warnings = [];
    const only = process.argv.slice(2).map((a) => a.padStart(2, "0"));
    const byFile = loadChapters().filter((b) => !only.length || only.includes(b.file.slice(0, 2)));
    const ids = new Set();
    let count = 0;
    for (const { file, chapters } of byFile) {
        if (chapters.length !== 1) { errors.push(`${file}: 챕터를 정확히 1개 push해야 함 (${chapters.length})`); continue; }
        const ch = chapters[0];
        if (ids.has(ch.id)) errors.push(`${file}: id 중복 ${ch.id}`);
        ids.add(ch.id);
        validateChapter(ch, file, errors, warnings);
        count++;
    }
    const orders = byFile.map((b) => parseInt(b.file.slice(0, 2), 10));
    if (!only.length) orders.forEach((o, i) => { if (o !== i + 1) errors.push(`순번이 연속되지 않음: ${byFile[i].file}`); });

    // 경계면: index.html이 모든 챕터 파일을 불러오는지 (file:// 지원을 위해 목록을 손으로 관리한다)
    if (!only.length) {
        const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
        byFile.forEach((b) => {
            if (!html.includes(`js/data/chapters/${b.file}`)) errors.push(`index.html에 ${b.file} <script>가 없음`);
        });
    }

    // 경계면: 앱이 읽는 문장이 모두 녹음돼 있는지 (없으면 그 문장만 브라우저 음성으로 나간다)
    const manifestPath = path.join(__dirname, "..", "js", "data", "audio-manifest.js");
    if (!only.length && fs.existsSync(manifestPath)) {
        const sb = { window: {} };
        vm.createContext(sb);
        vm.runInContext(fs.readFileSync(manifestPath, "utf8"), sb);
        const clips = (sb.window.EE_AUDIO && sb.window.EE_AUDIO.clips) || {};
        const texts = JSON.parse(require("child_process").execFileSync("node", [path.join(__dirname, "collect-speech.js")]));
        const missing = texts.filter((t) => !clips[t.text]);
        const missingFiles = Object.values(clips).filter((f) => !fs.existsSync(path.join(__dirname, "..", "audio", f)));
        if (missing.length) warnings.push(`녹음 없는 문장 ${missing.length}개 — tools/build-audio.py 재실행 필요 (예: "${missing[0].text}")`);
        if (missingFiles.length) errors.push(`audio-manifest에 있는데 audio/에 없는 파일 ${missingFiles.length}개`);
    }

    warnings.forEach((w) => console.log("⚠️  " + w));
    errors.forEach((e) => console.log("❌ " + e));
    console.log(`\n챕터 ${count}개 · 오류 ${errors.length} · 경고 ${warnings.length}`);
    process.exit(errors.length ? 1 : 0);
}

main();
