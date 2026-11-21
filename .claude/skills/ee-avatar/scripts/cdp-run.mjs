// 헤드리스 크롬(SwiftShader WebGL)에서 페이지를 열고 식이 문자열을 돌려줄 때까지 반복 평가한다.
// 사용: node cdp-run.mjs <url> "<js 식 — 결과 문자열 또는 null>" [timeoutMs]
import { spawn } from "node:child_process";
const PORT = 9300 + Math.floor(Math.random() * 600);   // 이전 실행의 크롬이 아직 살아 있어도 겹치지 않게
import { readFileSync } from "node:fs";
const [url, exprArg, timeout = "60000"] = process.argv.slice(2);
const expr = exprArg.startsWith("@") ? readFileSync(exprArg.slice(1), "utf8") : exprArg;   // @파일 로 긴 식 전달
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", "--remote-debugging-port=" + PORT, "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
  "--autoplay-policy=no-user-gesture-required", "--window-size=420,900", "--user-data-dir=/tmp/ee-cdp-" + Date.now(), "about:blank"],
  { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  try { target = (await (await fetch("http://127.0.0.1:" + PORT + "/json")).json()).find((t) => t.type === "page"); } catch { await sleep(200); }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.onopen = r);
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.navigate", { url });
const end = Date.now() + +timeout; let result = null;
while (Date.now() < end) {
  await sleep(500);
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  result = r.result && r.result.result && r.result.result.value;
  if (result) break;
}
console.log(result || "TIMEOUT");
ws.close(); chrome.kill();
process.exit(0);
