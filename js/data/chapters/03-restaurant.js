(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "restaurant",
    order: 3,
    title: "레스토랑 예약과 식사",
    titleEn: "Dining Out",
    emoji: "🍝",
    level: "A2",
    gradient: ["#F6D365", "#FDA085"],
    goal: "전화로 자리를 예약하고, 추천을 받아 주문하고, 문제가 생겨도 침착하게 계산까지 마친다",

    vocab: [
        { word: "reservation", pos: "n.", meaning: "예약", example: "I'd like to make a reservation.", exampleKo: "예약하고 싶어요." },
        { word: "fully booked", pos: "phr.", meaning: "예약이 꽉 찬", example: "Sorry, we're fully booked at 7.", exampleKo: "죄송하지만 7시는 예약이 다 찼어요." },
        { word: "request", pos: "n.", meaning: "요청 사항", example: "Do you have any special requests?", exampleKo: "따로 요청하실 거 있으세요?" },
        { word: "recommend", pos: "v.", meaning: "추천하다", example: "What do you recommend?", exampleKo: "뭘 추천하세요?" },
        { word: "allergic", pos: "adj.", meaning: "알레르기가 있는", example: "I'm allergic to nuts.", exampleKo: "저 견과류 알레르기 있어요." },
        { word: "share", pos: "v.", meaning: "나눠 먹다", example: "Can we get a salad to share?", exampleKo: "나눠 먹을 샐러드 하나 주시겠어요?" },
        { word: "portion", pos: "n.", meaning: "(음식의) 1인분 양", example: "The portion is pretty big.", exampleKo: "양이 꽤 많네요." },
        { word: "box", pos: "n.", meaning: "(남은 음식) 포장 용기", example: "Can I get a box for this?", exampleKo: "이거 포장 용기 좀 주시겠어요?" },
        { word: "check", pos: "n.", meaning: "계산서", example: "Can we get the check, please?", exampleKo: "계산서 주시겠어요?" },
        { word: "separate", pos: "adj.", meaning: "따로따로의", example: "Separate checks, please.", exampleKo: "따로 계산해 주세요." }
    ],

    expressions: [
        { en: "I'd like to make a reservation.", ko: "예약하고 싶어요.", note: "전화 예약의 첫마디. 'book a table'도 똑같이 쓴다", example: "I'd like to make a reservation for Saturday at 7." },
        { en: "~ works.", ko: "~ 괜찮아요.", note: "제안받은 시간·조건을 받아들일 때. 'That works for me.'", example: "8:30 works for us." },
        { en: "What do you recommend?", ko: "뭘 추천하세요?", note: "메뉴 고르기 어려울 때. 'What's good here?'는 더 캐주얼", example: "Everything looks good. What do you recommend?" },
        { en: "I'll have ~.", ko: "~로 할게요.", note: "주문을 정할 때 가장 흔한 표현", example: "I'll have the seafood pasta." },
        { en: "I'm allergic to ~.", ko: "저 ~ 알레르기 있어요.", note: "알레르기는 주문할 때 꼭 미리 말한다", example: "I'm allergic to shellfish." },
        { en: "Can we get the check?", ko: "계산서 주시겠어요?", note: "미국에선 손을 들거나 이렇게 말해 계산서를 요청한다. 영국식은 'bill'", example: "Excuse me, can we get the check, please?" }
    ],

    dialogues: [
        {
            id: "s1",
            title: "전화로 예약하기",
            setting: "토요일 저녁 식사를 위해 동네 이탈리안 레스토랑에 전화를 건다",
            lines: [
                { speaker: "partner", name: "Host", en: "Thanks for calling Luigi's. How can I help you?", ko: "루이지스입니다. 무엇을 도와드릴까요?" },
                { speaker: "you", ko: "토요일 저녁 7시에 예약하고 싶어요.", hint: "I'd like to ~.",
                    answers: ["I'd like to make a reservation for Saturday at 7.", "I'd like to make a reservation for Saturday at 7 pm.", "I'd like to book a table for Saturday at 7.", "Can I make a reservation for Saturday at 7?", "Can I book a table for Saturday at 7?", "I'd like to reserve a table for Saturday at 7.", "I'd like to make a reservation for 7 on Saturday.", "I'd like a table for Saturday at 7 o'clock."] },
                { speaker: "partner", name: "Host", en: "Sure. For how many people?", ko: "네. 몇 분이세요?" },
                { speaker: "you", ko: "네 명이요.", hint: "~ people",
                    answers: ["Four people.", "For four.", "For four people.", "There will be four of us.", "There are four of us.", "Four, please.", "A table for four, please.", "Party of four."] },
                { speaker: "partner", name: "Host", en: "Let me check... I'm sorry, we're fully booked at 7. We have a table at 8:30.", ko: "확인해 볼게요... 죄송하지만 7시는 예약이 다 찼어요. 8시 반에 자리가 있어요." },
                { speaker: "you", ko: "8시 반 괜찮아요.", hint: "~ works.",
                    answers: ["8:30 works.", "8:30 works for us.", "8:30 is fine.", "8:30 is okay.", "That works.", "That's fine.", "Okay, 8:30 works.", "Half past eight is fine."] },
                { speaker: "partner", name: "Host", en: "Great. Can I have a name for the reservation?", ko: "좋습니다. 예약자 성함 알려 주시겠어요?" },
                { speaker: "you", ko: "김민수로 해 주세요.", hint: "It's under ~.",
                    answers: ["It's under Minsu Kim.", "Minsu Kim.", "It's Minsu Kim.", "My name is Minsu Kim.", "Under Minsu Kim, please.", "Put it under Minsu Kim, please.", "Kim. Minsu Kim."] },
                { speaker: "partner", name: "Host", en: "Got it. Do you have any special requests?", ko: "알겠습니다. 따로 요청하실 거 있으세요?" },
                { speaker: "you", ko: "창가 자리로 받을 수 있을까요?", hint: "Could we get ~?",
                    answers: ["Could we get a table by the window?", "Can we get a table by the window?", "Could we have a table by the window?", "Could we sit by the window?", "Can we sit by the window?", "Could we get a window table?", "Can we get a window seat?", "A table by the window, please."] },
                { speaker: "partner", name: "Host", en: "I'll put a note in. See you on Saturday!", ko: "메모해 둘게요. 토요일에 뵙겠습니다!" },
                { speaker: "you", ko: "감사합니다. 그때 봬요!", hint: "See you ~.",
                    answers: ["Thank you. See you then!", "Thanks, see you then!", "Thanks! See you Saturday!", "Thank you, see you on Saturday!", "Great, thanks. See you then!", "Thanks a lot. See you then!"] }
            ]
        },
        {
            id: "s2",
            title: "추천받아 주문하기",
            setting: "토요일 밤, 창가 자리에 앉아 메뉴판을 펼쳤다",
            lines: [
                { speaker: "partner", name: "Server", en: "Hi, I'm Daniel. I'll be your server tonight. Can I start you off with something to drink?", ko: "안녕하세요, 오늘 담당 서버 대니얼입니다. 음료부터 드릴까요?" },
                { speaker: "you", ko: "일단 물만 주세요.", hint: "~ for now.",
                    answers: ["Just water for now, please.", "Just water for now.", "Water for now, please.", "We'll just have water for now.", "Can we just get water for now?", "Just water, please.", "Water is fine for now."] },
                { speaker: "partner", name: "Server", en: "Sure. Are you ready to order, or do you need a few minutes?", ko: "네. 주문하시겠어요, 아니면 좀 더 보시겠어요?" },
                { speaker: "you", ko: "뭐 추천해 주실 만한 거 있어요?", hint: "What do you ~?",
                    answers: ["What do you recommend?", "What would you recommend?", "Do you have any recommendations?", "Any recommendations?", "What's good here?", "What's popular here?", "What do you suggest?"] },
                { speaker: "partner", name: "Server", en: "Our seafood pasta is really popular. It's a little spicy, though.", ko: "해산물 파스타가 정말 인기 많아요. 근데 살짝 매워요." },
                { speaker: "you", ko: "좋네요. 그걸로 할게요.", hint: "I'll have ~.",
                    answers: ["Sounds good. I'll have that.", "Sounds good. I'll have the seafood pasta.", "Great, I'll have that.", "Sounds great. I'll take that.", "Sounds good. I'll get that.", "Perfect, I'll go with that.", "Okay, I'll have that.", "That sounds good. I'll have it."] },
                { speaker: "partner", name: "Server", en: "Good choice. Any allergies I should know about?", ko: "탁월한 선택이세요. 혹시 알레르기 있으세요?" },
                { speaker: "you", ko: "저 견과류 알레르기 있어요.", hint: "I'm allergic to ~.",
                    answers: ["I'm allergic to nuts.", "Yes, I'm allergic to nuts.", "Yeah, I'm allergic to nuts.", "I have a nut allergy.", "Yes, I have a nut allergy.", "Nuts. I'm allergic to nuts."] },
                { speaker: "partner", name: "Server", en: "No problem. There are no nuts in the pasta. Anything else?", ko: "괜찮아요. 파스타엔 견과류가 안 들어가요. 더 필요하신 건요?" },
                { speaker: "you", ko: "나눠 먹게 시저 샐러드도 하나 주세요.", hint: "~ to share",
                    answers: ["Can we also get a Caesar salad to share?", "Could we also get a Caesar salad to share?", "Can we get a Caesar salad to share?", "We'll also have a Caesar salad to share.", "And a Caesar salad to share, please.", "A Caesar salad to share, please.", "We'd also like a Caesar salad to share."] }
            ]
        },
        {
            id: "s3",
            title: "문제 해결과 계산",
            setting: "음식이 나왔는데 시키지 않은 샐러드가 섞여 있다",
            lines: [
                { speaker: "partner", name: "Server", en: "Here's your seafood pasta and... a Greek salad.", ko: "해산물 파스타랑... 그릭 샐러드 나왔습니다." },
                { speaker: "you", ko: "죄송한데, 저희 시저 샐러드 시켰어요.", hint: "I think we ordered ~.",
                    answers: ["Sorry, but we ordered a Caesar salad.", "Sorry, we ordered a Caesar salad.", "Excuse me, we ordered a Caesar salad.", "Sorry, I think we ordered a Caesar salad.", "Excuse me, I think we ordered a Caesar salad.", "Sorry, we ordered the Caesar salad.", "Sorry, this isn't what we ordered. We ordered a Caesar salad."] },
                { speaker: "partner", name: "Server", en: "Oh, I'm so sorry! I'll bring the right one right away.", ko: "아, 정말 죄송합니다! 바로 맞는 걸로 가져다 드릴게요." },
                { speaker: "you", ko: "괜찮아요. 천천히 하세요.", hint: "No rush.",
                    answers: ["That's okay. No rush.", "It's okay. No rush.", "No problem. No rush.", "No worries. No rush.", "That's fine. Take your time.", "No worries. Take your time.", "It's all right. No rush."] },
                { speaker: "partner", name: "Server", en: "How is everything tasting?", ko: "음식은 입에 맞으세요?" },
                { speaker: "you", ko: "정말 맛있어요. 근데 양이 많네요.", hint: "It's delicious, but ~.",
                    answers: ["It's delicious. But it's a lot of food.", "It's really good, but the portion is big.", "It's delicious, but it's a lot of food.", "It's really good. But the portions are big.", "It's great, but the portions are huge.", "Really good! The portion is pretty big, though.", "It's delicious, but it's a lot."] },
                { speaker: "partner", name: "Server", en: "Would you like a box for the rest?", ko: "남은 건 포장해 드릴까요?" },
                { speaker: "you", ko: "네, 포장해 주세요.", hint: "Yes, a box ~.",
                    answers: ["Yes, a box would be great.", "Yes, please.", "Yes, can I get a box?", "Yes, could I get a box?", "Yes, could I get a to-go box?", "That would be great, thanks.", "Yes, please. Thank you."] },
                { speaker: "partner", name: "Server", en: "Sure thing. Can I get you anything else? Maybe some dessert?", ko: "그럼요. 더 필요한 거 있으세요? 디저트는요?" },
                { speaker: "you", ko: "아니요, 괜찮아요. 계산서 주세요.", hint: "Can we get ~?",
                    answers: ["No, thanks. Can we get the check, please?", "No, thanks. Can we get the check?", "No, we're good. Can we get the check?", "No, thank you. Could we have the check, please?", "We're good, thanks. Just the check, please.", "No, thanks. The check, please.", "No, thanks. Could we get the bill?", "No, thank you. Can I get the check?"] },
                { speaker: "partner", name: "Server", en: "Here you go. Will that be one check or separate?", ko: "여기 있습니다. 한 번에 계산하세요, 따로 하세요?" },
                { speaker: "you", ko: "따로 계산할게요.", hint: "Separate, ~.",
                    answers: ["Separate, please.", "Separate checks, please.", "Separate checks.", "We'll pay separately.", "Separately, please.", "Can we pay separately?", "Can we split the check?", "Could we split the bill?"] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "두 명 자리 예약하고 싶어요.", answers: ["I'd like to make a reservation for two.", "I'd like to book a table for two.", "I'd like to reserve a table for two.", "I'd like a reservation for two.", "Can I make a reservation for two?", "Can I book a table for two?", "I'd like a table for two."] },
        { type: "translate", ko: "여기 뭐가 맛있어요?", answers: ["What's good here?", "What do you recommend?", "What would you recommend?", "What's popular here?", "What's the best thing here?", "What's good on the menu?"] },
        { type: "translate", ko: "저 갑각류 알레르기 있어요.", answers: ["I'm allergic to shellfish.", "I have a shellfish allergy.", "I'm allergic to seafood like shrimp and crab."] },
        { type: "translate", ko: "계산서 주시겠어요?", answers: ["Can we get the check?", "Can we get the check, please?", "Could we get the check?", "Could we have the check, please?", "Can I get the check?", "Could I get the check, please?", "Check, please.", "Can I get the bill?", "Could we have the bill?"] },
        { type: "blank", en: "I'd like to make a ___ for Saturday.", ko: "토요일로 예약하고 싶어요.", answers: ["reservation"] },
        { type: "blank", en: "Sorry, we're fully ___ tonight.", ko: "죄송하지만 오늘 밤은 예약이 다 찼어요.", answers: ["booked"] },
        { type: "blank", en: "Could I get a box for the ___?", ko: "남은 거 포장해 갈 수 있을까요?", answers: ["rest", "leftovers"] },
        { type: "arrange", ko: "창가 자리에 앉을 수 있을까요?", answers: ["Can we sit by the window?"] },
        { type: "arrange", ko: "해산물 파스타로 할게요.", answers: ["I'll have the seafood pasta."] },
        { type: "arrange", ko: "따로 계산해도 될까요?", answers: ["Can we pay separately?"] }
    ]
});
