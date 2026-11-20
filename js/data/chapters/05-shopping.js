(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "shopping",
    order: 5,
    title: "쇼핑과 교환·환불",
    titleEn: "Shopping & Returns",
    emoji: "🛍️",
    level: "A2",
    gradient: ["#FCCB90", "#D57EEB"],
    goal: "사이즈를 찾아 입어 보고, 계산하고, 맞지 않으면 교환·환불까지 요청한다",

    vocab: [
        { word: "browse", pos: "v.", meaning: "(사지 않고) 둘러보다", example: "I'm just browsing, thanks.", exampleKo: "그냥 둘러보는 중이에요." },
        { word: "try on", pos: "phr. v.", meaning: "(옷을) 입어 보다", example: "Can I try this on?", exampleKo: "이거 입어 봐도 돼요?" },
        { word: "fitting room", pos: "n.", meaning: "탈의실, 피팅룸", example: "Where's the fitting room?", exampleKo: "피팅룸이 어디예요?" },
        { word: "fit", pos: "v.", meaning: "(몸에) 맞다", example: "How does it fit?", exampleKo: "잘 맞으세요?" },
        { word: "on sale", pos: "phr.", meaning: "세일 중인", example: "This shirt is on sale today.", exampleKo: "이 셔츠 오늘 세일해요." },
        { word: "wrap", pos: "v.", meaning: "포장하다, 싸다", example: "Could you wrap it as a gift?", exampleKo: "선물용으로 포장해 주실 수 있어요?" },
        { word: "return policy", pos: "n.", meaning: "반품·환불 규정", example: "What's your return policy?", exampleKo: "환불 규정이 어떻게 돼요?" },
        { word: "exchange", pos: "v.", meaning: "교환하다", example: "Can I exchange it for a large?", exampleKo: "라지로 교환할 수 있어요?" },
        { word: "refund", pos: "n.", meaning: "환불", example: "I'd like a refund, please.", exampleKo: "환불해 주세요." },
        { word: "receipt", pos: "n.", meaning: "영수증", example: "Do you have the receipt?", exampleKo: "영수증 있으세요?" }
    ],

    expressions: [
        { en: "I'm just looking.", ko: "그냥 구경하는 중이에요.", note: "점원이 말을 걸 때 부담 없이 거절하는 표현. 끝에 'thanks'를 붙이면 더 부드럽다", example: "I'm just looking, thanks." },
        { en: "Do you have this in ~?", ko: "이거 ~(사이즈·색상) 있어요?", note: "같은 물건의 다른 사이즈나 색을 찾을 때", example: "Do you have this in a medium?" },
        { en: "I'll take ~.", ko: "~ 살게요.", note: "사기로 결정했을 때. 'I'll buy'보다 훨씬 자연스럽다", example: "I'll take this one." },
        { en: "What's your return policy?", ko: "환불 규정이 어떻게 돼요?", note: "계산할 때 미리 물어 두면 나중에 편하다", example: "Before I pay, what's your return policy?" },
        { en: "Can I exchange it for ~?", ko: "~로 교환할 수 있어요?", note: "다른 사이즈·색으로 바꿀 때", example: "Can I exchange it for a large?" },
        { en: "I'd like a refund.", ko: "환불받고 싶어요.", note: "환불 요청의 기본 문장. 'Can I get a refund?'도 많이 쓴다", example: "It doesn't fit, so I'd like a refund." }
    ],

    dialogues: [
        {
            id: "s1",
            title: "사이즈 찾고 입어 보기",
            setting: "주말 오후, 쇼핑몰의 옷 가게",
            lines: [
                { speaker: "partner", name: "Sales Associate", en: "Hi there! Are you looking for anything in particular?", ko: "안녕하세요! 특별히 찾으시는 거 있으세요?" },
                { speaker: "you", ko: "그냥 둘러보는 중이에요. 감사합니다.", hint: "I'm just ~.",
                    answers: ["I'm just looking, thanks.", "Just looking, thanks.", "I'm just browsing, thanks.", "Just browsing, thank you.", "I'm just looking around, thanks.", "I'm just looking. Thank you."] },
                { speaker: "partner", name: "Sales Associate", en: "No problem. Let me know if you need any help.", ko: "네, 도움 필요하시면 말씀하세요." },
                { speaker: "you", ko: "저기요, 이 셔츠 미디엄 있어요?", hint: "Do you have this ~?",
                    answers: ["Excuse me, do you have this shirt in a medium?", "Excuse me, do you have this in a medium?", "Excuse me, do you have this in medium?", "Do you have this shirt in a medium?", "Do you have this in a medium?", "Do you have a medium in this shirt?", "Excuse me, is there a medium in this shirt?"] },
                { speaker: "partner", name: "Sales Associate", en: "Let me check... Yes, here you go. Would you like to try it on?", ko: "확인해 볼게요... 네, 여기 있어요. 입어 보시겠어요?" },
                { speaker: "you", ko: "네, 피팅룸이 어디예요?", hint: "Where's the ~?",
                    answers: ["Yes, where's the fitting room?", "Sure, where is the fitting room?", "Yes, where are the fitting rooms?", "Yes, please. Where's the fitting room?", "Sure. Where's the dressing room?", "Yes, where are the dressing rooms?", "Yes. Where can I try it on?"] },
                { speaker: "partner", name: "Sales Associate", en: "It's right over there... So, how does it fit?", ko: "바로 저쪽이에요... 어때요, 잘 맞으세요?" },
                { speaker: "you", ko: "좀 커요. 스몰 있어요?", hint: "It's a little ~.",
                    answers: ["It's a little big. Do you have a small?", "It's a bit big. Do you have it in a small?", "It's a little too big. Do you have a small?", "It's a little big. Do you have it in small?", "It's a little big. Can I get a small?", "It's kind of big. Can I try a small?", "It's a bit loose. Do you have a small?"] },
                { speaker: "partner", name: "Sales Associate", en: "Sorry, we're out of smalls in blue. We have it in black, though.", ko: "죄송해요, 파란색 스몰은 다 나갔어요. 검은색은 있어요." },
                { speaker: "you", ko: "그럼 검은색으로 입어 볼게요.", hint: "I'll try ~.",
                    answers: ["Then I'll try the black one.", "I'll try the black one, then.", "Okay, I'll try it in black.", "Then I'll try it in black.", "Sure, I'll try the black one.", "Okay, let me try the black one.", "Black is fine. I'll try it."] }
            ]
        },
        {
            id: "s2",
            title: "계산하기",
            setting: "검은색 셔츠가 딱 맞았다. 친구 선물로 사려고 계산대로 간다",
            lines: [
                { speaker: "partner", name: "Cashier", en: "Hi! Did you find everything okay?", ko: "안녕하세요! 찾으시는 건 다 찾으셨어요?" },
                { speaker: "you", ko: "네, 이 셔츠 살게요.", hint: "I'll take ~.",
                    answers: ["Yes, I'll take this shirt.", "Yes, I'll take this.", "Yeah, I'll take this one.", "Yes, I'll get this shirt.", "Yes, just this shirt, please.", "Yes, I'd like to buy this shirt.", "Yes, I'll buy this shirt.", "Just this shirt, please."] },
                { speaker: "partner", name: "Cashier", en: "Great. It's on sale today, so it's 20% off.", ko: "좋습니다. 오늘 세일이라 20% 할인돼요." },
                { speaker: "you", ko: "잘됐네요! 그럼 얼마예요?", hint: "How much ~?",
                    answers: ["Great! So how much is it?", "Oh, great! How much is it now?", "Nice! How much is it, then?", "That's great! So how much is it?", "Great! How much is it with the discount?", "Awesome! So what's the total?"] },
                { speaker: "partner", name: "Cashier", en: "It comes to 32 dollars.", ko: "32달러입니다." },
                { speaker: "you", ko: "카드로 할게요.", hint: "I'll pay ~.",
                    answers: ["I'll pay by card.", "I'll pay with a card.", "By card, please.", "Card, please.", "I'll use my card.", "Can I pay by card?", "I'll pay with my card."] },
                { speaker: "partner", name: "Cashier", en: "Sure. Go ahead and tap your card. Do you need a bag?", ko: "네. 카드 대 주세요. 봉투 필요하세요?" },
                { speaker: "you", ko: "네, 그리고 선물 포장도 돼요?", hint: "Can you gift-wrap ~?",
                    answers: ["Yes, and can you gift-wrap it?", "Yes, please. Can you gift-wrap it too?", "Yes. Could you gift-wrap it, too?", "Yes, and could you wrap it as a gift?", "Yes, and can you wrap it as a gift?", "Yes, please. And can I get it gift-wrapped?", "Yes, and do you do gift wrapping?"] },
                { speaker: "partner", name: "Cashier", en: "Of course. It's free. Anything else?", ko: "물론이죠. 무료예요. 더 필요하신 건요?" },
                { speaker: "you", ko: "아, 환불 규정이 어떻게 돼요?", hint: "What's your ~ policy?",
                    answers: ["Oh, what's your return policy?", "What's your return policy?", "Oh, what's the return policy?", "What is the return policy?", "Oh, how does the return policy work?", "Oh, can I return it if it doesn't fit?"] },
                { speaker: "partner", name: "Cashier", en: "You can return or exchange it within 30 days. Just keep the receipt.", ko: "30일 이내에 반품이나 교환 가능해요. 영수증만 챙기세요." },
                { speaker: "you", ko: "알겠어요. 영수증은 봉투에 넣어 주세요.", hint: "Can you put ~?",
                    answers: ["Got it. Can you put the receipt in the bag?", "Okay. Could you put the receipt in the bag?", "Got it. Please put the receipt in the bag.", "Okay. Can you put the receipt in the bag, please?", "Got it. Could you put it in the bag?", "Okay, can you put the receipt in the bag?"] }
            ]
        },
        {
            id: "s3",
            title: "교환과 환불",
            setting: "다음 날, 선물 받은 친구가 셔츠가 작다고 한다. 영수증을 들고 다시 매장으로",
            lines: [
                { speaker: "partner", name: "Customer Service", en: "Hi, how can I help you today?", ko: "안녕하세요, 무엇을 도와드릴까요?" },
                { speaker: "you", ko: "어제 이 셔츠를 샀는데, 너무 작아요.", hint: "I bought ~ yesterday",
                    answers: ["I bought this shirt yesterday, but it's too small.", "I bought this yesterday, but it's too small.", "I got this shirt yesterday, but it's too small.", "I bought this shirt yesterday. It's too small.", "I bought this yesterday and it's too small.", "I bought this shirt yesterday, but it's a little small."] },
                { speaker: "partner", name: "Customer Service", en: "I'm sorry to hear that. Would you like to exchange it or get a refund?", ko: "저런, 그러셨군요. 교환하시겠어요, 환불하시겠어요?" },
                { speaker: "you", ko: "라지로 교환할 수 있을까요?", hint: "Can I exchange it ~?",
                    answers: ["Can I exchange it for a large?", "Could I exchange it for a large?", "I'd like to exchange it for a large.", "Can I swap it for a large?", "Can I get a large instead?", "Could I get it in a large?", "I'd like a large instead, please."] },
                { speaker: "partner", name: "Customer Service", en: "Let me see... I'm afraid we don't have a large in black right now.", ko: "확인해 볼게요... 죄송하지만 지금 검은색 라지는 없네요." },
                { speaker: "you", ko: "그럼 환불해 주세요.", hint: "Then I'd like ~.",
                    answers: ["Then I'd like a refund, please.", "Then I'd like a refund.", "Then can I get a refund?", "Then could I get a refund?", "In that case, I'd like a refund.", "Then I'll just get a refund.", "Okay, then a refund, please.", "Then I'd like to return it."] },
                { speaker: "partner", name: "Customer Service", en: "Sure. Do you have the receipt?", ko: "네. 영수증 있으세요?" },
                { speaker: "you", ko: "네, 여기 있어요.", hint: "Here it is.",
                    answers: ["Yes, here it is.", "Yes, here you go.", "Yeah, here it is.", "Yes, here you are.", "Here it is.", "Sure, here you go.", "Here you go.", "Here you are."] },
                { speaker: "partner", name: "Customer Service", en: "Thanks. I'll put the money back on your card. It might take a few days.", ko: "감사합니다. 카드로 환불해 드릴게요. 며칠 걸릴 수 있어요." },
                { speaker: "you", ko: "며칠이나 걸려요?", hint: "How many days ~?",
                    answers: ["How many days will it take?", "How many days does it take?", "How long will it take?", "How long does it take?", "How many days?", "About how many days?"] },
                { speaker: "partner", name: "Customer Service", en: "Usually three to five business days.", ko: "보통 영업일 기준 3~5일이요." },
                { speaker: "you", ko: "알겠어요. 도와주셔서 감사합니다.", hint: "Thanks for ~.",
                    answers: ["Okay. Thanks for your help.", "Got it. Thank you for your help.", "All right. Thanks for your help.", "Okay, thanks for helping me.", "Okay. Thank you so much for your help.", "Great, thanks for your help."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "이거 다른 색 있어요?", answers: ["Do you have this in another color?", "Do you have this in a different color?", "Do you have it in other colors?", "Do you have other colors?", "Does this come in other colors?", "Does this come in another color?", "Is there another color?"] },
        { type: "translate", ko: "이거 입어 봐도 돼요?", answers: ["Can I try this on?", "Can I try it on?", "Could I try this on?", "Could I try it on?", "May I try this on?", "May I try it on?"] },
        { type: "translate", ko: "이거 세일 중이에요?", answers: ["Is this on sale?", "Is it on sale?", "Is this item on sale?", "Is this discounted?"] },
        { type: "translate", ko: "환불받고 싶어요.", answers: ["I'd like a refund.", "I'd like a refund, please.", "I'd like to get a refund.", "Can I get a refund?", "Could I get a refund?", "I want a refund.", "I want to get a refund."] },
        { type: "blank", en: "Do you have this ___ a large?", ko: "이거 라지 사이즈 있어요?", answers: ["in"] },
        { type: "blank", en: "Where's the ___ room?", ko: "피팅룸이 어디예요?", answers: ["fitting", "dressing"] },
        { type: "blank", en: "Can I ___ it for a smaller size?", ko: "더 작은 사이즈로 교환할 수 있어요?", answers: ["exchange", "swap"] },
        { type: "arrange", ko: "그냥 구경하는 중이에요, 감사합니다.", answers: ["I'm just looking, thanks."] },
        { type: "arrange", ko: "이걸로 살게요.", answers: ["I'll take this one."] },
        { type: "arrange", ko: "영수증 여기 있어요.", answers: ["Here's my receipt."] }
    ]
});
