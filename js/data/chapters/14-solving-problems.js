(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "solving-problems",
    order: 14,
    title: "문제 해결과 불만 제기",
    titleEn: "Sorting Out Problems",
    emoji: "🛠️",
    level: "B1",
    gradient: ["#F093FB", "#F5576C"],
    goal: "잘못 온 배달, 고장 난 숙소, 틀린 계산서를 차분하고 분명하게 해결한다",

    vocab: [
        { word: "mix-up", pos: "n.", meaning: "착오, 혼동", example: "I think there's been a mix-up with my order.", exampleKo: "제 주문에 착오가 있는 것 같아요." },
        { word: "missing", pos: "adj.", meaning: "빠진, 없는", example: "The dumplings are missing.", exampleKo: "만두가 빠졌어요." },
        { word: "refund", pos: "n.", meaning: "환불", example: "Would you like a refund?", exampleKo: "환불해 드릴까요?" },
        { word: "broken", pos: "adj.", meaning: "고장 난, 망가진", example: "The living room lamp is broken.", exampleKo: "거실 램프가 고장 났어요." },
        { word: "leak", pos: "v.", meaning: "(물 등이) 새다", example: "Water is leaking onto the floor.", exampleKo: "바닥으로 물이 새요." },
        { word: "bill", pos: "n.", meaning: "계산서", example: "I think there's a mistake on the bill.", exampleKo: "계산서에 실수가 있는 것 같아요." },
        { word: "charge", pos: "v.", meaning: "(요금을) 청구하다", example: "I think I was charged twice.", exampleKo: "두 번 청구된 것 같아요." },
        { word: "overcharge", pos: "v.", meaning: "(요금을) 더 많이 청구하다", example: "I'm sorry you were overcharged.", exampleKo: "더 청구돼서 죄송합니다." },
        { word: "look into", pos: "phr. v.", meaning: "알아보다, 확인하다", example: "Could you look into it?", exampleKo: "확인해 주시겠어요?" },
        { word: "appreciate", pos: "v.", meaning: "고맙게 여기다", example: "I really appreciate it.", exampleKo: "정말 감사해요." }
    ],

    expressions: [
        { en: "I think there's been a mix-up.", ko: "착오가 있는 것 같아요.", note: "상대를 탓하지 않고 문제를 꺼내는 표현. 'You made a mistake'보다 훨씬 부드럽다", example: "I think there's been a mix-up with my order." },
        { en: "I ordered ~, but I got ~.", ko: "~를 시켰는데 ~가 왔어요.", note: "무엇이 어떻게 틀렸는지 한 문장으로 정리", example: "I ordered chicken noodles, but I got beef." },
        { en: "~ isn't working.", ko: "~가 작동을 안 해요.", note: "고장 신고의 기본형. 'is broken'은 물리적으로 망가졌을 때", example: "The Wi-Fi isn't working." },
        { en: "I think I was charged ~.", ko: "~가 청구된 것 같아요.", note: "'I think'로 시작하면 단정하지 않아 공손하다", example: "I think I was charged twice for the steak." },
        { en: "Could you look into it?", ko: "확인해 주시겠어요?", note: "원인을 알아봐 달라고 요청할 때", example: "Could you look into it for me?" },
        { en: "I really appreciate it.", ko: "정말 감사해요.", note: "문제를 해결해 준 상대에게. 'Thank you'보다 진심이 실린다", example: "Thanks for fixing it so fast. I really appreciate it." }
    ],

    dialogues: [
        {
            id: "s1",
            title: "잘못 온 배달",
            setting: "저녁 7시, 배달 음식이 잘못 와서 식당에 전화한다",
            lines: [
                { speaker: "partner", name: "Restaurant", en: "Hi, this is Golden Dragon. How can I help you?", ko: "안녕하세요, 골든 드래곤입니다. 무엇을 도와드릴까요?" },
                { speaker: "you", ko: "안녕하세요, 제 주문에 착오가 있는 것 같아요.", hint: "there's been a mix-up",
                    answers: ["Hi, I think there's been a mix-up with my order.", "Hi, I think there was a mix-up with my order.", "I think there's been a mix-up with my order.", "Hi, I think there's a mistake with my order.", "Hi, I think there's a problem with my order.", "Hi, there's a problem with my order.", "Hi, I think my order is wrong.", "Hi, I think you sent the wrong order."] },
                { speaker: "partner", name: "Restaurant", en: "I'm sorry to hear that. What's the problem?", ko: "죄송합니다. 어떤 문제가 있으세요?" },
                { speaker: "you", ko: "치킨 누들을 시켰는데 소고기 누들이 왔어요.", hint: "I ordered ~, but ~",
                    answers: ["I ordered chicken noodles, but I got beef noodles.", "I ordered chicken noodles, but I got beef.", "I ordered the chicken noodles, but I got beef.", "I ordered the chicken noodles, but I got the beef ones.", "I ordered chicken noodles, but you sent beef.", "I ordered chicken noodles, but they sent beef.", "I ordered chicken, but I got beef."] },
                { speaker: "partner", name: "Restaurant", en: "Oh, I apologize. Is anything else wrong?", ko: "아, 죄송합니다. 다른 문제도 있으세요?" },
                { speaker: "you", ko: "네, 만두도 빠졌어요.", hint: "~ are missing",
                    answers: ["Yes, the dumplings are missing too.", "Yes, the dumplings are also missing.", "Yeah, the dumplings are missing too.", "Yes, and the dumplings are missing.", "Yes, the dumplings are missing.", "Yes, my dumplings are missing too.", "Yes, I didn't get the dumplings.", "Yeah, I didn't get my dumplings either."] },
                { speaker: "partner", name: "Restaurant", en: "I'm so sorry about that. Would you like a refund or a new order?", ko: "정말 죄송합니다. 환불해 드릴까요, 새로 보내 드릴까요?" },
                { speaker: "you", ko: "새로 보내 주시면 좋겠어요.", hint: "I'd prefer ~",
                    answers: ["I'd prefer a new order, please.", "I'd prefer a new order.", "I'd like a new order, please.", "I'd rather have a new order.", "A new order, please.", "A new order would be great.", "Could you send a new order?", "Can you send me a new order?", "Please send a new order."] },
                { speaker: "partner", name: "Restaurant", en: "Of course. We'll send the right order with the dumplings. It'll take about 30 minutes.", ko: "물론이죠. 제대로 된 주문에 만두까지 보내 드릴게요. 30분 정도 걸립니다." },
                { speaker: "you", ko: "알겠습니다. 빨리 처리해 주셔서 감사해요.", hint: "I appreciate ~",
                    answers: ["Okay. I appreciate you fixing this so quickly.", "Okay. I appreciate the quick response.", "Okay. I appreciate your help.", "Okay, I appreciate it.", "Okay. Thanks for taking care of it so quickly.", "Okay, thanks for your help.", "Got it. Thanks for the quick help.", "Okay. Thanks for handling it so fast."] }
            ]
        },
        {
            id: "s2",
            title: "숙소의 고장",
            setting: "에어비앤비 숙소 둘째 날 아침, 샤워기가 고장 나서 호스트에게 전화한다",
            lines: [
                { speaker: "partner", name: "Host", en: "Hi Minsu! Is everything okay with the apartment?", ko: "안녕하세요, 민수 씨! 숙소는 괜찮으세요?" },
                { speaker: "you", ko: "사실, 샤워기가 작동을 안 해요.", hint: "~ isn't working",
                    answers: ["Actually, the shower isn't working.", "Actually, the shower's not working.", "Actually, the shower doesn't work.", "Actually, the shower isn't working right.", "Actually, the shower is broken.", "Actually, there's a problem with the shower.", "The shower isn't working."] },
                { speaker: "partner", name: "Host", en: "Oh no. What's happening exactly?", ko: "어머. 정확히 어떤 상황이에요?" },
                { speaker: "you", ko: "뜨거운 물이 안 나오고, 바닥으로 물이 새요.", hint: "There's no ~",
                    answers: ["There's no hot water, and it's leaking on the floor.", "There's no hot water, and water is leaking onto the floor.", "There's no hot water, and water's leaking on the floor.", "There's no hot water, and it's leaking.", "There isn't any hot water, and it's leaking.", "No hot water, and it's leaking on the floor.", "The hot water doesn't work, and it's leaking."] },
                { speaker: "partner", name: "Host", en: "I'm so sorry. Is anything else broken?", ko: "정말 죄송해요. 다른 데 고장 난 건 없어요?" },
                { speaker: "you", ko: "거실 램프도 고장 났어요.", hint: "~ is broken too",
                    answers: ["The living room lamp is broken too.", "Also, the living room lamp is broken.", "And the living room lamp is broken too.", "The lamp in the living room is broken too.", "Also, the lamp in the living room is broken.", "And the lamp in the living room is broken.", "Also, the living room lamp doesn't work."] },
                { speaker: "partner", name: "Host", en: "I see. I'll call a plumber right away.", ko: "알겠어요. 바로 배관공을 부를게요." },
                { speaker: "you", ko: "오늘 오후 3시 전에 와 주실 수 있을까요?", hint: "Could someone ~?",
                    answers: ["Could someone come before 3 this afternoon?", "Could someone come before 3 today?", "Could someone come before 3 PM today?", "Could someone come by before 3 today?", "Can someone come before 3 this afternoon?", "Could they come before 3 o'clock today?", "Can the plumber come before 3 today?", "Could the plumber come before 3 this afternoon?"] },
                { speaker: "partner", name: "Host", en: "I'll ask. If not, would you like to move to my other place nearby?", ko: "물어볼게요. 안 되면 근처에 있는 제 다른 숙소로 옮기시겠어요?" },
                { speaker: "you", ko: "고치는 데 오래 걸리면 옮길게요.", hint: "If it takes ~",
                    answers: ["If it takes too long to fix, I'll move.", "If it takes too long, I'll move.", "If it takes a long time to fix, I'll move.", "If the repair takes too long, I'll move.", "If it takes too long to fix, I'll do that.", "If it takes a long time to fix, I'll do that.", "If it takes too long, I'll take that option."] },
                { speaker: "partner", name: "Host", en: "Okay. Sorry again for the trouble. I'll give you a partial refund for today.", ko: "알겠어요. 불편 드려서 다시 한번 죄송해요. 오늘 숙박비는 일부 환불해 드릴게요." },
                { speaker: "you", ko: "감사해요. 신경 써 주셔서 정말 고마워요.", hint: "I really appreciate ~",
                    answers: ["Thank you. I really appreciate it.", "Thanks, I really appreciate that.", "Thank you. I really appreciate your help.", "Thanks so much. I really appreciate it.", "Thank you so much. I appreciate it.", "That's very kind. I really appreciate it.", "Thanks. I really appreciate you taking care of this."] }
            ]
        },
        {
            id: "s3",
            title: "계산서 오류",
            setting: "레스토랑에서 식사를 마치고 계산서를 보니 금액이 이상하다",
            lines: [
                { speaker: "partner", name: "Server", en: "Here's your bill. Take your time.", ko: "계산서 여기 있습니다. 천천히 보세요." },
                { speaker: "you", ko: "실례지만, 계산서가 잘못된 것 같아요.", hint: "I think there's ~",
                    answers: ["Excuse me, I think there's a mistake on the bill.", "Excuse me, I think there's a mistake on my bill.", "Excuse me, I think there's an error on the bill.", "Excuse me, there's a mistake on the bill.", "Excuse me, I think the bill is wrong.", "Excuse me, I think there's something wrong with the bill.", "Excuse me, I think something's wrong with the bill.", "Excuse me, I think I was overcharged."] },
                { speaker: "partner", name: "Server", en: "Oh, let me see. What seems to be the problem?", ko: "아, 한번 볼게요. 어떤 게 문제인가요?" },
                { speaker: "you", ko: "스테이크가 두 번 청구된 것 같아요.", hint: "I was charged ~",
                    answers: ["I think I was charged twice for the steak.", "I think I got charged twice for the steak.", "I think you charged me twice for the steak.", "I think the steak was charged twice.", "I think the steak is on the bill twice.", "I was charged twice for the steak.", "The steak is on here twice."] },
                { speaker: "partner", name: "Server", en: "You're right. I'm sorry about that. Let me fix it.", ko: "맞네요. 죄송합니다. 바로 고쳐 드릴게요." },
                { speaker: "you", ko: "그리고 저희 와인은 안 시켰어요.", hint: "We didn't order ~",
                    answers: ["Also, we didn't order the wine.", "Also, we didn't order wine.", "And we didn't order any wine.", "And we didn't order the wine either.", "We didn't order the wine, either.", "Also, we never ordered the wine.", "Also, we didn't order any wine."] },
                { speaker: "partner", name: "Server", en: "Hmm, the wine might be from another table. Let me check with my manager.", ko: "음, 와인은 다른 테이블 것일 수도 있겠네요. 매니저에게 확인해 볼게요." },
                { speaker: "you", ko: "네, 확인해 주시겠어요? 기다릴게요.", hint: "Could you look into ~?",
                    answers: ["Sure, could you look into it? I'll wait.", "Okay, could you look into it? I can wait.", "Sure. Can you look into it? I'll wait.", "Sure, please look into it. I'll wait.", "Sure, I'll wait. Could you look into it?", "Okay, could you check? I'll wait.", "Sure, can you check? I don't mind waiting.", "Okay, please check. I'll wait here."] },
                { speaker: "partner", name: "Server", en: "Sorry you were overcharged. I took off the steak and the wine. And dessert is on us.", ko: "더 청구돼서 죄송합니다. 스테이크랑 와인은 뺐어요. 그리고 디저트는 서비스입니다." },
                { speaker: "you", ko: "와, 정말 친절하시네요. 감사합니다.", hint: "That's very ~",
                    answers: ["Wow, that's very kind of you. Thank you.", "Wow, that's very kind. Thank you.", "That's very kind of you. Thank you so much.", "Thank you, that's very kind of you.", "Wow, that's really nice of you. Thanks.", "That's very nice of you. Thank you.", "Oh, that's so kind. Thanks.", "Wow, thank you so much."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "주문에 착오가 있는 것 같아요.", answers: ["I think there's been a mix-up with my order.", "I think there was a mix-up with my order.", "I think there's a mix-up with my order.", "I think there's a mistake with my order.", "I think there's a problem with my order.", "I think my order is wrong."] },
        { type: "translate", ko: "에어컨이 작동을 안 해요.", answers: ["The air conditioner isn't working.", "The air conditioning isn't working.", "The AC isn't working.", "The A/C isn't working.", "The AC's not working.", "The air conditioner doesn't work.", "The AC doesn't work."] },
        { type: "translate", ko: "커피가 두 번 청구된 것 같아요.", answers: ["I think I was charged twice for the coffee.", "I think I got charged twice for the coffee.", "I think you charged me twice for the coffee.", "I think the coffee was charged twice.", "I think the coffee is on the bill twice."] },
        { type: "translate", ko: "환불받을 수 있을까요?", answers: ["Can I get a refund?", "Could I get a refund?", "Can I have a refund?", "Could I have a refund?", "May I get a refund?", "Is it possible to get a refund?", "Can I get my money back?"] },
        { type: "blank", en: "My fries are ___.", ko: "감자튀김이 빠졌어요.", answers: ["missing"] },
        { type: "blank", en: "The sink is ___.", ko: "세면대에서 물이 새요.", answers: ["leaking"] },
        { type: "blank", en: "Could you ___ into it for me?", ko: "확인해 주시겠어요?", answers: ["look"] },
        { type: "arrange", ko: "와이파이가 안 돼요.", answers: ["The Wi-Fi isn't working.", "The Wi-Fi doesn't work."] },
        { type: "arrange", ko: "저희 와인은 안 시켰어요.", answers: ["We didn't order the wine.", "We didn't order any wine."] },
        { type: "arrange", ko: "새 걸로 보내 주실 수 있나요?", answers: ["Can you send me a new one?", "Could you send me a new one?"] }
    ]
});
