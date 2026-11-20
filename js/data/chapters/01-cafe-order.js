(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "cafe-order",
    order: 1,
    title: "카페에서 주문하기",
    titleEn: "Ordering at a Café",
    emoji: "☕",
    level: "A2",
    gradient: ["#FF9A8B", "#FF6A88"],
    goal: "음료를 주문하고, 옵션을 바꾸고, 계산까지 막힘없이 말한다",

    vocab: [
        { word: "to go", pos: "phr.", meaning: "포장해서", example: "Can I get this to go?", exampleKo: "이거 포장해 주시겠어요?" },
        { word: "for here", pos: "phr.", meaning: "매장에서 먹고 갈", example: "Is that for here or to go?", exampleKo: "드시고 가세요, 가져가세요?" },
        { word: "size", pos: "n.", meaning: "크기, 사이즈", example: "What size would you like?", exampleKo: "어떤 사이즈로 드릴까요?" },
        { word: "oat milk", pos: "n.", meaning: "귀리 우유", example: "Can you make it with oat milk?", exampleKo: "귀리 우유로 만들어 주실 수 있나요?" },
        { word: "decaf", pos: "adj./n.", meaning: "디카페인(의)", example: "Do you have decaf?", exampleKo: "디카페인 있나요?" },
        { word: "shot", pos: "n.", meaning: "(에스프레소) 샷", example: "Can I get an extra shot?", exampleKo: "샷 추가해 주시겠어요?" },
        { word: "receipt", pos: "n.", meaning: "영수증", example: "Do you need a receipt?", exampleKo: "영수증 필요하세요?" },
        { word: "tap", pos: "v.", meaning: "(카드를) 대다", example: "You can tap your card right here.", exampleKo: "여기에 카드 대시면 돼요." },
        { word: "pastry", pos: "n.", meaning: "페이스트리, 빵류", example: "Would you like a pastry with that?", exampleKo: "빵도 같이 드릴까요?" },
        { word: "warm up", pos: "phr. v.", meaning: "데우다", example: "Could you warm it up for me?", exampleKo: "데워 주실 수 있나요?" }
    ],

    expressions: [
        { en: "Can I get ~?", ko: "~ 주시겠어요?", note: "주문할 때 가장 흔하고 자연스러운 표현. 'Give me'는 무례하게 들린다", example: "Can I get a small latte?" },
        { en: "I'd like ~.", ko: "~로 할게요.", note: "조금 더 공손한 주문", example: "I'd like a hot americano." },
        { en: "Can you make it ~?", ko: "~로 만들어 주실 수 있나요?", note: "옵션 변경 요청", example: "Can you make it with oat milk?" },
        { en: "Do you have ~?", ko: "~ 있나요?", note: "메뉴에 있는지 물을 때", example: "Do you have decaf?" },
        { en: "~, please.", ko: "~로 주세요.", note: "질문에 짧게 답할 때", example: "Large, please." },
        { en: "That's it.", ko: "그게 다예요.", note: "'더 필요한 거 있으세요?'에 대한 답", example: "No, that's it. Thanks." }
    ],

    dialogues: [
        {
            id: "s1",
            title: "주문 시작",
            setting: "아침 8시, 출근길에 들른 동네 카페 카운터",
            lines: [
                { speaker: "partner", name: "Barista", en: "Good morning! What can I get for you?", ko: "좋은 아침이에요! 뭘로 드릴까요?" },
                { speaker: "you", ko: "아이스 라테 하나 주시겠어요?", hint: "Can I get ~?",
                    answers: ["Can I get an iced latte?", "Can I get an iced latte, please?", "Could I get an iced latte?", "I'd like an iced latte, please.", "An iced latte, please.", "I'll have an iced latte, please."] },
                { speaker: "partner", name: "Barista", en: "Sure. What size would you like?", ko: "네. 어떤 사이즈로 드릴까요?" },
                { speaker: "you", ko: "라지로 주세요.", hint: "~, please.",
                    answers: ["Large, please.", "A large, please.", "Large.", "I'll get a large.", "I'd like a large, please."] },
                { speaker: "partner", name: "Barista", en: "Got it. Any milk preference?", ko: "알겠습니다. 우유는 어떤 걸로 하시겠어요?" },
                { speaker: "you", ko: "귀리 우유로 만들어 주실 수 있나요?", hint: "Can you make it ~?",
                    answers: ["Can you make it with oat milk?", "Could you make it with oat milk?", "Can you make it with oat milk, please?", "Oat milk, please.", "Can I get oat milk?"] },
                { speaker: "partner", name: "Barista", en: "No problem. Is that for here or to go?", ko: "그럼요. 드시고 가세요, 가져가세요?" },
                { speaker: "you", ko: "포장이요.", hint: "To go",
                    answers: ["To go, please.", "To go.", "It's to go.", "To go, thanks.", "I'll take it to go."] },
                { speaker: "partner", name: "Barista", en: "Great. Can I get a name for the order?", ko: "좋아요. 주문하시는 분 성함이요?" },
                { speaker: "you", ko: "민수예요.", hint: "It's ~.",
                    answers: ["It's Minsu.", "Minsu.", "My name is Minsu.", "It's Minsu, thanks.", "Minsu, please."] }
            ]
        },
        {
            id: "s2",
            title: "추가 주문과 변경",
            setting: "주문을 하다가 디카페인과 빵이 생각났다",
            lines: [
                { speaker: "partner", name: "Barista", en: "Would you like a pastry with that? The croissants just came out.", ko: "빵도 같이 하시겠어요? 크루아상 방금 나왔어요." },
                { speaker: "you", ko: "네, 크루아상 하나 주세요.", hint: "Yes, ~, please.",
                    answers: ["Yes, a croissant, please.", "Yes, one croissant, please.", "Sure, I'll take a croissant.", "Yes, can I get a croissant?", "Sure, a croissant, please.", "A croissant, please.", "One croissant, please."] },
                { speaker: "partner", name: "Barista", en: "Do you want it warmed up?", ko: "데워 드릴까요?" },
                { speaker: "you", ko: "네, 데워 주세요.", hint: "Yes, ~ please.",
                    answers: ["Yes, please.", "Yes, warm it up, please.", "Yes, please warm it up.", "Sure, please.", "Yes, could you warm it up?", "Warm it up, please."] },
                { speaker: "partner", name: "Barista", en: "Okay. Anything else?", ko: "네. 더 필요한 거 있으세요?" },
                { speaker: "you", ko: "혹시 디카페인 있나요?", hint: "Do you have ~?",
                    answers: ["Do you have decaf?", "Do you have decaf coffee?", "Do you guys have decaf?", "Is there decaf?"] },
                { speaker: "partner", name: "Barista", en: "We do. Do you want to switch your latte to decaf?", ko: "있어요. 라테를 디카페인으로 바꿔 드릴까요?" },
                { speaker: "you", ko: "네, 디카페인으로 바꿔 주세요.", hint: "Can you make it ~?",
                    answers: ["Yes, can you make it decaf?", "Yes, please make it decaf.", "Yes, decaf, please.", "Yes, please switch it to decaf.", "Yes, please.", "Decaf, please.", "Make it decaf, please."] },
                { speaker: "partner", name: "Barista", en: "Done. Decaf is a little weak, though. Want an extra shot?", ko: "됐습니다. 근데 디카페인은 좀 연해요. 샷 추가하시겠어요?" },
                { speaker: "you", ko: "네, 샷 추가해 주세요.", hint: "an extra shot",
                    answers: ["Yes, an extra shot, please.", "Sure, add an extra shot, please.", "Yes, can I get an extra shot?", "Yes, please add an extra shot.", "Yes, please.", "An extra shot, please."] },
                { speaker: "partner", name: "Barista", en: "You got it. Is that everything?", ko: "알겠습니다. 이게 전부인가요?" },
                { speaker: "you", ko: "네, 그게 다예요. 감사합니다.", hint: "That's it.",
                    answers: ["Yes, that's it. Thanks.", "That's it, thanks.", "Yeah, that's it. Thank you.", "That's everything, thanks.", "Yes, that's all. Thank you."] }
            ]
        },
        {
            id: "s3",
            title: "계산과 픽업",
            setting: "계산대에서 결제하고 음료를 기다린다",
            lines: [
                { speaker: "partner", name: "Barista", en: "Your total is 9 dollars and 50 cents.", ko: "총 9달러 50센트입니다." },
                { speaker: "you", ko: "카드 돼요?", hint: "Can I pay ~?",
                    answers: ["Can I pay by card?", "Can I pay with a card?", "Do you take cards?", "Is card okay?", "Can I use a card?"] },
                { speaker: "partner", name: "Barista", en: "Of course. You can tap your card right here.", ko: "물론이죠. 여기에 카드 대시면 돼요." },
                { speaker: "you", ko: "여기요.", hint: "Here you go.",
                    answers: ["Here you go.", "Here you are.", "Here.", "There you go."] },
                { speaker: "partner", name: "Barista", en: "Thanks. Do you need a receipt?", ko: "감사합니다. 영수증 필요하세요?" },
                { speaker: "you", ko: "아니요, 괜찮아요.", hint: "No, I'm ~.",
                    answers: ["No, I'm good.", "No, thanks.", "No, I'm okay.", "No, I'm fine. Thanks.", "No, thank you.", "I'm good.", "I'm okay."] },
                { speaker: "partner", name: "Barista", en: "Your order will be ready at the end of the counter.", ko: "주문하신 건 카운터 끝에서 받으시면 돼요." },
                { speaker: "you", ko: "얼마나 걸려요?", hint: "How long ~?",
                    answers: ["How long will it take?", "How long does it take?", "How long will it be?", "How long is the wait?"] },
                { speaker: "partner", name: "Barista", en: "About five minutes. Have a great day!", ko: "5분 정도요. 좋은 하루 보내세요!" },
                { speaker: "you", ko: "감사합니다, 좋은 하루 보내세요!", hint: "You too",
                    answers: ["Thanks, you too!", "Thank you, you too!", "Thanks, have a great day!", "Thank you, have a good day!", "Thanks, you have a great day too!"] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "아이스 아메리카노 하나 주시겠어요?", answers: ["Can I get an iced americano?", "Could I get an iced americano?", "Can I get one iced americano?", "I'd like an iced americano, please.", "I'll have an iced americano, please."] },
        { type: "translate", ko: "드시고 가세요, 가져가세요?", answers: ["For here or to go?", "Is that for here or to go?", "Is it for here or to go?"] },
        { type: "translate", ko: "샷 추가해 주시겠어요?", answers: ["Can I get an extra shot?", "Could I get an extra shot?", "Can you add an extra shot?", "Can I add an extra shot?"] },
        { type: "translate", ko: "영수증 필요 없어요.", answers: ["I don't need a receipt.", "No receipt, thanks.", "No receipt, please.", "I don't need the receipt."] },
        { type: "blank", en: "Can I ___ a small latte?", ko: "작은 라테 하나 주시겠어요?", answers: ["get", "have"] },
        { type: "blank", en: "Is that for here or ___ go?", ko: "드시고 가세요, 가져가세요?", answers: ["to"] },
        { type: "blank", en: "Could you ___ it up for me?", ko: "데워 주실 수 있나요?", answers: ["warm", "heat"] },
        { type: "arrange", ko: "귀리 우유로 만들어 주실 수 있나요?", answers: ["Can you make it with oat milk?"] },
        { type: "arrange", ko: "아니요, 그게 다예요.", answers: ["No, that's it. Thanks."] },
        { type: "arrange", ko: "여기에 카드 대시면 돼요.", answers: ["You can tap your card here."] }
    ]
});
