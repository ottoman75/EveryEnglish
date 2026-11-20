# 챕터 데이터 스키마 (계약서)

> 이 스키마는 렌더러(`js/app/views-learn.js`, `views-care.js`, `views-home.js`), 채점기(`js/core/grader.js`), 검증기(`tools/validate-chapters.js`)
> 세 곳이 동시에 의존한다. 필드를 바꾸려면 세 곳을 함께 바꾼다.

파일: `js/data/chapters/{NN}-{id}.js` (NN = 두 자리 순번)
형식: 클래식 스크립트. `file://`로 열어도 동작해야 하므로 ES module을 쓰지 않는다.

```js
(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
  id: "cafe-order",            // kebab-case, 전체에서 유일
  order: 1,                    // 1부터, 파일명 NN과 일치
  title: "카페에서 주문하기",
  titleEn: "Ordering at a Café",
  emoji: "☕",
  level: "A2",                 // A1 | A2 | B1 | B2
  gradient: ["#FF9A8B", "#FF6A88"],  // 카드 배경 그라디언트 2색
  goal: "음료를 주문하고 옵션을 바꿔 말할 수 있다",

  vocab: [                     // 정확히 10개
    { word: "to go", pos: "phr.", meaning: "포장해서", example: "Can I get this to go?", exampleKo: "이거 포장해 주시겠어요?" }
  ],

  expressions: [               // 정확히 6개 — 챕터의 핵심 패턴
    { en: "Can I get ~?", ko: "~ 주시겠어요?", note: "주문할 때 가장 자연스러운 표현", example: "Can I get a latte?" }
  ],

  dialogues: [                 // 정확히 3개 장면
    {
      id: "s1",
      title: "주문 시작",
      setting: "아침 8시, 붐비는 동네 카페 카운터",
      lines: [
        { speaker: "partner", name: "Barista", en: "Hi there! What can I get for you?", ko: "안녕하세요! 뭘로 드릴까요?" },
        { speaker: "you", ko: "아이스 라테 하나 주시겠어요?", hint: "Can I get ~?",
          answers: ["Can I get an iced latte?", "Can I get an iced latte, please?", "Could I get an iced latte?"] }
      ]
    }
  ],

  drills: [                    // 정확히 10개
    { type: "translate", ko: "포장해 주세요.", answers: ["To go, please.", "Can I get it to go?"] },
    { type: "blank", en: "Can I ___ a large coffee?", ko: "큰 커피 하나 주시겠어요?", answers: ["get", "have"] },
    { type: "arrange", ko: "설탕 빼 주세요.", answers: ["No sugar, please."] }
  ]
});
```

## 규칙과 그 이유

| 규칙 | 이유 |
|---|---|
| 장면당 `you` 줄 5~7개, 챕터 합계 16~20개 | 15분 세션의 롤플레이 몫이 약 7분. 응답당 20~25초 |
| `you` 줄은 `partner` 줄 바로 뒤에 온다. 첫 줄은 `partner` | 사용자는 항상 상대 말에 "대답"한다. 대답할 대상이 없으면 맥락이 사라진다 |
| `answers`는 최소 2개, 자연스러운 변형을 모두 담는다 (please 유무, Could/Can, 축약형) | 채점기는 answers 중 가장 가까운 것과 비교한다. 정답 변형이 빠지면 맞는 답을 오답노트에 넣게 된다 — 사용자에게 가장 해로운 실패 |
| `answers[0]`이 모범답안 | 오답 화면·쉐도잉에서 보여준다 |
| `ko`는 사용자가 말할 **의도**를 한국어로. 직역 투 금지 | 사용자는 ko를 보고 영어를 만든다 |
| `hint`는 핵심 패턴만 (5단어 이내) | 정답을 통째로 주면 연습이 아니다 |
| `blank`의 `en`에는 `___`가 정확히 1개, `answers`는 빈칸에 들어갈 단어/구만 | 렌더러가 `___`를 입력칸으로 바꾼다 |
| `arrange`의 `answers[0]`은 8단어 이하 | 단어 칩으로 쪼개 섞는다. 길면 모바일에서 칩이 넘친다 |
| drills 구성: translate 4, blank 3, arrange 3 | 유형 다양성 |
| vocab의 word는 챕터 대화 안에 실제로 등장해야 한다 | 단어를 문맥에서 익히게 하기 위해 |
| 영어는 미국식 일상 구어. 문장 끝 구두점 포함 | 채점기가 구두점은 무시하지만 화면 표시는 깔끔해야 한다 |
| 숫자·시간은 영어 단어 대신 숫자 표기도 answers에 함께 (`"7 o'clock"`, `"seven o'clock"`) | 음성인식은 숫자로 받아쓴다 |
