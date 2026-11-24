import SwiftUI

struct ContentView: View {
    let url: URL
    @State private var loadFailed = false
    @State private var reloadToken = 0

    var body: some View {
        ZStack {
            WebContainerView(url: url, loadFailed: $loadFailed, reloadToken: reloadToken)
                .ignoresSafeArea()
            if loadFailed {
                VStack(spacing: 16) {
                    Text("인터넷에 연결할 수 없어요")
                        .font(.headline)
                    Text("EveryEnglish는 인터넷 연결이 필요해요.\n연결을 확인한 뒤 다시 시도해 주세요.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                    Button("다시 시도") { reloadToken += 1 }
                        .buttonStyle(.borderedProminent)
                }
                .padding()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(UIColor.systemBackground))
            }
        }
    }
}
