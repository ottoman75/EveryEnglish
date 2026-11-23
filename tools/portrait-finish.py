#!/usr/bin/env python3
"""
고른 기본 이미지 한 장으로 인물 하나를 끝까지 완성한다 (사람이 할 일은 '기본 이미지 고르기'뿐).

  python3 tools/portrait-finish.py <id> --base <png> [--crop x0,y0,x1,y1] [--no-video]

  1) 기본 이미지 정리(필요하면 머리~가슴으로 잘라 832×1040)
  2) 얼굴 인식으로 입·눈 위치 (portrait-add.mjs)
  3) 감은 눈 직접 그리기 (portrait-generate.py blink)
  4) 등록 — cast-plan.json 의 배역에 연결
  5) 대사별 입 영상 (portrait-talk.py) — 인물당 대사 수 × 약 3분
  6) 영상에서 크게 벌린 프레임으로 이미지 대체용 talk/talkS 만들기(derive-mouth squash) → 재등록
     (영상이 없는 대사·기기 음성일 때 쓰는 대체용. 따로 생성하면 입이 어색했다)
"""
import argparse
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_PY = os.path.expanduser("~/.cache/everyenglish-imggen/venv/bin/python")
W, H = 832, 1040


def run(cmd, **kw):
    print("  $", " ".join(cmd[:4]), "...", flush=True)
    return subprocess.run(cmd, cwd=ROOT, check=True, **kw)


def detect(id_, folder):
    out = subprocess.check_output(["node", "tools/portrait-add.mjs", id_, folder], cwd=ROOT, text=True)
    return json.loads(out[out.index("{"): out.rindex("}") + 1])


