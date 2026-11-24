import SwiftUI

@main
struct EveryEnglishApp: App {
    /// Info.plist EEWebAppURL — 개발 중에는 맥의 로컬 서버 주소로 바꿔 시험할 수 있다
    private let webAppURL: URL = {
        let fallback = URL(string: "https://ottoman75.github.io/EveryEnglish/")
        let configured = (Bundle.main.object(forInfoDictionaryKey: "EEWebAppURL") as? String).flatMap(URL.init(string:))
        guard let url = configured ?? fallback else { preconditionFailure("EEWebAppURL 설정 오류") }
        #if DEBUG && targetEnvironment(simulator)
        // 시뮬레이터 자가 점검: 맥의 로컬 서버(npm start)로 띄운다
        if let dev = ProcessInfo.processInfo.environment["EE_WEB_URL"].flatMap(URL.init(string:)) { return dev }
        #endif
        return url
    }()

    var body: some Scene {
        WindowGroup {
            ContentView(url: webAppURL)
        }
    }
}
