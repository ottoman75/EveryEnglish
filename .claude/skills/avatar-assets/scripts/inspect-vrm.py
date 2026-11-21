#!/usr/bin/env python3
"""VRM(GLB) 파일 점검: 버전, 표정, 텍스처, 라이선스 메타. 표준 라이브러리만 사용.
사용: python3 inspect-vrm.py model.vrm [--json]
"""
import json
import os
import struct
import sys

REQUIRED_1 = ["aa", "ih", "ou", "ee", "oh", "blink", "happy"]
REQUIRED_0 = ["a", "i", "u", "e", "o", "blink", "joy"]


def read_glb(path):
    with open(path, "rb") as f:
        data = f.read()
    magic, version, length = struct.unpack_from("<4sII", data, 0)
    if magic != b"glTF":
        raise SystemExit("GLB/VRM 파일이 아님")
    off, js, binv = 12, None, None
    while off < length:
        clen, ctype = struct.unpack_from("<I4s", data, off)
        chunk = data[off + 8: off + 8 + clen]
        if ctype == b"JSON":
            js = json.loads(chunk)
        elif ctype == b"BIN\x00":
            binv = chunk
        off += 8 + clen
    return js, binv, len(data)


def image_sizes(js, binv):
    out = []
    for i, img in enumerate(js.get("images", [])):
        bv = js["bufferViews"][img["bufferView"]] if "bufferView" in img else None
        raw = binv[bv.get("byteOffset", 0): bv.get("byteOffset", 0) + bv["byteLength"]] if bv else b""
        w = h = None
        if raw[:8] == b"\x89PNG\r\n\x1a\n":
            w, h = struct.unpack(">II", raw[16:24])
        elif raw[:2] == b"\xff\xd8":
            p = 2
            while p < len(raw):
                if raw[p] != 0xFF:
                    break
                m, seg = raw[p + 1], struct.unpack(">H", raw[p + 2:p + 4])[0]
                if m in (0xC0, 0xC1, 0xC2):
                    h, w = struct.unpack(">HH", raw[p + 5:p + 9])
                    break
                p += 2 + seg
        out.append({"index": i, "mime": img.get("mimeType"), "bytes": len(raw), "w": w, "h": h})
    return out


def main():
    path = sys.argv[1]
    js, binv, size = read_glb(path)
    ext = js.get("extensions", {})
    info = {"file": os.path.basename(path), "mb": round(size / 1e6, 2)}
    if "VRMC_vrm" in ext:
        v = ext["VRMC_vrm"]
        info["vrm"] = "1.0"
        exprs = v.get("expressions", {})
        names = list(exprs.get("preset", {}).keys()) + list(exprs.get("custom", {}).keys())
        info["meta"] = {k: v.get("meta", {}).get(k) for k in
                        ["name", "authors", "licenseUrl", "avatarPermission", "commercialUsage",
                         "allowRedistribution", "modification", "creditNotation", "otherLicenseUrl"]}
        required = REQUIRED_1
    elif "VRM" in ext:
        v = ext["VRM"]
        info["vrm"] = "0.x"
        names = [g.get("presetName") if g.get("presetName") != "unknown" else g.get("name")
                 for g in v.get("blendShapeMaster", {}).get("blendShapeGroups", [])]
        names = [n.lower() for n in names if n]
        m = v.get("meta", {})
        info["meta"] = {k: m.get(k) for k in ["title", "author", "licenseName", "otherLicenseUrl",
                                               "allowedUserName", "commercialUssageName", "violentUssageName",
                                               "sexualUssageName"]}
        required = REQUIRED_0
    else:
        info["vrm"] = None
        names, required = [], REQUIRED_1
    info["expressions"] = names
    info["missing_required"] = [r for r in required if r not in names]
    imgs = image_sizes(js, binv or b"")
    info["textures"] = {"count": len(imgs), "max_px": max([max(i["w"] or 0, i["h"] or 0) for i in imgs] or [0]),
                        "mb": round(sum(i["bytes"] for i in imgs) / 1e6, 2)}
    info["meshes"] = len(js.get("meshes", []))
    if "--json" in sys.argv:
        print(json.dumps(info, ensure_ascii=False))
    else:
        for k, val in info.items():
            print(f"{k:18} {val}")


if __name__ == "__main__":
    main()