def region(r):
    return f"{r['x']},{r['y']},{r['rx']},{r['ry']}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id"); ap.add_argument("--base", required=True)
    ap.add_argument("--crop", help="x0,y0,x1,y1 비율 — 얼굴이 작을 때 머리~가슴으로 잘라 확대")
    ap.add_argument("--no-video", action="store_true")
    a = ap.parse_args()
    plan = json.load(open(os.path.join(ROOT, "assets", "portraits", "cast-plan.json"), encoding="utf-8"))
    entry = next((c for c in plan["characters"] if c["id"] == a.id), None)
    if not entry:
        sys.exit(f"cast-plan.json 에 {a.id} 없음")
    wd = os.path.join(ROOT, "_workspace", "portraits", a.id)
    os.makedirs(wd, exist_ok=True)

    # 0) 자동 자르기: 얼굴이 작으면(상반신 구도) 머리~가슴 4:5로 잘라 확대 — 폰에서 입 움직임이 보이게
    crop = a.crop
    if not crop:
        pre = os.path.join(wd, "pre")
        os.makedirs(pre, exist_ok=True)
        for k in ("base", "talk", "blink"):
            shutil.copy(os.path.abspath(a.base), os.path.join(pre, f"{k}.png"))
        r0 = detect(a.id, pre)
        eye_y, mouth_y = r0["eyes"]["y"], r0["mouth"]["y"]
        face_h = mouth_y - eye_y                       # 눈~입 거리(이미지 높이 비율)
        if face_h < 0.16:                              # 얼굴이 작다 — 눈~입이 화면 높이의 16% 미만
            ch_ = min(1.0, face_h * 6.5)              # 잘라낼 높이(비율): 머리 위~어깨 (4.6은 머리가 잘렸다)
            # 원본이 4:5라서 같은 4:5로 자르려면 폭 비율 = 높이 비율
            top = min(max(0.0, eye_y - ch_ * 0.34), 1.0 - ch_)
            x0 = min(max(0.0, r0["eyes"]["x"] - ch_ / 2), 1.0 - ch_)
            crop = f"{x0:.4f},{top:.4f},{x0 + ch_:.4f},{top + ch_:.4f}"
            src_px = ch_ * H
            print(f"  자동 자르기 {crop} (원본 {src_px:.0f}px → {H}px, {H / src_px:.1f}배 확대)", flush=True)
            if H / src_px > 2.6:
                print(f"  ⚠️ 확대가 커서 흐릴 수 있음 — 다시 생성 권장", flush=True)

    # 1) 기본 이미지
    base = os.path.join(wd, "base.png")
    script = ("from PIL import Image\nimport sys\nim=Image.open(sys.argv[1]).convert('RGB')\n"
              "c=sys.argv[3]\n"
              "if c!='-':\n  x0,y0,x1,y1=[float(v) for v in c.split(',')]; w,h=im.size; im=im.crop((int(x0*w),int(y0*h),int(x1*w),int(y1*h)))\n"
              f"im.resize(({W},{H}), Image.LANCZOS).save(sys.argv[2])\n")
    run([IMG_PY, "-c", script, os.path.abspath(a.base), base, crop or "-"])

    # 2) 얼굴 인식 (변형은 기본 이미지 복사본으로 — 위치만 잰다)
    det = os.path.join(wd, "detect")
    os.makedirs(det, exist_ok=True)
    for k in ("base", "talk", "blink"):
        shutil.copy(base, os.path.join(det, f"{k}.png"))
    r = detect(a.id, det)
    print("  입", r["mouth"], "눈", r["eyeL"], r["eyeR"], flush=True)

    # 3) 감은 눈
    run([IMG_PY, "tools/portrait-generate.py", "blink", a.id, "--base", base, "--eyeL", region(r["eyeL"]), "--eyeR", region(r["eyeR"])],
        env=dict(os.environ, HF_HUB_OFFLINE="1"))

    # 4) 등록 (입 대체용은 일단 기본 이미지 — 6단계에서 영상 프레임으로 바꾼다)
    fin = os.path.join(wd, "final")
    os.makedirs(fin, exist_ok=True)
    shutil.copy(base, os.path.join(fin, "base.png"))
    shutil.copy(os.path.join(wd, "blink.png"), os.path.join(fin, "blink.png"))
    shutil.copy(base, os.path.join(fin, "talk.png"))
    cast_args = sum([["--cast", c] for c in entry["cast"]], [])
    run(["node", "tools/portrait-add.mjs", a.id, fin] + cast_args, stdout=subprocess.DEVNULL)

    if a.no_video:
        return
    # 5) 대사별 입 영상
    run(["python3", "tools/portrait-talk.py", a.id])

    # 6) 영상에서 입 대체 이미지 만들기
    P = json.loads(subprocess.check_output(["node", "-e",
        "const fs=require('fs'),vm=require('vm');const b={window:{}};vm.createContext(b);"
        "vm.runInContext(fs.readFileSync('assets/portraits/portraits.js','utf8'),b);"
        "process.stdout.write(JSON.stringify(b.window.EE_PORTRAITS))"], cwd=ROOT))
    ch = P["characters"][a.id]
    vids = [os.path.join(ROOT, v) for v in (ch.get("videos") or {}).values()]
    if not vids:
        print("  영상 없음 — 입 대체 이미지 건너뜀", flush=True)
        return
    longest = max(vids, key=os.path.getsize)
    open_png = os.path.join(wd, "talk_from_video.png")
    pick = r'''
import sys, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
vid, base_p, out_p, bx = sys.argv[1], sys.argv[2], sys.argv[3], [float(v) for v in sys.argv[4].split(",")]
cap = cv2.VideoCapture(vid); frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))
# 입속(어두운 부분)이 넓을수록 크게 벌린 프레임. 너무 큰 입을 피해 상위 80% 지점을 쓴다
dark = [float((f.astype(np.float32).mean(2) < 70).mean()) for f in frames]
order = np.argsort(dark); idx = int(order[int(len(order) * 0.8)])
fr = Image.fromarray(frames[idx])
base = Image.open(base_p).convert("RGB"); W, H = base.size
box = (int(bx[0] * W), int(bx[1] * H), int(bx[2] * W), int(bx[3] * H))
fr = fr.resize((box[2] - box[0], box[3] - box[1]), Image.LANCZOS)
m = Image.new("L", fr.size, 0); w, h = fr.size
ImageDraw.Draw(m).ellipse([w * 0.08, h * 0.08, w * 0.92, h * 0.92], fill=255); m = m.filter(ImageFilter.GaussianBlur(w * 0.06))
base.paste(fr, box[:2], m); base.save(out_p)
'''
    b = ch["videoBox"]
    run([IMG_PY, "-c", pick, longest, base, open_png, f"{b['x0']},{b['y0']},{b['x1']},{b['y1']}"])
    shutil.copy(open_png, os.path.join(fin, "talk.png"))
    run([IMG_PY, ".claude/skills/portrait-assets/scripts/derive-mouth.py", "squash", base, open_png, os.path.join(fin, "talkS.png"), "0.5"])
    run(["node", "tools/portrait-add.mjs", a.id, fin] + cast_args, stdout=subprocess.DEVNULL)
    print(f"✅ {a.id} 완료 — 영상 {len(vids)}개", flush=True)


if __name__ == "__main__":
    sys.exit(main())
