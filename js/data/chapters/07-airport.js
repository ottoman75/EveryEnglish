(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "airport",
    order: 7,
    title: "공항 체크인과 입국심사",
    titleEn: "At the Airport",
    emoji: "✈️",
    level: "A2",
    gradient: ["#667EEA", "#764BA2"],
    goal: "체크인 카운터에서 짐과 좌석 문제를 해결하고, 입국심사 질문에 막힘없이 답한다",

    vocab: [
        { word: "check in", pos: "phr. v.", meaning: "탑승 수속하다, (짐을) 부치다", example: "I'd like to check in, please.", exampleKo: "체크인하려고요." },
        { word: "passport", pos: "n.", meaning: "여권", example: "Can I see your passport, please?", exampleKo: "여권 좀 보여 주시겠어요?" },
        { word: "aisle seat", pos: "n.", meaning: "통로 쪽 좌석", example: "Could I get an aisle seat?", exampleKo: "통로 쪽 좌석으로 주시겠어요?" },
        { word: "carry-on", pos: "n.", meaning: "기내 반입 가방", example: "Is this your carry-on?", exampleKo: "이게 기내용 가방인가요?" },
        { word: "overweight", pos: "adj.", meaning: "무게가 초과된", example: "Your bag is a little overweight.", exampleKo: "가방 무게가 조금 초과됐어요." },
        { word: "weigh", pos: "v.", meaning: "무게를 재다", example: "Could you weigh it again?", exampleKo: "다시 재 주시겠어요?" },
        { word: "boarding pass", pos: "n.", meaning: "탑승권", example: "Here's your boarding pass.", exampleKo: "탑승권 여기 있습니다." },
        { word: "purpose", pos: "n.", meaning: "목적", example: "What's the purpose of your visit?", exampleKo: "방문 목적이 뭔가요?" },
        { word: "stay", pos: "v./n.", meaning: "머무르다; 체류", example: "How long are you staying?", exampleKo: "얼마나 머무르실 건가요?" },
        { word: "declare", pos: "v.", meaning: "(세관에) 신고하다", example: "I have nothing to declare.", exampleKo: "신고할 물건이 없어요." }
    ],

    expressions: [
        { en: "I'm flying to ~.", ko: "~로 가요.", note: "행선지를 말할 때. 'I go to ~'는 어색하게 들린다", example: "I'm flying to New York." },
        { en: "Could I get ~?", ko: "~로 주시겠어요?", note: "좌석·서비스 요청. 카페에서 쓰던 패턴이 공항에서도 그대로 통한다", example: "Could I get an aisle seat?" },
        { en: "How much is ~?", ko: "~ 얼마예요?", note: "추가 요금을 물을 때", example: "How much is the extra fee?" },
        { en: "Could you ~ again?", ko: "다시 ~해 주시겠어요?", note: "한 번 더 해 달라고 정중하게 부탁할 때", example: "Could you weigh it again?" },
        { en: "I'm here for ~.", ko: "~하러 왔어요.", note: "입국심사 방문 목적. 출장은 'I'm here on business.'", example: "I'm here for vacation." },
        { en: "I'm staying ~.", ko: "~ 머물러요.", note: "기간(for a week)과 장소(at a hotel) 모두 이 패턴으로", example: "I'm staying for a week at a hotel." }
    ],

    dialogues: [
        {
            id: "s1",
            title: "체크인 카운터",
            setting: "출국 당일 아침, 항공사 체크인 카운터 앞",
            lines: [
                { speaker: "partner", name: "Agent", en: "Good morning! Where are you flying today?", ko: "안녕하세요! 오늘 어디로 가세요?" },
                { speaker: "you", ko: "뉴욕으로 가요.", hint: "I'm flying to ~.",
                    answers: ["I'm flying to New York.", "I'm going to New York.", "New York.", "To New York.", "I'm headed to New York.", "I'm heading to New York.", "New York, please."] },
                { speaker: "partner", name: "Agent", en: "Great. Can I see your passport, please?", ko: "네. 여권 좀 보여 주시겠어요?" },
                { speaker: "you", ko: "여기 있어요.", hint: "Here you go.",
                    answers: ["Here you go.", "Here it is.", "Here you are.", "Sure, here you go.", "Sure, here it is.", "Here."] },
                { speaker: "partner", name: "Agent", en: "Thank you. Are you checking any bags today?", ko: "감사합니다. 오늘 부치실 짐 있으세요?" },
                { speaker: "you", ko: "네, 하나 부칠게요.", hint: "Yes, ~ bag.",
                    answers: ["Yes, just one bag.", "Yes, one bag.", "Yes, I'm checking one bag.", "Yes, I have one bag to check.", "Yes, I'd like to check one bag.", "Yes, I'll check one bag.", "Just one.", "Just one bag.", "One bag."] },
                { speaker: "partner", name: "Agent", en: "Okay, please put it on the scale. Window or aisle seat?", ko: "네, 저울에 올려 주세요. 창가 좌석이요, 통로 좌석이요?" },
                { speaker: "you", ko: "통로 쪽 좌석으로 주세요.", hint: "Could I get ~?",
                    answers: ["Could I get an aisle seat?", "Can I get an aisle seat?", "An aisle seat, please.", "Aisle seat, please.", "Aisle, please.", "I'd like an aisle seat, please.", "Could I have an aisle seat?", "Can I have an aisle seat, please?"] },
                { speaker: "partner", name: "Agent", en: "Sure. And is this your carry-on?", ko: "네. 그리고 이게 기내용 가방인가요?" },
                { speaker: "you", ko: "네, 기내용은 이거 하나예요.", hint: "Yes, just ~.",
                    answers: ["Yes, just this one.", "Yes, only this one.", "Yes, that's my carry-on.", "Yes, this is my carry-on.", "Yes, just this bag.", "Yes, that's my only carry-on.", "Yes, this is my only carry-on.", "Just this one.", "Only this one.", "Just this bag."] }
            ]
        },
        {
            id: "s2",
            title: "짐 무게 초과",
            setting: "저울에 올린 캐리어 무게가 기준을 넘었다",
            lines: [
                { speaker: "partner", name: "Agent", en: "Hmm, your bag is 26 kilos. The limit is 23, so it's overweight.", ko: "음, 가방이 26킬로네요. 기준이 23킬로라 무게 초과예요." },
                { speaker: "you", ko: "아, 추가 요금이 얼마예요?", hint: "How much is ~?",
                    answers: ["Oh, how much is the extra fee?", "How much is the extra fee?", "Oh, how much is the fee?", "How much is it?", "How much do I have to pay?", "Oh, how much extra is it?", "How much is the overweight fee?", "How much would it be?"] },
                { speaker: "partner", name: "Agent", en: "It's 100 dollars for overweight bags.", ko: "무게 초과 가방은 100달러예요." },
                { speaker: "you", ko: "그럼 짐을 좀 빼도 될까요?", hint: "Can I ~?",
                    answers: ["Then can I take some things out?", "Can I take some things out?", "Could I take some things out?", "Can I take some stuff out?", "Then could I take a few things out?", "Can I take a few things out?", "Can I move some things to my carry-on?"] },
                { speaker: "partner", name: "Agent", en: "Sure, go ahead. You can put them in your carry-on.", ko: "그럼요, 그렇게 하세요. 기내용 가방에 넣으시면 돼요." },
                { speaker: "you", ko: "다 뺐어요. 다시 재 주시겠어요?", hint: "Could you ~ again?",
                    answers: ["Okay, done. Could you weigh it again?", "Done. Could you weigh it again?", "Could you weigh it again?", "Can you weigh it again?", "Okay, can you weigh it again?", "All done. Can you weigh it again?", "Okay, could you check it again?", "Could you weigh it one more time?"] },
                { speaker: "partner", name: "Agent", en: "22 kilos. Perfect, you're all set. Here's your boarding pass.", ko: "22킬로네요. 됐습니다. 탑승권 여기 있어요." },
                { speaker: "you", ko: "몇 번 게이트로 가면 돼요?", hint: "Which gate ~?",
                    answers: ["Which gate do I go to?", "Which gate is it?", "What gate is it?", "What gate do I go to?", "Which gate should I go to?", "Where's my gate?", "What's the gate number?", "Which gate is my flight?"] },
                { speaker: "partner", name: "Agent", en: "Gate 32. Boarding starts at 10:40.", ko: "32번 게이트예요. 탑승은 10시 40분에 시작해요." },
                { speaker: "you", ko: "10시 40분 탑승이죠? 감사합니다.", hint: "Boarding at ~, right?",
                    answers: ["Boarding at 10:40, right? Thank you.", "Boarding at 10:40, right?", "Boarding is at 10:40, right? Thanks.", "So boarding is at 10:40? Thank you.", "10:40, right? Thanks.", "Okay, boarding at 10:40. Thanks.", "Got it, 10:40. Thank you.", "Boarding at ten forty, right? Thanks."] }
            ]
        },
        {
            id: "s3",
            title: "입국심사",
            setting: "뉴욕 공항 도착, 입국심사대 앞",
            lines: [
                { speaker: "partner", name: "Officer", en: "Good afternoon. What's the purpose of your visit?", ko: "안녕하세요. 방문 목적이 뭔가요?" },
                { speaker: "you", ko: "여행하러 왔어요.", hint: "I'm here for ~.",
                    answers: ["I'm here for vacation.", "I'm here on vacation.", "I'm on vacation.", "For vacation.", "Vacation.", "I'm here for sightseeing.", "Sightseeing.", "I'm here to travel.", "I'm here for a trip.", "Just traveling.", "Tourism."] },
                { speaker: "partner", name: "Officer", en: "How long are you staying?", ko: "얼마나 머무르실 건가요?" },
                { speaker: "you", ko: "일주일 있을 거예요.", hint: "I'm staying for ~.",
                    answers: ["I'm staying for a week.", "I'm staying for one week.", "I'll be staying for a week.", "For a week.", "For one week.", "A week.", "One week.", "About a week.", "I'm staying for 7 days.", "For 7 days.", "7 days."] },
                { speaker: "partner", name: "Officer", en: "Where will you be staying?", ko: "어디서 지내실 건가요?" },
                { speaker: "you", ko: "맨해튼에 있는 호텔에 묵어요.", hint: "I'm staying at ~.",
                    answers: ["I'm staying at a hotel in Manhattan.", "I'm staying in a hotel in Manhattan.", "I'll be staying at a hotel in Manhattan.", "At a hotel in Manhattan.", "In a hotel in Manhattan.", "A hotel in Manhattan.", "I'll be at a hotel in Manhattan."] },
                { speaker: "partner", name: "Officer", en: "Is this your first time in the U.S.?", ko: "미국은 처음이세요?" },
                { speaker: "you", ko: "아니요, 두 번째예요.", hint: "It's my ~ time.",
                    answers: ["No, it's my second time.", "No, this is my second time.", "No, second time.", "No, it's my second visit.", "No, this is my second visit.", "No, I've been here once before.", "No, I've been here before.", "Second time."] },
                { speaker: "partner", name: "Officer", en: "Do you have anything to declare? Any food or plants?", ko: "신고할 물건 있으세요? 음식이나 식물 같은 거요." },
                { speaker: "you", ko: "아니요, 신고할 거 없어요.", hint: "nothing to declare",
                    answers: ["No, I have nothing to declare.", "No, nothing to declare.", "Nothing to declare.", "No, I don't have anything to declare.", "No, I don't.", "No, nothing.", "No, I don't have anything.", "I don't.", "Nothing."] },
                { speaker: "partner", name: "Officer", en: "Alright. Enjoy your stay, and welcome to New York.", ko: "알겠습니다. 즐거운 여행 되세요. 뉴욕에 오신 걸 환영해요." },
                { speaker: "you", ko: "감사합니다! 그럴게요.", hint: "Thanks, I will.",
                    answers: ["Thank you, I will!", "Thanks, I will.", "Thanks! I will.", "Thank you!", "Thanks so much!", "Thank you so much, I will."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "통로 쪽 좌석으로 주시겠어요?", answers: ["Could I get an aisle seat?", "Can I get an aisle seat?", "Could I have an aisle seat?", "Can I have an aisle seat?", "I'd like an aisle seat, please.", "I'd like an aisle seat.", "An aisle seat, please."] },
        { type: "translate", ko: "출장 왔어요.", answers: ["I'm here on business.", "I'm here for business.", "I'm on a business trip.", "I'm here on a business trip.", "I'm here for a business trip.", "On business.", "For business."] },
        { type: "translate", ko: "열흘 동안 머물 거예요.", answers: ["I'm staying for 10 days.", "I'll be staying for 10 days.", "I'll stay for 10 days.", "I'm going to stay for 10 days.", "I'm gonna stay for 10 days.", "For 10 days.", "10 days."] },
        { type: "translate", ko: "제 가방 무게 초과인가요?", answers: ["Is my bag overweight?", "Is my bag too heavy?", "Is my suitcase overweight?", "Is my luggage overweight?", "Is my bag over the limit?", "Is my bag over the weight limit?", "Is my suitcase too heavy?"] },
        { type: "blank", en: "What's the ___ of your visit?", ko: "방문 목적이 뭔가요?", answers: ["purpose"] },
        { type: "blank", en: "I have nothing to ___.", ko: "신고할 물건이 없어요.", answers: ["declare"] },
        { type: "blank", en: "Are you ___ any bags today?", ko: "오늘 부치실 짐 있으세요?", answers: ["checking"] },
        { type: "arrange", ko: "체크인하려고요.", answers: ["I'd like to check in, please.", "I'd like to check in."] },
        { type: "arrange", ko: "일주일 동안 머물러요.", answers: ["I'm staying for a week."] },
        { type: "arrange", ko: "몇 번 게이트로 가면 돼요?", answers: ["Which gate do I go to?"] }
    ]
});
