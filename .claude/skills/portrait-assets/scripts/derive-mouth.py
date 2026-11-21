#!/usr/bin/env python3
"""
입 변형 이미지 후처리 (생성 모델 결과를 기본 이미지에 깔끔하게 붙이기)

  keep  <base> <new> <out> [임계값=38]  : new에서 '크게 달라진 덩어리'(벌린 입속·이)만 가져오고 나머지는 base 그대로.
                                          수염·피부 질감이 다시 그려져 생기는 얼룩(회색 사각형)을 없앤다 — host-m에서 실제로 생겼다
  squash <base> <open> <out> [비율=0.45] : 벌린 입을 세로로 눌러 '살짝 벌린 입'을 만든다(윗입술 고정).
                                          살짝 벌린 입을 따로 생성하면 같은 사람의 입처럼 안 보이거나 거의 안 열린다
"""
import sys
import cv2
import numpy as np
from PIL import Image


def load(p):
    return np.asarray(Image.open(p).convert("RGB")).astype(np.float32)


def mouth_blob(base, new, thr):
    diff = (np.abs(new - base).mean(2) > thr).astype(np.uint8) * 255
    diff = cv2.morphologyEx(diff, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(diff)
    if n <= 1:
        raise SystemExit("달라진 부분을 못 찾음 — 임계값을 낮추거나 입이 실제로 열렸는지 확인")
    k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    return np.where(lab == k, 255, 0).astype(np.uint8), st[k, :4]


def save(arr, p):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(p)


def keep(base_p, new_p, out_p, thr=38.0):
    base, new = load(base_p), load(new_p)
    m, _ = mouth_blob(base, new, thr)
    m = cv2.GaussianBlur(cv2.dilate(m, np.ones((9, 9), np.uint8)), (0, 0), 4).astype(np.float32)[..., None] / 255
    save(base * (1 - m) + new * m, out_p)


def squash(base_p, open_p, out_p, ratio=0.45):
    base, opn = load(base_p), load(open_p)
    _, (x, y, w, h) = mouth_blob(base, opn, 38)
    pad = 10
    x0, y0, x1, y1 = x - pad, y - pad, x + w + pad, y + h + pad
    nh = max(4, int((y1 - y0) * ratio))
    canvas = base.copy()
    canvas[y0:y0 + nh, x0:x1] = cv2.resize(opn[y0:y1, x0:x1], (x1 - x0, nh), interpolation=cv2.INTER_AREA)
    m = np.zeros(base.shape[:2], np.float32)
    cv2.ellipse(m, ((x0 + x1) // 2, y0 + nh // 2), ((x1 - x0) // 2, max(2, nh // 2)), 0, 0, 360, 1.0, -1)
    m = cv2.GaussianBlur(m, (0, 0), 3)[..., None]
    save(base * (1 - m) + canvas * m, out_p)


if __name__ == "__main__":
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "keep":
        keep(args[0], args[1], args[2], float(args[3]) if len(args) > 3 else 38.0)
    elif cmd == "squash":
        squash(args[0], args[1], args[2], float(args[3]) if len(args) > 3 else 0.45)
    else:
        raise SystemExit(__doc__)
    print("saved", args[2])
