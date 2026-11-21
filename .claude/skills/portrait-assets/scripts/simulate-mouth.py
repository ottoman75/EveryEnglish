#!/usr/bin/env python3
"""
말하는 초상화 입 움직임을 앱과 같은 계산으로 재현해 프레임 시트로 그린다(실기기 없이 '자연스러운지' 눈으로 확인).
js/core/lipsync.js(분석·입 모양) + js/app/portrait.js(평활화·이산 전환·유지 시간)의 수치를 그대로 옮겼다 — 둘을 바꾸면 여기도 바꾼다.

사용: python simulate-mouth.py <base.jpg> <talkS.jpg> <talk.jpg> <audio.m4a> <out.png> [--box x0,y0,x1,y1 비율]
"""
import subprocess, sys, tempfile, wave
import numpy as np
from PIL import Image

def analyze(path):
    tmp = tempfile.mktemp(suffix=".wav")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", path, "-ac", "1", "-ar", "24000", tmp], check=True)
    w = wave.open(tmp); sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    hop = sr // 60; win = hop * 2; n = len(x) // hop
    rms = np.array([np.sqrt(np.mean(x[f*hop:f*hop+win] ** 2)) for f in range(n)])
    zcr = np.array([np.mean(np.diff(np.sign(x[f*hop:f*hop+win])) != 0) for f in range(n)])
    level = np.minimum(1.2, rms / np.sort(rms)[int(n * 0.95)])
    return level, zcr

def ss(a, b, v): t = np.clip((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def mouth_open(level, zcr):
    o = ss(0.18, 0.75, level); ee = o * ss(0.055, 0.095, zcr); ou = o * (1 - ss(0.022, 0.034, zcr)) * 0.9
    aa = np.maximum(0, o - np.maximum(ee, ou) * 0.8); tot = aa + ee * 1.35 + ou * 1.5; cap = o * 0.9
    sc = np.where(tot > cap, cap / np.maximum(tot, 1e-6), 1)
    return (aa + ee * 1.35 + ou * 1.5) * sc

def states(openv):
    m, st, since, out = 0.0, "closed", -1e9, []
    up = {"closed": 0.14, "talkS": 0.55}; down = {"talkS": 0.09, "talk": 0.45}
    for i, t in enumerate(openv):
        m += (t - m) * min(1, (30 if t > m else 16) / 60); now = i * 1000 / 60
        nxt = st
        if st == "closed" and m > up["closed"]: nxt = "talk" if m > up["talkS"] else "talkS"
        elif st == "talkS": nxt = "talk" if m > up["talkS"] else ("closed" if m < down["talkS"] else "talkS")
        elif st == "talk" and m < down["talk"]: nxt = "talkS" if m > down["talkS"] else "closed"
        if nxt != st and now - since >= 70: st, since = nxt, now
        out.append(st)
    return out

def main():
    base, tS, tB, audio, out = sys.argv[1:6]
    box = [0.33, 0.43, 0.65, 0.6]
    if "--box" in sys.argv: box = [float(v) for v in sys.argv[sys.argv.index("--box") + 1].split(",")]
    imgs = {k: Image.open(p).convert("RGB") for k, p in (("closed", base), ("talkS", tS), ("talk", tB))}
    W, H = imgs["closed"].size; b = (int(W*box[0]), int(H*box[1]), int(W*box[2]), int(H*box[3]))
    st = states(mouth_open(*analyze(audio)))
    frames = [imgs[s].crop(b).resize((160, int(160 * (b[3]-b[1]) / (b[2]-b[0])))) for s in st[::4]]  # 15fps
    cols = 12; fw, fh = frames[0].size; rows = (len(frames) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * fw, rows * fh), "white")
    for k, f in enumerate(frames): sheet.paste(f, ((k % cols) * fw, (k // cols) * fh))
    sheet.save(out)
    from collections import Counter; c = Counter(st)
    print({k: round(v / len(st), 2) for k, v in c.items()}, "switches/s:", round(sum(1 for i in range(1, len(st)) if st[i] != st[i-1]) / (len(st) / 60), 1))

if __name__ == "__main__":
    main()
