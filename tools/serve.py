#!/usr/bin/env python3
"""개발용 정적 서버. `python3 -m http.server`는 대기열이 5개라, 스크립트 30여 개를 한꺼번에 요청하면
일부 연결이 거절돼 앱이 반쯤 로딩된 채 멈춘다(챕터 일부·앱 본체 누락). 대기열을 넉넉히 둔다.
사용: python3 tools/serve.py [port]   (기본 5173)
"""
import http.server
import os
import sys


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 256
    daemon_threads = True


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".vrm": "model/gltf-binary", ".m4a": "audio/mp4", ".webmanifest": "application/manifest+json"}

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    print(f"EveryEnglish → http://localhost:{port}")
    Server(("", port), Handler).serve_forever()
