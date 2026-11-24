import SwiftUI
import WebKit

/// 배포된 웹앱(GitHub Pages)을 띄우고, 마이크만 앱의 음성 인식으로 연결한다.
/// 웹을 고쳐 배포하면 앱도 바로 바뀐다(앱 재빌드 불필요). 대가: 인터넷이 필요하다.
struct WebContainerView: UIViewRepresentable {
    let url: URL
    @Binding var loadFailed: Bool
    let reloadToken: Int

    func makeCoordinator() -> Coordinator { Coordinator(parent: self) }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []      // 상대 대사 자동 재생(웹에서는 탭이 필요했다)
        config.userContentController.add(context.coordinator, name: Coordinator.handlerName)

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.contentInsetAdjustmentBehavior = .never    // 안전 영역은 웹 CSS(env(safe-area-inset-*))가 처리
        webView.scrollView.bounces = false
        webView.isOpaque = false
        webView.backgroundColor = .systemBackground
        #if DEBUG
        webView.isInspectable = true
        #endif
        context.coordinator.webView = webView
        webView.load(URLRequest(url: url, cachePolicy: .reloadRevalidatingCacheData))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if context.coordinator.lastReloadToken != reloadToken {
            context.coordinator.lastReloadToken = reloadToken
            webView.load(URLRequest(url: url, cachePolicy: .reloadRevalidatingCacheData))
        }
    }

    static func dismantleUIView(_ webView: WKWebView, coordinator: Coordinator) {
        webView.configuration.userContentController.removeScriptMessageHandler(forName: Coordinator.handlerName)
    }

    @MainActor
    final class Coordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate {
        static let handlerName = "eeSpeech"

        private let parent: WebContainerView
        private let recognizer = SpeechRecognizer()
        weak var webView: WKWebView?
        var lastReloadToken = 0

        init(parent: WebContainerView) {
            self.parent = parent
            self.lastReloadToken = parent.reloadToken
        }

        func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
            guard let msg = SpeechBridgeMessage(body: message.body) else { return }
            switch msg {
            case let .start(id, hints):
                recognizer.start(id: id, hints: hints) { [weak self] event in self?.send(event) }
            case let .stop(id):
                recognizer.stop(id: id)
            }
        }

        private func send(_ event: SpeechBridgeEvent) {
            webView?.evaluateJavaScript(event.javaScript)
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.loadFailed = false
            #if DEBUG && targetEnvironment(simulator)
            runSelfTestIfRequested(webView)
            #endif
        }

        #if DEBUG && targetEnvironment(simulator)
        /// EE_SELFTEST=1: 웹 → 앱 → 음성 인식 → 웹 왕복을 한 번 돌려 결과를 콘솔에 찍는다
        private func runSelfTestIfRequested(_ webView: WKWebView) {
            guard ProcessInfo.processInfo.environment["EE_SELFTEST"] == "1", !didSelfTest else { return }
            didSelfTest = true
            let js = """
            await new Promise(r => setTimeout(r, 1500));
            const r = { native: !!window.EENativeSpeech, canListen: !!(window.EESpeech && EESpeech.canListen), interim: [] };
            const s = EESpeech.listen({ hints: ["Can you make it with oat milk?"] }, t => r.interim.push(t));
            try { r.text = await s.promise; } catch (e) { r.error = e.message; }
            return JSON.stringify(r);
            """
            webView.callAsyncJavaScript(js, in: nil, in: .page) { result in
                switch result {
                case let .success(value): print("EE_SELFTEST \(value ?? "nil")")
                case let .failure(error): print("EE_SELFTEST error \(error)")
                }
            }
        }
        private var didSelfTest = false
        #endif

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            parent.loadFailed = true
        }

        /// 외부 링크(GitHub 토큰 발급 등)는 사파리로
        func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let target = action.request.url, action.navigationType == .linkActivated,
                  target.host != parent.url.host else {
                decisionHandler(.allow)
                return
            }
            UIApplication.shared.open(target)
            decisionHandler(.cancel)
        }
    }
}
