/*
 * iOS 앱(ios/) 안에서 실행될 때만 켜지는 음성 인식 연결 — 앱의 애플 음성 인식(SFSpeechRecognizer)을 쓴다.
 * 웹의 webkitSpeechRecognition은 페이지당 첫 번째만 소리를 받고(iOS 버그), 폰 안 Whisper tiny는 인식률이 낮았다.
 *
 * 앱 → 웹: window.EENativeSpeech._event(id, type, text)   type: partial | final | error
 * 웹 → 앱: webkit.messageHandlers.eeSpeech.postMessage({ cmd: "start"|"stop", id, hints })
 */
(function (root) {
    "use strict";
    var bridge = root.webkit && root.webkit.messageHandlers && root.webkit.messageHandlers.eeSpeech;
    if (!bridge) return;

    var sessions = {}, seq = 0;

    function listen(options, onInterim) {
        var id = "s" + (++seq) + "-" + Date.now();
        var hints = (options && options.hints || []).filter(function (h) { return typeof h === "string" && h; }).slice(0, 50);
        var promise = new Promise(function (resolve, reject) {
            sessions[id] = { resolve: resolve, reject: reject, onInterim: onInterim, last: "" };
        });
        // 다른 세션이 남아 있으면 앱이 정리한다(한 번에 하나)
        Object.keys(sessions).forEach(function (k) { if (k !== id) finish(k, sessions[k].last); });
        if (onInterim) onInterim("듣고 있어요…");
        bridge.postMessage({ cmd: "start", id: id, hints: hints });
        return {
            promise: promise,
            stop: function () { if (sessions[id]) bridge.postMessage({ cmd: "stop", id: id }); }
        };
    }

    function finish(id, text) {
        var s = sessions[id];
        if (!s) return;
        delete sessions[id];
        s.resolve(String(text || "").trim());
    }

    function event(id, type, text) {
        var s = sessions[id];
        if (!s) return;
        if (type === "partial") {
            s.last = text;
            if (s.onInterim && text) s.onInterim(text);
        } else if (type === "final") {
            finish(id, text);
        } else if (type === "error") {
            delete sessions[id];
            if (s.last) s.resolve(s.last.trim());
            else s.reject(new Error(text || "audio-capture"));
        }
    }

    root.EENativeSpeech = { listen: listen, _event: event };
})(window);
