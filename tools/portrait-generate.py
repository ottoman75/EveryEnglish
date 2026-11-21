#!/usr/bin/env python3
"""
말하는 초상화 이미지 생성 — Stable Diffusion XL (CreativeML Open RAIL++-M, 생성물 상업 이용 가능), 맥(MPS)에서 로컬 실행.

  준비: ~/.cache/everyenglish-imggen/venv (torch, diffusers) + SDXL base 가중치
  1) 기본 이미지 후보:  python tools/portrait-generate.py base <id> --character "..." --background "..." [--seeds 11 22]
                        → _workspace/portraits/<id>/base_<seed>.png  (눈으로 보고 하나를 고른다)
  2) 변형 만들기:       python tools/portrait-generate.py variants <id> --base <파일> --mouth x,y,rx,ry --eyes x,y,rx,ry
                        → _workspace/portraits/<id>/{base,talk,blink}.png
     입·눈 영역만 인페인팅하고 영역 밖은 원본 픽셀을 그대로 합성한다 → 겹쳐도 번지지 않는다.
  3) 등록: node tools/portrait-add.mjs <id> _workspace/portraits/<id> --cast "챕터:이름"
"""
import argparse
import os
import sys

# 공개 모델이라 로그인이 필요 없다. 기기에 저장된(만료된) Hugging Face 토큰을 쓰지 않게 한다
os.environ.setdefault("HF_HUB_DISABLE_IMPLICIT_TOKEN", "1")
os.environ.pop("HF_TOKEN", None)

import torch
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = "stabilityai/stable-diffusion-xl-base-1.0"
W, H = 832, 1040                      # 세로 4:5, 8의 배수
STEPS = 30

STYLE = ("3D animated character portrait, Pixar-like stylized render, soft subsurface skin, large expressive eyes, "
         "front-facing, looking straight at the camera, centered, head and shoulders and upper chest, "
         "friendly relaxed closed-mouth smile, warm soft key light, shallow depth of field, high quality, detailed")
NEGATIVE = ("text, logo, watermark, hands, fingers, multiple people, cropped head, side view, profile, open mouth, "
            "teeth, deformed face, extra eyes, blurry face, photo, realistic photo, anime, lowres, jpeg artifacts, "
            # 얼굴을 크게 요청하면 회색 스튜디오·흑백 점토 모형이 잘 나온다(2026-11-21 Host 시험) → 금지
            "plain background, studio backdrop, gray background, empty background, grayscale, monochrome, clay, sculpture")


def load_pipe():
    from diffusers import StableDiffusionXLPipeline
    dev = "mps" if torch.backends.mps.is_available() else "cpu"
    pipe = StableDiffusionXLPipeline.from_pretrained(MODEL, torch_dtype=torch.float16, variant="fp16", use_safetensors=True)
    pipe.to(dev)
    pipe.enable_attention_slicing()       # 16GB 맥에서 메모리 피크를 낮춘다
    return pipe, dev


def out_dir(cid):
    d = os.path.join(ROOT, "_workspace", "portraits", cid)
    os.makedirs(d, exist_ok=True)
    return d


def cmd_base(a):
    pipe, dev = load_pipe()
    # 배경을 앞에 둔다 — 뒤에 두면 인물 묘사에 밀려 단색 배경이 나오기 쉽다
    prompt = f"{STYLE}, standing in {a.background}. Character: {a.character}. Colorful detailed environment behind"
    for seed in a.seeds:
        g = torch.Generator(device="cpu").manual_seed(seed)
        img = pipe(prompt=prompt, negative_prompt=NEGATIVE, width=W, height=H, num_inference_steps=STEPS,
                   guidance_scale=6.5, generator=g).images[0]
        p = os.path.join(out_dir(a.id), f"base_{seed}.png")
        img.save(p)
        print("saved", p, flush=True)


def ellipse_mask(size, r, grow=1.0, feather=0.0):
    """r = (x, y, rx, ry) 이미지 기준 비율. feather: 가장자리 흐림(픽셀)"""
    w, h = size
    x, y, rx, ry = r
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).ellipse([(x - rx * grow) * w, (y - ry * grow) * h, (x + rx * grow) * w, (y + ry * grow) * h], fill=255)
    return m.filter(ImageFilter.GaussianBlur(feather)) if feather else m


def parse_region(s):
    v = [float(t) for t in s.split(",")]
    assert len(v) == 4, "x,y,rx,ry"
    return v


