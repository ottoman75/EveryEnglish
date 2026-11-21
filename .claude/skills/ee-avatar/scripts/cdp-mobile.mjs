// 모바일 기기 에뮬레이션(폭·픽셀비·터치·meta viewport 적용)으로 페이지를 열고 단계별 동작을 실행한다.
// 사용: node cdp-mobile.mjs <url> <steps.json>
//   steps: [{ "wait": ms } | { "eval": "js식" , "label": "..." } | { "tap": [x,y] } | { "tapSelector": "css" } | { "shot": "path.png" }]
// 결과: 각 eval 값과 스크린샷 경로를 JSON으로 출력
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
const [url, stepsFile] = process.argv.slice(2);
const steps = JSON.parse(readFileSync(stepsFile, "utf8"));
const W = +(process.env.W || 390), H = +(process.env.H || 844), DPR = +(process.env.DPR || 3);
const PORT = 9300 + Math.floor(Math.random() * 600);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", "--remote-debugging-port=" + PORT, "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
  "--autoplay-policy=" + (process.env.AUTOPLAY || "user-gesture-required"),
  "--user-data-dir=/tmp/ee-cdpm-" + Date.now(), "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page"); } catch { await sleep(200); } }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const MOBILE = process.env.MOBILE !== "0";   // MOBILE=0 이면 데스크톱(맥) 크롬처럼
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: DPR, mobile: MOBILE });
if (MOBILE) await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
if (MOBILE) await send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" });
await send("Page.enable");
await send("Page.navigate", { url });
const out = [];
for (const s of steps) {
  if (s.wait) await sleep(s.wait);
  if (s.tapSelector) {
    const r = await send("Runtime.evaluate", { expression: `(()=>{const e=document.querySelector(${JSON.stringify(s.tapSelector)}); if(!e) return null; const b=e.getBoundingClientRect(); return [b.left+b.width/2, b.top+b.height/2];})()`, returnByValue: true });
    s.tap = r.result.result.value;
    out.push({ tapped: s.tapSelector, at: s.tap });
  }
  if (s.tap) {
    const [x, y] = s.tap;
    await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
  }
  if (s.eval) {
    const r = await send("Runtime.evaluate", { expression: s.eval, returnByValue: true, awaitPromise: true });
    out.push({ [s.label || "eval"]: r.result && r.result.result ? r.result.result.value : r.result });
  }
  if (s.shot) {
    const r = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(s.shot, Buffer.from(r.result.data, "base64"));
    out.push({ shot: s.shot });
  }
}
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); process.exit(0);
