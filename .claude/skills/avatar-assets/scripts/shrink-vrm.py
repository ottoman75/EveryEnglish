#!/usr/bin/env python3
"""VRM(GLB) 텍스처 경량화. 모든 glTF/VRM 확장(JSON)은 그대로 두고 이미지 바이트만 다시 인코딩해 바이너리를 재배치한다.
- 최대 변 길이를 --max 로 축소
- 투명도가 없는 이미지는 JPEG(품질 --q)로, 투명도가 있으면 PNG 유지
사용: python shrink-vrm.py in.vrm out.vrm --max 1024 --q 85     (Pillow 필요)
"""
import argparse
import io
import json
import struct

from PIL import Image


def read_glb(path):
    data = open(path, "rb").read()
    off, js, binv = 12, None, b""
    while off < len(data):
        clen, ctype = struct.unpack_from("<I4s", data, off)
        chunk = data[off + 8: off + 8 + clen]
        if ctype == b"JSON":
            js = json.loads(chunk)
        elif ctype == b"BIN\x00":
            binv = chunk
        off += 8 + clen
    return js, binv


def pad4(b, fill=b"\x00"):
    return b + fill * ((4 - len(b) % 4) % 4)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("dst")
    ap.add_argument("--max", type=int, default=1024); ap.add_argument("--q", type=int, default=85)
    a = ap.parse_args()
    js, binv = read_glb(a.src)

    image_views = {img["bufferView"]: i for i, img in enumerate(js.get("images", [])) if "bufferView" in img}
    new_bin, before, after = bytearray(), 0, 0
    for vi, bv in enumerate(js["bufferViews"]):
        start = bv.get("byteOffset", 0)
        raw = binv[start: start + bv["byteLength"]]
        if vi in image_views:
            img_meta = js["images"][image_views[vi]]
            im = Image.open(io.BytesIO(raw))
            im.load()
            if max(im.size) > a.max:
                im.thumbnail((a.max, a.max), Image.LANCZOS)
            has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
            if has_alpha and im.mode != "RGBA":
                im = im.convert("RGBA")
            if has_alpha and im.getextrema()[3][0] == 255:
                has_alpha = False   # 알파 채널이 있지만 전부 불투명
            out = io.BytesIO()
            if has_alpha:
                im.save(out, "PNG", optimize=True)
                img_meta["mimeType"] = "image/png"
            else:
                im.convert("RGB").save(out, "JPEG", quality=a.q, optimize=True, progressive=False)
                img_meta["mimeType"] = "image/jpeg"
            enc = out.getvalue()
            if len(enc) < len(raw):
                before += len(raw); after += len(enc); raw = enc
            else:
                before += len(raw); after += len(raw)
        bv["byteOffset"] = len(new_bin)
        bv["byteLength"] = len(raw)
        new_bin += raw
        new_bin = bytearray(pad4(bytes(new_bin)))
    js["buffers"][0]["byteLength"] = len(new_bin)

    jbytes = pad4(json.dumps(js, separators=(",", ":"), ensure_ascii=False).encode(), b" ")
    total = 12 + 8 + len(jbytes) + 8 + len(new_bin)
    with open(a.dst, "wb") as f:
        f.write(struct.pack("<4sII", b"glTF", 2, total))
        f.write(struct.pack("<I4s", len(jbytes), b"JSON")); f.write(jbytes)
        f.write(struct.pack("<I4s", len(new_bin), b"BIN\x00")); f.write(new_bin)
    print(f"textures {before/1e6:.2f}MB → {after/1e6:.2f}MB · file {total/1e6:.2f}MB")


if __name__ == "__main__":
    main()