# 다시 그릴 때는 '그 동작'만 말한다. 기본 스타일 문장(입 다문 미소·큰 눈)을 섞으면 지시가 서로 부딪혀 거의 안 바뀐다
VARIANTS = {
    "talk": ("close-up of a Pixar-style 3D cartoon face speaking calmly, lips slightly parted mid-sentence, small natural mouth opening, "
             "hint of upper teeth, relaxed friendly expression, same skin tone and lip color",
             "closed mouth, wide open mouth, screaming, shouting, yelling, big teeth, tongue out, lipstick, deformed teeth, extra mouth"),
    # 2단계 입의 큰 쪽 — 크게 잡은 영역 + '아' 발음 (talk_5 방식이 자연스러웠다)
    "talkBig": ("close-up of a Pixar-style 3D cartoon face talking, mouth open mid-word saying ah, upper teeth and tongue visible, "
                "same skin tone and lip color", "closed mouth, closed lips, smile, smirk, screaming, deformed teeth, extra mouth"),
    "blink": ("close-up of a Pixar-style 3D cartoon face with both eyes fully closed, eyelids shut, eyelashes resting, calm",
              "open eyes, iris, pupil, eyeball, white of the eye, deformed"),
}
CROP_PX = 1024     # 얼굴 주변을 이 크기로 키워 다시 그린다 — 작은 얼굴을 원본 해상도로 그리면 세부가 뭉개진다


def regions_for(name, mouth, eyes):
    """다시 그릴 타원 목록(이미지 비율). 눈은 한쪽씩 — 하나로 잡으면 코까지 다시 그려진다"""
    if name == "talk":
        x, y, rx, ry = mouth
        return [(x, y - ry * 0.2, rx * 0.6, ry * 0.75)]       # 크게 잡으면 소리 지르는 입이 된다
    if name == "talkBig":
        x, y, rx, ry = mouth
        return [(x, y - ry * 0.15, rx * 0.75, ry * 0.95)]
    x, y, rx, ry = eyes
    off, erx, ery = rx * 0.47, rx * 0.36, ry * 0.62
    return [(x - off, y, erx, ery), (x + off, y, erx, ery)]


def draw_mask(size, ellipses, box, scale, feather=0):
    """box(원본 픽셀) 좌표계로 옮긴 마스크"""
    w, h = size
    m = Image.new("L", (int((box[2] - box[0]) * scale), int((box[3] - box[1]) * scale)), 0)
    d = ImageDraw.Draw(m)
    for x, y, rx, ry in ellipses:
        d.ellipse([((x - rx) * w - box[0]) * scale, ((y - ry) * h - box[1]) * scale,
                   ((x + rx) * w - box[0]) * scale, ((y + ry) * h - box[1]) * scale], fill=255)
    return m.filter(ImageFilter.GaussianBlur(feather)) if feather else m


def cmd_variants(a):
    from diffusers import AutoPipelineForInpainting
    base_pipe, dev = load_pipe()
    inpaint = AutoPipelineForInpainting.from_pipe(base_pipe)   # 가중치 공유 — 메모리 추가 없음
    base = Image.open(a.base).convert("RGB").resize((W, H), Image.LANCZOS)
    mouth, eyes = parse_region(a.mouth), parse_region(a.eyes)
    d = out_dir(a.id)
    base.save(os.path.join(d, "base.png"))
    # 얼굴(눈~입)을 감싸는 정사각형 영역
    cx, cy = mouth[0] * W, (eyes[1] + mouth[1]) / 2 * H
    side = max(eyes[2] * 2 * W, (mouth[1] - eyes[1]) * H * 2.2) * 1.25
    box = (int(max(0, cx - side / 2)), int(max(0, cy - side / 2)), int(min(W, cx + side / 2)), int(min(H, cy + side / 2)))
    crop = base.crop(box)
    scale = CROP_PX / crop.width
    crop_big = crop.resize((CROP_PX, int(crop.height * scale)), Image.LANCZOS)
    names = a.only or ["talk", "talkBig"]      # 감은 눈은 'blink' 하위 명령(직접 그리기)으로
    for name in names:
        prompt, neg = VARIANTS[name]
        ell = regions_for(name, mouth, eyes)
        gen_mask = draw_mask(base.size, ell, box, scale)
        best = None
        for seed in a.seeds:
            g = torch.Generator(device="cpu").manual_seed(seed)
            out = inpaint(prompt=prompt, negative_prompt=neg, image=crop_big, mask_image=gen_mask,
                          width=crop_big.width, height=crop_big.height, num_inference_steps=STEPS,
                          strength=a.strength, guidance_scale=8.0, generator=g).images[0]
            small = out.resize(crop.size, Image.LANCZOS)
            patched = base.copy()
            patched.paste(small, box[:2])
            # 영역 밖은 원본 그대로: 마스크(가장자리 부드럽게) 안쪽만 새 그림
            keep = draw_mask(base.size, [(x, y, rx * 1.05, ry * 1.05) for x, y, rx, ry in ell], (0, 0, W, H), 1, feather=6)
            merged = Image.composite(patched, base, keep)
            p = os.path.join(d, f"{name}_{seed}.png")
            merged.save(p)
            print("saved", p, flush=True)
            if best is None:
                best = merged
        best.save(os.path.join(d, f"{name}.png"))


