import XCTest
@testable import EveryEnglish

final class SpeechBridgeTests: XCTestCase {
    func testStartMessageParsesHintsAndDropsBlanks() {
        let msg = SpeechBridgeMessage(body: ["cmd": "start", "id": "s1", "hints": ["I'd like a latte.", "  ", 3, "Hi"]])
        XCTAssertEqual(msg, .start(id: "s1", hints: ["I'd like a latte.", "Hi"]))
    }

    func testStartMessageCapsHints() {
        let many = (0..<80).map { "hint \($0)" }
        guard case let .start(_, hints)? = SpeechBridgeMessage(body: ["cmd": "start", "id": "s1", "hints": many]) else {
            return XCTFail("start로 해석돼야 함")
        }
        XCTAssertEqual(hints.count, SpeechBridgeMessage.maxHints)
    }

    func testInvalidMessagesAreIgnored() {
        XCTAssertNil(SpeechBridgeMessage(body: ["cmd": "start"]))
        XCTAssertNil(SpeechBridgeMessage(body: ["cmd": "dance", "id": "x"]))
        XCTAssertNil(SpeechBridgeMessage(body: "start"))
    }

    func testEventJavaScriptEscapesQuotesAndNewlines() {
        let js = SpeechBridgeEvent.final(id: "s1", text: "I'd say \"hi\"\nnow").javaScript
        XCTAssertTrue(js.contains(#""I'd say \"hi\"\nnow""#), js)
        XCTAssertTrue(js.contains(#"_event("s1", "final","#), js)
    }

    func testEndpointWaitsForSilenceAfterSpeech() {
        let p = SpeechEndpointPolicy()
        let start = Date(timeIntervalSince1970: 0)
        let spoke = start.addingTimeInterval(2)
        XCTAssertFalse(p.shouldFinish(startedAt: start, lastChangeAt: spoke, now: spoke.addingTimeInterval(1.0)))
        XCTAssertTrue(p.shouldFinish(startedAt: start, lastChangeAt: spoke, now: spoke.addingTimeInterval(1.2)))
    }

    func testEndpointGivesUpWithoutSpeechAndCapsDuration() {
        let p = SpeechEndpointPolicy()
        let start = Date(timeIntervalSince1970: 0)
        XCTAssertFalse(p.shouldFinish(startedAt: start, lastChangeAt: nil, now: start.addingTimeInterval(6)))
        XCTAssertTrue(p.shouldFinish(startedAt: start, lastChangeAt: nil, now: start.addingTimeInterval(7)))
        XCTAssertTrue(p.shouldFinish(startedAt: start, lastChangeAt: start.addingTimeInterval(11.9), now: start.addingTimeInterval(12)))
    }
}
