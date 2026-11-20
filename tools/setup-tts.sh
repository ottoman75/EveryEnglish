#!/bin/sh
# 원어민 음성 생성 도구 설치 (최초 1회). 프로젝트 밖(~/.cache)에 설치한다.
# Kokoro-82M: Apache-2.0 라이선스 — 생성한 오디오를 앱에 포함해 배포해도 된다.
set -e
DIR="$HOME/.cache/everyenglish-tts"
mkdir -p "$DIR" && cd "$DIR"
[ -d venv ] || python3 -m venv venv
./venv/bin/pip install -q --upgrade pip kokoro-onnx soundfile
REL=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -f kokoro-v1.0.onnx ] || curl -sSL -o kokoro-v1.0.onnx "$REL/kokoro-v1.0.onnx"
[ -f voices-v1.0.bin ] || curl -sSL -o voices-v1.0.bin "$REL/voices-v1.0.bin"
echo "준비 완료 → $DIR/venv/bin/python tools/build-audio.py"