def cmd_blink(a):
    """감은 눈을 생성 모델 없이 직접 그린다 (SDXL은 감은 눈을 거의 못 그린다 — 2026-11-21 시험에서 4회 모두 실패).
    눈 자리를 주변 피부로 복원(OpenCV 인페인트: 주변 질감·음영을 이어 그림)하고, 완만한 속눈썹 곡선을 그린다.
    깜빡임은 0.14초라 이 정도면 충분하다."""
    import cv2
    import numpy as np
    base = Image.open(a.base).convert("RGB")
    W0, H0 = base.size
    bgr = cv2.cvtColor(np.asarray(base), cv2.COLOR_RGB2BGR)
    mask = np.zeros((H0, W0), np.uint8)
    eyes = []
    for eye in (parse_region(a.eyeL), parse_region(a.eyeR)):
        x, y, rx, ry = eye
        # 얼굴 인식의 눈 상자는 만화 눈(흰자 포함)보다 작다 → 키운다
        cx, cy, ex, ey = x * W0, y * H0, rx * W0 * a.grow_x, ry * H0 * a.grow_y
        cv2.ellipse(mask, (int(cx), int(cy)), (int(ex * 1.08), int(ey * 1.15)), 0, 0, 360, 255, -1)
        eyes.append((cx, cy, ex, ey))
    filled = cv2.inpaint(bgr, mask, 9, cv2.INPAINT_TELEA)
    # 인페인트 결과의 얼룩을 부드럽게, 경계는 원본과 섞는다
    soft = cv2.GaussianBlur(filled, (0, 0), 3)
    m = cv2.GaussianBlur(mask, (0, 0), 4).astype(np.float32)[..., None] / 255.0
    inner = cv2.GaussianBlur(cv2.erode(mask, np.ones((7, 7), np.uint8)), (0, 0), 3).astype(np.float32)[..., None] / 255.0
    mixed = filled * (1 - inner) + soft * inner
    out = bgr * (1 - m) + mixed * m
    res = Image.fromarray(cv2.cvtColor(np.clip(out, 0, 255).astype(np.uint8), cv2.COLOR_BGR2RGB))
    # 감은 눈꺼풀 선: 아래로 완만하게 휜 호 하나 (작은 속눈썹 가닥은 줄이면 갈고리처럼 보여 뺐다)
    over = Image.new("RGBA", (W0 * 2, H0 * 2), (0, 0, 0, 0))     # 2배로 그려 줄이면 선이 매끄럽다
    d = ImageDraw.Draw(over)
    col = (60, 40, 34, 255)
    for cx, cy, ex, ey in eyes:
        lw = max(4, int(ey * 0.32))
        ly = cy + ey * 0.15
        d.arc([2 * (cx - ex * 0.95), 2 * (ly - ey * 0.55), 2 * (cx + ex * 0.95), 2 * (ly + ey * 0.55)], 12, 168, fill=col, width=lw)
    over = over.resize((W0, H0), Image.LANCZOS)
    res.paste(over, (0, 0), over)
    p = os.path.join(out_dir(a.id), "blink.png")
    res.save(p)
    print("saved", p, flush=True)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("base")
    b.add_argument("id"); b.add_argument("--character", required=True); b.add_argument("--background", required=True)
    b.add_argument("--seeds", type=int, nargs="+", default=[11, 22])
    v = sub.add_parser("variants")
    v.add_argument("id"); v.add_argument("--base", required=True)
    v.add_argument("--mouth", required=True); v.add_argument("--eyes", required=True)
    v.add_argument("--seeds", type=int, nargs="+", default=[5, 6])
    v.add_argument("--strength", type=float, default=0.99)
    v.add_argument("--only", nargs="+", choices=["talk", "talkBig", "blink"])
    k = sub.add_parser("blink")
    k.add_argument("id"); k.add_argument("--base", required=True)
    k.add_argument("--eyeL", required=True); k.add_argument("--eyeR", required=True)
    k.add_argument("--grow-x", dest="grow_x", type=float, default=1.45)
    k.add_argument("--grow-y", dest="grow_y", type=float, default=2.0)
    a = ap.parse_args()
    {"base": cmd_base, "variants": cmd_variants, "blink": cmd_blink}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
