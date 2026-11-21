#!/usr/bin/env node
/*
 * 말하는 초상화 등록: 이미지 정리 → 얼굴 인식으로 입·눈 영역 측정 → 구도 검사 → portraits.js 갱신
 *
 * 사용:
 *   node tools/portrait-add.mjs <캐릭터id> <이미지폴더> --cast "cafe-order:Barista" [--cast ...] [--credit "..."]
 *
 * 이미지폴더: base.(png|jpg|webp) talk.* blink.* 필수, talkO.* smile.* 선택 — 모두 같은 구도·같은 크기
 */
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const LAYERS = ["base", "talk", "talkS", "blink", "talkO", "smile"];
const REQUIRED = ["base", "talk", "blink"];
const MAX_PX = 1024;              // 긴 변 — 폰 화면 높이의 2~3배면 충분
const ALIGN_WARN = 0.06;          // 입·눈 밖 차이가 이보다 크면 교차할 때 티가 난다

const args = process.argv.slice(2);
const id = args[0], srcDir = args[1];
const cast = [], opts = {};
for (let i = 2; i < args.length; i++) {
    if (args[i] === "--cast") cast.push(args[++i]);
    else if (args[i] === "--credit") opts.credit = args[++i];
}
if (!id || !srcDir || !/^[a-z0-9-]+$/.test(id)) {
    console.error('사용: node tools/portrait-add.mjs <id(소문자-하이픈)> <이미지폴더> --cast "챕터:이름" [--credit "..."]');
    process.exit(1);
}

// 1) 이미지 정리: JPEG(품질 85), 긴 변 MAX_PX
const files = readdirSync(srcDir);
const outDir = path.join(ROOT, "assets", "portraits", id);
mkdirSync(outDir, { recursive: true });
const found = {};
for (const k of LAYERS) {
    const f = files.find((x) => new RegExp(`^${k}\\.(png|jpe?g|webp)$`, "i").test(x));
    if (!f) continue;
    const out = path.join(outDir, `${k}.jpg`);
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "85", "-Z", String(MAX_PX), path.join(srcDir, f), "--out", out], { stdio: "ignore" });
    found[k] = `assets/portraits/${id}/${k}.jpg`;
}
const missing = REQUIRED.filter((k) => !found[k]);
if (missing.length) { console.error("필수 이미지 없음: " + missing.join(", ")); process.exit(1); }

// 2) 얼굴 인식: 임시 서버 + 헤드리스 크롬
const port = 5200 + Math.floor(Math.random() * 400), cdpPort = 9300 + Math.floor(Math.random() * 600);
const server = spawn("python3", [path.join(ROOT, "tools", "serve.py"), String(port)], { stdio: "ignore" });
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new", `--remote-debugging-port=${cdpPort}`, "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
    `--user-data-dir=/tmp/ee-portrait-${Date.now()}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cleanup = () => { try { chrome.kill(); } catch {} try { server.kill(); } catch {} };
let result;
try {
    await sleep(800);
    let target;
    for (let i = 0; i < 50 && !target; i++) {
        try { target = (await (await fetch(`http://127.0.0.1:${cdpPort}/json`)).json()).find((t) => t.type === "page"); } catch { await sleep(200); }
    }
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let n = 0; const pending = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
    const send = (method, params = {}) => new Promise((r) => { const i = ++n; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const qs = new URLSearchParams(found).toString();
    await send("Page.navigate", { url: `http://127.0.0.1:${port}/tools/portrait-detect.html?${qs}` });
    for (let i = 0; i < 120 && !result; i++) {
        await sleep(500);
        const r = await send("Runtime.evaluate", { expression: 'document.title==="done" ? document.getElementById("out").textContent : null', returnByValue: true });
        const v = r.result && r.result.result && r.result.result.value;
        if (v) result = JSON.parse(v);
    }
    ws.close();
} finally {
    cleanup();
}
if (!result) { console.error("얼굴 인식 시간 초과 (인터넷 연결 필요: MediaPipe 모델을 내려받음)"); process.exit(1); }
if (result.error) { console.error("얼굴 인식 실패: " + result.error); process.exit(1); }

// 3) 구도 검사
let warn = false;
for (const [k, v] of Object.entries(result.align)) {
    if (typeof v === "string" || v > ALIGN_WARN) {
        warn = true;
        console.warn(`⚠️  ${k}: 기본 이미지와 구도가 달라요 (${v}). 입·눈 밖이 바뀌면 교차할 때 번져 보입니다 — 같은 이미지를 '편집'해서 다시 만들어 주세요`);
    }
}

// 4) portraits.js 갱신
const manifestPath = path.join(ROOT, "assets", "portraits", "portraits.js");
const box = { window: {} };
vm.createContext(box);
vm.runInContext(readFileSync(manifestPath, "utf8"), box);
const P = box.window.EE_PORTRAITS || { characters: {}, cast: {} };
P.characters[id] = Object.assign({}, found, {
    mouth: result.mouth, eyes: result.eyes, eyeL: result.eyeL, eyeR: result.eyeR, aspect: result.aspect,
    credit: opts.credit !== undefined ? opts.credit : (P.characters[id] && P.characters[id].credit) || ""
});
cast.forEach((c) => { P.cast[c] = id; });
const header = readFileSync(manifestPath, "utf8").split("(window.EE_PORTRAITS")[0];
writeFileSync(manifestPath, header + "(window.EE_PORTRAITS = " + JSON.stringify(P, null, 4) + ");\n");

console.log(JSON.stringify({ id, layers: Object.keys(found), mouth: result.mouth, eyes: result.eyes, eyeL: result.eyeL, eyeR: result.eyeR, align: result.align, cast }, null, 1));
console.log(warn ? "\n등록은 했지만 위 경고를 확인하세요." : "\n✅ 등록 완료. npm run stamp 후 롤플레이에서 확인하세요.");
