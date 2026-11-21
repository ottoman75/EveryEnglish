/*
 * 립싱크 분석 — 3D 아바타(src/avatar/engine.js)와 2D 초상화(js/app/portrait.js)가 함께 쓴다.
 * 같은 로직을 두 벌 두면 두 방식의 입 모양이 서로 다르게 움직인다.
 *
 * 재생 중인 소리를 Web Audio로 돌리지 않는다(iPhone은 AudioContext가 잠기면 그 소리를 삼킨다).
 * 같은 녹음 파일을 따로 받아 1/60초마다 RMS 음량과 영점교차율(ZCR)을 미리 계산하고,
 * 재생 시각(audio.currentTime)에 맞춰 읽는다.
 */
(function (root) {
    "use strict";

    var FPS = 60;
    // ZCR 경계 — Kokoro 녹음 유성음 실측(2026-11-21): p25 0.027 · p50 0.041 · p75 0.06 · p90 0.105
    // 상위 ~25%는 이/에, 하위 ~25%는 우/오, 나머지는 아
    var EE_ZCR = [0.055, 0.095];
    var OU_ZCR = [0.022, 0.034];
    var OPEN_LEVEL = [0.18, 0.75];   // 문장 내 상대 음량 → 입 벌림
    var MAX_OPEN = 0.9;              // 입이 과장돼 보이지 않는 상한

    var cache = {};

    function smoothstep(a, b, x) {
        var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
        return t * t * (3 - 2 * t);
    }

    function decode(buf) {
        var Offline = root.OfflineAudioContext || root.webkitOfflineAudioContext;
        return new Promise(function (resolve, reject) {
            var ctx = new Offline(1, 2, 24000);
            var p = ctx.decodeAudioData(buf, resolve, reject);   // 구형 Safari는 콜백 방식만
            if (p && p.then) p.then(resolve, reject);
        });
    }

    /** @returns {Promise<{ level: Float32Array, zcr: Float32Array }>} */
    function analyzeClip(src) {
        if (!cache[src]) {
            cache[src] = fetch(src).then(function (r) { return r.arrayBuffer(); }).then(decode).then(function (audio) {
                var x = audio.getChannelData(0), sr = audio.sampleRate;
                var hop = Math.floor(sr / FPS), win = hop * 2;
                var n = Math.max(1, Math.floor(x.length / hop));
                var rms = new Float32Array(n), zcr = new Float32Array(n);
                for (var f = 0; f < n; f++) {
                    var sq = 0, zc = 0, s0 = f * hop, s1 = Math.min(x.length, s0 + win);
                    for (var i = s0; i < s1; i++) {
                        sq += x[i] * x[i];
                        if (i > s0 && (x[i] >= 0) !== (x[i - 1] >= 0)) zc++;
                    }
                    rms[f] = Math.sqrt(sq / Math.max(1, s1 - s0));
                    zcr[f] = zc / Math.max(1, s1 - s0);
                }
                // 문장 안에서 상대값(95번째 백분위 = 1) — 녹음마다 음량이 달라도 같은 폭으로
                var sorted = Array.prototype.slice.call(rms).sort(function (a, b) { return a - b; });
                var peak = sorted[Math.floor(sorted.length * 0.95)] || 1e-4;
                var level = new Float32Array(n);
                for (var k = 0; k < n; k++) level[k] = Math.min(1.2, rms[k] / peak);
                return { level: level, zcr: zcr };
            });
            cache[src].catch(function () { delete cache[src]; });
        }
        return cache[src];
    }

    /**
     * 재생 시각 t(초)의 입 모양 목표값.
     * @returns {{ open, aa, ih, ou, ee, oh }} 합은 open*MAX_OPEN 이하
     */
    function shapeAt(track, t) {
        var i = Math.min(track.level.length - 1, Math.max(0, Math.floor(t * FPS)));
        var open = smoothstep(OPEN_LEVEL[0], OPEN_LEVEL[1], track.level[i]);
        var zcr = track.zcr[i];
        var ee = open * smoothstep(EE_ZCR[0], EE_ZCR[1], zcr);
        var ou = open * (1 - smoothstep(OU_ZCR[0], OU_ZCR[1], zcr)) * 0.9;
        var s = { open: open, aa: Math.max(0, open - Math.max(ee, ou) * 0.8), ee: ee, ih: ee * 0.35, ou: ou, oh: ou * 0.5 };
        var sum = s.aa + s.ee + s.ih + s.ou + s.oh, cap = open * MAX_OPEN;
        if (sum > cap && sum > 0) ["aa", "ee", "ih", "ou", "oh"].forEach(function (k) { s[k] *= cap / sum; });
        return s;
    }

    /** 녹음이 없을 때(기기 음성) 리듬만 흉내 */
    function syntheticAt(t) {
        var o = Math.max(0, 0.35 + 0.35 * Math.sin(t * 17) * Math.sin(t * 5.3));
        return { open: o, aa: o, ih: 0, ou: 0, ee: 0, oh: o * 0.3 };
    }

    root.EELipSync = { FPS: FPS, analyzeClip: analyzeClip, shapeAt: shapeAt, syntheticAt: syntheticAt, smoothstep: smoothstep };
})(typeof self !== "undefined" ? self : this);
