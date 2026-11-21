#!/bin/sh
# 립싱크 수치 점검. npm start(또는 python3 -m http.server 5173) 실행 중이어야 한다.
# 127.0.0.1 출처를 써서 사용자 기록(localhost)과 섞이지 않게 한다.
# 기대값(2026-11-21 보정): meanOpen 0.3~0.5, maxOpen ≤ 0.95, closedShare 0.4~0.6, shapes에 aa·ee·ou 모두 등장
DIR=$(cd "$(dirname "$0")" && pwd)
node "$DIR/cdp-run.mjs" "http://127.0.0.1:${EE_PORT:-5173}/_workspace/avatar-test.html?step=17" "@$DIR/measure-lipsync.js" 150000
