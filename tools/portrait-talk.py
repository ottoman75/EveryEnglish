#!/usr/bin/env python3
"""
말하는 초상화의 '입 영상' 생성 — SadTalker(Apache-2.0)로 대사마다 입·턱 움직임 영상을 만들어 등록한다.
이미지 3장 전환(닫힘/살짝/벌림)은 소리 크기만 따라가 상용 수준으로는 어색했다(2026-11-22 사용자 피드백).

  준비: ~/.cache/everyenglish-talker/SadTalker (.venv, checkpoints) — MPS 패치 적용본(EE_MPS=1)
  실행: python3 tools/portrait-talk.py <캐릭터id> [--limit N] [--force]
    → assets/portraits/<id>/v/<녹음파일명>.mp4  +  portraits.js characters[id].videos / videoBox

  - 대상 대사: portraits.js cast 에서 이 캐릭터에 연결된 등장인물의 상대 대사 전부(tools/collect-speech.js 기준)
  - 영상은 입·턱 상자만 잘라 작게(H.264, 무음) 저장 — 눈은 앱에서 선명한 원본 + 깜빡임 층을 그대로 쓴다
  - 이미 만든 대사는 건너뛴다(증분). M1 기준 대사 1개 ≈ 2~3분
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TALKER = os.path.expanduser("~/.cache/everyenglish-talker/SadTalker")
MANIFEST = os.path.join(ROOT, "assets", "portraits", "portraits.js")
VIDEO_W = 288                      # 입 상자 영상 폭(px). 폰에서 입 상자는 화면상 120~160px 정도라 2배 여유


def node_json(js):
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))


def load_portraits():
    return node_json("const fs=require('fs'),vm=require('vm');const b={window:{}};vm.createContext(b);"
                     "vm.runInContext(fs.readFileSync('assets/portraits/portraits.js','utf8'),b);"
                     "process.stdout.write(JSON.stringify(b.window.EE_PORTRAITS))")


def save_portraits(P):
    src = open(MANIFEST, encoding="utf-8").read()
    header = src.split("(window.EE_PORTRAITS")[0]
    with open(MANIFEST, "w", encoding="utf-8") as f:
        f.write(header + "(window.EE_PORTRAITS = " + json.dumps(P, ensure_ascii=False, indent=4) + ");\n")


def lines_for(P, cid):
    speakers = [k for k, v in P["cast"].items() if v == cid]
    items = json.loads(subprocess.check_output(["node", "tools/collect-speech.js"], cwd=ROOT))
    clips = node_json("const fs=require('fs'),vm=require('vm');const b={window:{}};vm.createContext(b);"
                      "vm.runInContext(fs.readFileSync('js/data/audio-manifest.js','utf8'),b);"
                      "process.stdout.write(JSON.stringify(b.window.EE_AUDIO.clips))")
    return [(it["text"], clips[it["text"]]) for it in items
            if it.get("role") == "partner" and it.get("speaker") in speakers and it["text"] in clips]


def video_box(ch):
    """입·턱이 움직이는 범위 (이미지 비율). 윗입술 위 인중부터 턱 아래까지"""
    m = ch["mouth"]
    x0, x1 = m["x"] - m["rx"] * 1.2, m["x"] + m["rx"] * 1.2
    y0, y1 = m["y"] - m["ry"] * 2.0, m["y"] + m["ry"] * 2.8
    clamp = lambda v: max(0.0, min(1.0, v))
    return {"x0": round(clamp(x0), 4), "y0": round(clamp(y0), 4), "x1": round(clamp(x1), 4), "y1": round(clamp(y1), 4)}


def run_talker(img, wav, outdir):
    env = dict(os.environ, EE_MPS="1", PYTORCH_ENABLE_MPS_FALLBACK="1")
    subprocess.run([os.path.join(TALKER, ".venv", "bin", "python"), "inference.py", "--driven_audio", wav,
                    "--source_image", img, "--result_dir", outdir, "--still", "--preprocess", "full", "--size", "256"],
                   cwd=TALKER, env=env, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    vids = [os.path.join(outdir, f) for f in os.listdir(outdir) if f.endswith(".mp4")]
    if not vids:
        raise RuntimeError("SadTalker가 영상을 만들지 못함")
    return vids[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    P = load_portraits()
    ch = P["characters"].get(a.id)
    if not ch:
        sys.exit(f"portraits.js에 {a.id} 없음 — 먼저 portrait-add.mjs로 등록")
    src_png = os.path.join(ROOT, "_workspace", "portraits", a.id, "base.png")      # 원본 해상도(832×1040) 기본 이미지
    if not os.path.exists(src_png):
        src_png = os.path.join(ROOT, ch["base"])
    box = video_box(ch)
    vdir = os.path.join(ROOT, "assets", "portraits", a.id, "v")
    os.makedirs(vdir, exist_ok=True)
    todo = lines_for(P, a.id)
    if a.limit:
        todo = todo[:a.limit]
    videos = dict(ch.get("videos") or {})
    print(f"{a.id}: 대사 {len(todo)}개 · 상자 {box}", flush=True)
    for i, (text, clip) in enumerate(todo, 1):
        out = os.path.join(vdir, clip.replace(".m4a", ".mp4"))
        rel = f"assets/portraits/{a.id}/v/{os.path.basename(out)}"
        if os.path.exists(out) and not a.force:
            videos[clip] = rel
            continue
        tmp = tempfile.mkdtemp()
        try:
            wav = os.path.join(tmp, "line.wav")
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", os.path.join(ROOT, "audio", clip), "-ac", "1", "-ar", "16000", wav], check=True)
            full = run_talker(src_png, wav, os.path.join(tmp, "out"))
            # 입 상자만 잘라 작게: 짝수 크기, H.264 baseline(폰 호환), 무음, 빠른 시작
            crop = (f"crop=iw*{box['x1'] - box['x0']:.4f}:ih*{box['y1'] - box['y0']:.4f}:iw*{box['x0']:.4f}:ih*{box['y0']:.4f},"
                    f"scale={VIDEO_W}:-2")
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", full, "-vf", crop, "-an", "-c:v", "libx264",
                            "-profile:v", "baseline", "-pix_fmt", "yuv420p", "-crf", "24", "-movflags", "+faststart", out], check=True)
            videos[clip] = rel
            print(f"  [{i}/{len(todo)}] {os.path.getsize(out) // 1024}KB  {text}", flush=True)
        except Exception as e:
            print(f"  [{i}/{len(todo)}] 실패: {text} — {e}", flush=True)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
        # 대사마다 저장 — 중간에 끊겨도 만든 것까지는 앱에서 쓴다
        P = load_portraits()
        P["characters"][a.id]["videos"] = videos
        P["characters"][a.id]["videoBox"] = box
        save_portraits(P)
    P = load_portraits()
    P["characters"][a.id]["videos"] = videos
    P["characters"][a.id]["videoBox"] = box
    save_portraits(P)
    print(f"완료: 영상 {len(videos)}개", flush=True)


if __name__ == "__main__":
    sys.exit(main())
