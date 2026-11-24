import Foundation

/// 웹(js/core/native-speech.js) → 앱 메시지. `webkit.messageHandlers.eeSpeech.postMessage({...})`
enum SpeechBridgeMessage: Equatable {
    case start(id: String, hints: [String])
    case stop(id: String)

    /// 힌트는 SFSpeechRecognizer contextualStrings 권장 한도 안에서만 쓴다
    static let maxHints = 50

    init?(body: Any) {
        guard let dict = body as? [String: Any],
              let cmd = dict["cmd"] as? String,
              let id = dict["id"] as? String, !id.isEmpty else { return nil }
        switch cmd {
        case "start":
            let raw = dict["hints"] as? [Any] ?? []
            let hints = raw.compactMap { $0 as? String }
                .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
                .filter { !$0.isEmpty }
            self = .start(id: id, hints: Array(hints.prefix(Self.maxHints)))
        case "stop":
            self = .stop(id: id)
        default:
            return nil
        }
    }
}

/// 앱 → 웹 이벤트. `window.EENativeSpeech._event(id, type, text)`
enum SpeechBridgeEvent: Equatable {
    case partial(id: String, text: String)
    case final(id: String, text: String)
    case error(id: String, code: String)

    /// 웹에 보낼 JavaScript. 문자열은 JSON으로 인코딩해 따옴표·줄바꿈이 깨지지 않게 한다
    var javaScript: String {
        let (id, type, text): (String, String, String) = {
            switch self {
            case let .partial(id, text): return (id, "partial", text)
            case let .final(id, text): return (id, "final", text)
            case let .error(id, code): return (id, "error", code)
            }
        }()
        return "window.EENativeSpeech && window.EENativeSpeech._event(\(Self.jsString(id)), \(Self.jsString(type)), \(Self.jsString(text)));"
    }

    static func jsString(_ s: String) -> String {
        guard let data = try? JSONSerialization.data(withJSONObject: [s]),
              let json = String(data: data, encoding: .utf8) else { return "\"\"" }
        return String(json.dropFirst().dropLast())   // ["..."] → "..."
    }
}

/// 말이 끝났는지 판단하는 규칙 — 순수 로직(테스트 대상)
struct SpeechEndpointPolicy {
    /// 마지막으로 글자가 바뀐 뒤 이만큼 조용하면 끝 (웹 버전과 같은 1.2초)
    var silenceAfterSpeech: TimeInterval = 1.2
    /// 아무 말도 없을 때 기다리는 최대 시간
    var noSpeechTimeout: TimeInterval = 7
    /// 한 번에 최대 길이
    var maxDuration: TimeInterval = 12

    func shouldFinish(startedAt: Date, lastChangeAt: Date?, now: Date) -> Bool {
        if now.timeIntervalSince(startedAt) >= maxDuration { return true }
        guard let last = lastChangeAt else { return now.timeIntervalSince(startedAt) >= noSpeechTimeout }
        return now.timeIntervalSince(last) >= silenceAfterSpeech
    }
}
