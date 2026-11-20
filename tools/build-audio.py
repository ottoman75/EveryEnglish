#!/usr/bin/env python3
"""
원어민 음성 오디오 생성기 — Kokoro-82M (Apache-2.0) 뉴럴 TTS.

  준비(최초 1회):  tools/setup-tts.sh
  실행:           ~/.cache/everyenglish-tts/venv/bin/python tools/build-audio.py

- 입력: tools/collect-speech.js 가 모은 문장 목록
- 출력: audio/<해시>.m4a  +  js/data/audio-manifest.js (문장 → 파일)
- 이미 만든 파일은 건너뛴다(증분). 문장이 바뀌면 해시가 바뀌어 새로 만든다.
- 목소리: 학습자 모범답안·단어·표현은 MAIN_VOICE 하나로 통일하고,
  대화 상대는 챕터+이름마다 PARTNER_VOICES 중 하나로 고정해 장면 속 인물이 구분되게 한다.
"""
import hashlib
import json
import os
import subprocess
import sys
import tempfile
from multiprocessing import Pool

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.expanduser("~/.cache/everyenglish-tts")
AUDIO_DIR = os.path.join(ROOT, "audio")
MANIFEST = os.path.join(ROOT, "js", "data", "audio-manifest.js")

MAIN_VOICE = "af_heart"                    # Kokoro에서 가장 자연스러운 미국 여성 음성
PARTNER_VOICES = ["am_michael", "af_bella", "am_puck", "af_sarah", "am_fenrir"]
SPEED = 1.0                                # 자연 속도. 앱의 속도 슬라이더가 재생 속도로 조절한다
THREADS_PER_WORKER = 2
WORKERS = max(1, (os.cpu_count() or 2) // THREADS_PER_WORKER)
AAC_BITRATE = "40000"                      # 모노 24kHz 음성에 충분, 문장당 ~10KB
VERSION = "kokoro-v1.0"                    # 모델/설정이 바뀌면 올려서 전부 다시 만든다


def voice_for(item):
    if item["role"] != "partner":
        return MAIN_VOICE
    h = int(hashlib.md5(item["speaker"].encode()).hexdigest(), 16)
    return PARTNER_VOICES[h % len(PARTNER_VOICES)]


def file_name(text, voice):
    return hashlib.sha1(f"{VERSION}|{voice}|{SPEED}|{text}".encode()).hexdigest()[:16] + ".m4a"


_kokoro = None


def init_worker():
    global _kokoro
    import onnxruntime as ort
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = THREADS_PER_WORKER   # 워커마다 전체 코어를 잡으면 서로 밀어내 오히려 느려진다
    opts.inter_op_num_threads = 1
    session = ort.InferenceSession(os.path.join(CACHE, "kokoro-v1.0.onnx"), sess_options=opts,
                                   providers=["CPUExecutionProvider"])
    _kokoro = Kokoro.from_session(session, os.path.join(CACHE, "voices-v1.0.bin"))


def render(job):
    text, voice, name = job
    samples, sr = _kokoro.create(text, voice=voice, speed=SPEED, lang="en-us")
    fd, wav = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    sf.write(wav, samples, sr)
    out = os.path.join(AUDIO_DIR, name)
    subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", AAC_BITRATE, "-c", "1", wav, out + ".tmp"],
                   check=True, capture_output=True)
    os.replace(out + ".tmp", out)   # 중간에 끊겨도 반쪽 파일이 남지 않게
    os.remove(wav)


def main():
    items = json.loads(subprocess.check_output(["node", os.path.join(ROOT, "tools", "collect-speech.js")]))
    os.makedirs(AUDIO_DIR, exist_ok=True)
    clips, todo = {}, []
    for it in items:
        voice = voice_for(it)
        name = file_name(it["text"], voice)
        clips[it["text"]] = name
        if not os.path.exists(os.path.join(AUDIO_DIR, name)):
            todo.append((it["text"], voice, name))

    print(f"문장 {len(items)}개 · 새로 만들 것 {len(todo)}개", flush=True)

    with Pool(WORKERS, initializer=init_worker) as pool:
        for i, _ in enumerate(pool.imap_unordered(render, todo, chunksize=4), 1):
            if i % 100 == 0 or i == len(todo):
                print(f"  {i}/{len(todo)}", flush=True)

    # 더 이상 쓰지 않는 파일 정리
    used = set(clips.values())
    removed = 0
    for f in os.listdir(AUDIO_DIR):
        if f.endswith(".m4a") and f not in used:
            os.remove(os.path.join(AUDIO_DIR, f))
            removed += 1

    with open(MANIFEST, "w", encoding="utf-8") as fp:
        fp.write("/* 자동 생성 — tools/build-audio.py. 직접 고치지 말 것 */\n")
        fp.write("window.EE_AUDIO = ")
        json.dump({"base": "audio/", "voice": f"{VERSION} {MAIN_VOICE}", "clips": clips}, fp, ensure_ascii=False, indent=0)
        fp.write(";\n")

    total = sum(os.path.getsize(os.path.join(AUDIO_DIR, f)) for f in used if os.path.exists(os.path.join(AUDIO_DIR, f)))
    print(f"완료: {len(clips)}개 · 삭제 {removed}개 · {total / 1e6:.1f}MB", flush=True)


if __name__ == "__main__":
    sys.exit(main())
