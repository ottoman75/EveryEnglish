import AVFoundation
import Speech

/// 애플 음성 인식으로 한 문장 듣기. 한 번에 하나의 세션만 돈다.
/// 웹의 webkitSpeechRecognition과 달리 매번 새 세션이 정상 동작한다(웹은 iOS에서 페이지당 첫 번째만).
@MainActor
final class SpeechRecognizer {
    typealias EventHandler = (SpeechBridgeEvent) -> Void

    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private let engine = AVAudioEngine()
    private let policy = SpeechEndpointPolicy()
    private let tickInterval: TimeInterval = 0.2

    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?
    private var timer: Timer?
    private var sessionID: String?
    private var startedAt = Date()
    private var lastChangeAt: Date?
    private var latestText = ""
    private var onEvent: EventHandler?

    func start(id: String, hints: [String], onEvent: @escaping EventHandler) {
        finishCurrent(sendFinal: true)
        self.onEvent = onEvent
        Task {
            guard await Self.requestPermissions() else {
                onEvent(.error(id: id, code: "not-allowed"))
                return
            }
            do {
                try begin(id: id, hints: hints)
            } catch {
                #if DEBUG
                print("❌ [SpeechRecognizer] 시작 실패: \(error)")
                #endif
                cleanUp()
                onEvent(.error(id: id, code: "audio-capture"))
            }
        }
    }

    func stop(id: String) {
        guard sessionID == id else { return }
        finishCurrent(sendFinal: true)
    }

    // MARK: - 세션

    private func begin(id: String, hints: [String]) throws {
        guard let recognizer, recognizer.isAvailable else { throw RecognizerError.unavailable }
        let audio = AVAudioSession.sharedInstance()
        try audio.setCategory(.playAndRecord, mode: .measurement, options: [.defaultToSpeaker, .allowBluetoothA2DP])
        try audio.setActive(true, options: .notifyOthersOnDeactivation)

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        request.contextualStrings = hints          // 이 문항의 정답 문장 — 학습자 억양에서 인식률을 올린다
        request.taskHint = .dictation
        request.addsPunctuation = false

        let input = engine.inputNode
        let format = input.outputFormat(forBus: 0)
        input.removeTap(onBus: 0)
        input.installTap(onBus: 0, bufferSize: 1024, format: format) { [weak request] buffer, _ in
            request?.append(buffer)
        }
        engine.prepare()
        try engine.start()

        self.request = request
        sessionID = id
        startedAt = Date()
        lastChangeAt = nil
        latestText = ""
        task = recognizer.recognitionTask(with: request) { [weak self] result, error in
            let text = result?.bestTranscription.formattedString
            let isFinal = result?.isFinal ?? false
            let failed = error != nil
            Task { @MainActor in self?.handle(id: id, text: text, isFinal: isFinal, failed: failed) }
        }
        timer = Timer.scheduledTimer(withTimeInterval: tickInterval, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.tick() }
        }
    }

    private func handle(id: String, text: String?, isFinal: Bool, failed: Bool) {
        guard sessionID == id else { return }
        if let text, text != latestText {
            latestText = text
            lastChangeAt = Date()
            onEvent?(.partial(id: id, text: text))
        }
        if isFinal || failed { finishCurrent(sendFinal: true) }
    }

    private func tick() {
        guard sessionID != nil else { return }
        if policy.shouldFinish(startedAt: startedAt, lastChangeAt: lastChangeAt, now: Date()) {
            finishCurrent(sendFinal: true)
        }
    }

    private func finishCurrent(sendFinal: Bool) {
        guard let id = sessionID else { return }
        let text = latestText
        let handler = onEvent
        cleanUp()
        if sendFinal { handler?(.final(id: id, text: text)) }
    }

    private func cleanUp() {
        timer?.invalidate()
        timer = nil
        if engine.isRunning { engine.stop() }
        engine.inputNode.removeTap(onBus: 0)
        request?.endAudio()
        task?.cancel()
        request = nil
        task = nil
        sessionID = nil
        // 상대 대사가 수화기가 아닌 스피커로 크게 나오도록 재생 모드로 되돌린다
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
    }

    private static func requestPermissions() async -> Bool {
        let speech = await withCheckedContinuation { (cont: CheckedContinuation<Bool, Never>) in
            SFSpeechRecognizer.requestAuthorization { cont.resume(returning: $0 == .authorized) }
        }
        guard speech else { return false }
        return await AVAudioApplication.requestRecordPermission()
    }

    private enum RecognizerError: Error { case unavailable }
}
