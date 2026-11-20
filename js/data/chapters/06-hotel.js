(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "hotel",
    order: 6,
    title: "호텔 체크인과 요청",
    titleEn: "At the Hotel",
    emoji: "🏨",
    level: "A2",
    gradient: ["#4FACFE", "#00F2FE"],
    goal: "체크인하고, 객실 문제를 프런트에 알리고, 짐 보관과 택시 예약까지 부탁한다",

    vocab: [
        { word: "passport", pos: "n.", meaning: "여권", example: "Can I see your passport, please?", exampleKo: "여권 좀 보여 주시겠어요?" },
        { word: "key card", pos: "n.", meaning: "카드 키", example: "The password is on the back of your key card.", exampleKo: "비밀번호는 카드 키 뒷면에 있어요." },
        { word: "checkout", pos: "n.", meaning: "체크아웃", example: "What time is checkout?", exampleKo: "체크아웃은 몇 시예요?" },
        { word: "elevator", pos: "n.", meaning: "엘리베이터", example: "Where's the elevator?", exampleKo: "엘리베이터는 어디 있어요?" },
        { word: "air conditioner", pos: "n.", meaning: "에어컨", example: "The air conditioner isn't working.", exampleKo: "에어컨이 안 돼요." },
        { word: "extra", pos: "adj.", meaning: "추가의, 여분의", example: "Could I get some extra towels?", exampleKo: "수건 좀 더 주실 수 있어요?" },
        { word: "towel", pos: "n.", meaning: "수건", example: "How many towels would you like?", exampleKo: "수건 몇 장 필요하세요?" },
        { word: "minibar", pos: "n.", meaning: "(객실) 미니바", example: "Did you have anything from the minibar?", exampleKo: "미니바에서 드신 거 있으세요?" },
        { word: "luggage", pos: "n.", meaning: "짐, 수하물", example: "Could I leave my luggage here?", exampleKo: "여기 짐 좀 맡겨도 될까요?" },
        { word: "stay", pos: "n.", meaning: "숙박, 머무는 기간", example: "How was your stay?", exampleKo: "지내시는 건 어떠셨어요?" }
    ],

    expressions: [
        { en: "I have a reservation under ~.", ko: "~(이름)으로 예약했어요.", note: "체크인 첫마디. 예약자 이름 앞에는 'under'를 쓴다", example: "I have a reservation under Minsu Kim." },
        { en: "What time is ~?", ko: "~는 몇 시예요?", note: "조식·체크아웃 시간 등을 물을 때", example: "What time is checkout?" },
        { en: "The ~ isn't working.", ko: "~가 안 돼요.", note: "고장 난 것을 알릴 때 가장 쉬운 표현. 'doesn't work'도 같은 뜻", example: "The air conditioner isn't working." },
        { en: "Could I get some extra ~?", ko: "~ 좀 더 주실 수 있어요?", note: "수건·베개 등 비품을 더 요청할 때", example: "Could I get some extra pillows?" },
        { en: "Can I leave my bags ~?", ko: "짐 좀 맡겨도 될까요?", note: "체크인 전이나 체크아웃 후 짐 보관을 부탁할 때", example: "Can I leave my bags here until 6?" },
        { en: "Could you ~ for me?", ko: "~ 좀 해 주실 수 있어요?", note: "프런트에 무언가를 부탁할 때 쓰는 공손한 틀", example: "Could you call a taxi for me?" }
    ],

    dialogues: [
        {
            id: "s1",
            title: "체크인",
            setting: "밤 9시, 긴 비행 끝에 호텔 프런트에 도착했다",
            lines: [
                { speaker: "partner", name: "Receptionist", en: "Good evening! Welcome to the Harbor Hotel. Are you checking in?", ko: "안녕하세요! 하버 호텔에 오신 걸 환영합니다. 체크인하시나요?" },
                { speaker: "you", ko: "네, 김민수로 예약했어요.", hint: "I have a reservation ~.",
                    answers: ["Yes, I have a reservation under Minsu Kim.", "Yes, I have a reservation under Kim.", "Yes, it's under Minsu Kim.", "Yes, the reservation is under Minsu Kim.", "Yes, I booked a room under Minsu Kim.", "Yes, I'm checking in. The name is Minsu Kim.", "Yes, I have a reservation. It's under Minsu Kim."] },
                { speaker: "partner", name: "Receptionist", en: "Let me see... Yes, three nights in a double room. Can I see your passport, please?", ko: "확인해 볼게요... 네, 더블룸 3박이시네요. 여권 좀 보여 주시겠어요?" },
                { speaker: "you", ko: "네, 여기요.", hint: "Here you go.",
                    answers: ["Sure, here you go.", "Here you go.", "Yes, here it is.", "Sure, here it is.", "Here you are.", "Here's my passport.", "Here it is."] },
                { speaker: "partner", name: "Receptionist", en: "Thank you. Breakfast is from 7 to 10 on the second floor.", ko: "감사합니다. 조식은 2층에서 7시부터 10시까지예요." },
                { speaker: "you", ko: "와이파이 비밀번호가 뭐예요?", hint: "What's the ~?",
                    answers: ["What's the Wi-Fi password?", "What's the wifi password?", "Can I get the Wi-Fi password?", "Could I have the Wi-Fi password?", "What's the password for the Wi-Fi?", "What's the Wi-Fi password, please?"] },
                { speaker: "partner", name: "Receptionist", en: "It's on the back of your key card.", ko: "카드 키 뒷면에 있어요." },
                { speaker: "you", ko: "체크아웃은 몇 시예요?", hint: "What time is ~?",
                    answers: ["What time is checkout?", "What time is check out?", "When is checkout?", "What time do I need to check out?", "What time do I have to check out?", "When do I have to check out?"] },
                { speaker: "partner", name: "Receptionist", en: "Checkout is at 11 a.m. Here's your key. You're in room 1205.", ko: "체크아웃은 오전 11시예요. 키 여기 있습니다. 1205호입니다." },
                { speaker: "you", ko: "엘리베이터는 어디 있어요?", hint: "Where's the ~?",
                    answers: ["Where's the elevator?", "Where are the elevators?", "Which way is the elevator?", "Where can I find the elevator?", "And where's the elevator?"] },
                { speaker: "partner", name: "Receptionist", en: "Just around the corner to your left. Enjoy your stay!", ko: "모퉁이 돌아서 왼쪽에 있어요. 편히 쉬세요!" },
                { speaker: "you", ko: "감사합니다. 좋은 밤 보내세요.", hint: "Have a good ~.",
                    answers: ["Thank you. Have a good night.", "Thanks. Have a good night.", "Thank you. Good night!", "Thanks, have a nice evening.", "Thanks so much. Have a good evening.", "Thank you, have a great night."] }
            ]
        },
        {
            id: "s2",
            title: "객실 문제와 요청",
            setting: "방에 들어왔는데 에어컨이 켜지지 않는다. 객실 전화로 프런트에 건다",
            lines: [
                { speaker: "partner", name: "Front Desk", en: "Front desk, this is Sarah. How can I help you?", ko: "프런트 데스크 사라입니다. 무엇을 도와드릴까요?" },
                { speaker: "you", ko: "1205호인데요, 에어컨이 안 돼요.", hint: "The ~ isn't working.",
                    answers: ["This is room 1205. The air conditioner isn't working.", "Hi, this is room 1205. The AC isn't working.", "This is room 1205, and the AC isn't working.", "I'm in room 1205. The air conditioning isn't working.", "Hi, I'm in room 1205. The AC doesn't work.", "This is room 1205. The air conditioner doesn't work.", "Room 1205. The AC isn't working.", "This is room twelve oh five. The AC isn't working."] },
                { speaker: "partner", name: "Front Desk", en: "I'm so sorry about that. I'll send someone up right away.", ko: "정말 죄송합니다. 바로 직원을 올려 보낼게요." },
                { speaker: "you", ko: "얼마나 걸릴까요?", hint: "How long ~?",
                    answers: ["How long will it take?", "How long will that take?", "How long will it be?", "How long do you think it'll take?", "When will they come?", "How soon can they come?"] },
                { speaker: "partner", name: "Front Desk", en: "About 15 minutes. Is there anything else I can do for you?", ko: "15분 정도요. 그 밖에 도와드릴 거 있으세요?" },
                { speaker: "you", ko: "수건 좀 더 갖다 주실 수 있어요?", hint: "Could I get ~?",
                    answers: ["Could I get some extra towels?", "Can I get some extra towels?", "Could I get some more towels?", "Can I get some more towels?", "Can I have some more towels, please?", "Could you bring me some extra towels?", "Could you send up some more towels?", "I need some more towels, please."] },
                { speaker: "partner", name: "Front Desk", en: "Of course. How many would you like?", ko: "물론이죠. 몇 장 필요하세요?" },
                { speaker: "you", ko: "두 장이면 돼요.", hint: "~ should be fine.",
                    answers: ["Two should be fine.", "Two is fine.", "Two would be great.", "Two, please.", "Just two, please.", "Two is enough.", "Two should be enough.", "Two would be good."] },
                { speaker: "partner", name: "Front Desk", en: "No problem. And if the room is still too hot, we can move you to a different room.", ko: "알겠습니다. 그리고 계속 더우시면 다른 방으로 옮겨 드릴 수 있어요." },
                { speaker: "you", ko: "일단 고쳐지는지 볼게요. 감사합니다.", hint: "Let me see if ~.",
                    answers: ["Let me see if they can fix it first. Thanks.", "I'll see if they can fix it first. Thanks.", "Thanks. I'll see if they can fix it first.", "Okay, let's see if they can fix it first.", "Let's see if it gets fixed first. Thank you.", "Let me wait and see if they can fix it. Thanks."] }
            ]
        },
        {
            id: "s3",
            title: "체크아웃과 짐 보관",
            setting: "마지막 날 아침. 비행기는 저녁이라 시간이 넉넉하다",
            lines: [
                { speaker: "partner", name: "Receptionist", en: "Good morning! Are you checking out?", ko: "좋은 아침이에요! 체크아웃하시나요?" },
                { speaker: "you", ko: "네, 체크아웃할게요. 여기 키요.", hint: "I'd like to ~.",
                    answers: ["Yes, I'd like to check out. Here's my key.", "Yes, I'd like to check out. Here's the key.", "Yes, I'm checking out. Here's the key.", "Yes, I'm checking out. Here's my key.", "Yes, checking out. Here's my key.", "Yes, here's my key. I'd like to check out."] },
                { speaker: "partner", name: "Receptionist", en: "Thank you. How was your stay?", ko: "감사합니다. 지내시는 건 어떠셨어요?" },
                { speaker: "you", ko: "아주 좋았어요. 방이 깨끗하고 조용했어요.", hint: "It was ~.",
                    answers: ["It was great. The room was clean and quiet.", "It was really nice. The room was clean and quiet.", "It was wonderful. The room was clean and quiet.", "It was great. The room was quiet and clean.", "Great! The room was very clean and quiet.", "Very good. The room was clean and quiet."] },
                { speaker: "partner", name: "Receptionist", en: "Glad to hear that. Did you have anything from the minibar?", ko: "다행이네요. 미니바에서 드신 거 있으세요?" },
                { speaker: "you", ko: "물 한 병만 마셨어요.", hint: "Just ~.",
                    answers: ["Just one bottle of water.", "Just a bottle of water.", "Yes, just one bottle of water.", "Only one bottle of water.", "I only had a bottle of water.", "I just had one bottle of water."] },
                { speaker: "partner", name: "Receptionist", en: "Okay, that's 3 dollars. Anything else I can help with?", ko: "네, 3달러 추가됩니다. 더 도와드릴 게 있을까요?" },
                { speaker: "you", ko: "비행기가 저녁이라서요. 짐 좀 맡겨도 될까요?", hint: "Can I leave ~?",
                    answers: ["My flight is in the evening. Can I leave my bags here?", "My flight is tonight. Could I leave my luggage here?", "My flight is tonight. Can I leave my bags here?", "My flight is in the evening. Could you hold my bags?", "Can I leave my bags here until this evening?", "Could I leave my luggage here until tonight?", "Can you keep my bags until this evening?"] },
                { speaker: "partner", name: "Receptionist", en: "Sure. Here's your claim ticket. Just show it when you come back.", ko: "그럼요. 보관증 여기 있어요. 돌아오실 때 보여 주시면 돼요." },
                { speaker: "you", ko: "그리고 저녁 6시에 공항 가는 택시 예약해 주실 수 있어요?", hint: "Could you book ~?",
                    answers: ["Could you book a taxi to the airport for 6 p.m.?", "Could you book a taxi to the airport for 6?", "Can you book me a taxi to the airport at 6?", "Can you call a taxi to the airport for 6 pm?", "Could you get me a taxi to the airport at 6?", "Could you book a cab to the airport for 6?", "Also, could you book a taxi to the airport for 6?"] },
                { speaker: "partner", name: "Receptionist", en: "Of course. It'll be waiting at the front entrance at 6.", ko: "물론이죠. 6시에 정문 앞에 대기시켜 둘게요." },
                { speaker: "you", ko: "감사합니다. 정말 잘 지내다 가요.", hint: "I enjoyed ~.",
                    answers: ["Thank you. I really enjoyed my stay.", "Thanks so much. I really enjoyed my stay.", "Thank you. I enjoyed my stay.", "Thank you. I had a great stay.", "Thanks! I really enjoyed staying here.", "Thank you for everything. I enjoyed my stay."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "체크인하고 싶어요.", answers: ["I'd like to check in.", "I'd like to check in, please.", "I want to check in.", "Can I check in?", "I'm here to check in.", "Check in, please.", "Could I check in?"] },
        { type: "translate", ko: "조식은 몇 시에 시작해요?", answers: ["What time does breakfast start?", "When does breakfast start?", "What time does breakfast begin?", "When does breakfast begin?", "What time is breakfast?", "When is breakfast?"] },
        { type: "translate", ko: "방에 뜨거운 물이 안 나와요.", answers: ["There's no hot water in my room.", "There's no hot water in the room.", "There's no hot water.", "I don't have any hot water.", "The hot water isn't working.", "The hot water isn't working in my room.", "I have no hot water in my room."] },
        { type: "translate", ko: "체크아웃 늦게 해도 될까요?", answers: ["Can I get a late checkout?", "Could I get a late checkout?", "Can I have a late checkout?", "Is a late checkout possible?", "Is late checkout possible?", "Can I check out late?", "Could I check out late?", "Can I check out later?", "Could I check out later?", "Can I get a late check out?"] },
        { type: "blank", en: "I have a reservation ___ Minsu Kim.", ko: "김민수로 예약했어요.", answers: ["under"] },
        { type: "blank", en: "The air conditioner isn't ___.", ko: "에어컨이 작동을 안 해요.", answers: ["working"] },
        { type: "blank", en: "Can I ___ my bags here?", ko: "여기 짐 맡겨도 돼요?", answers: ["leave", "store", "keep"] },
        { type: "arrange", ko: "와이파이 비밀번호가 뭐예요?", answers: ["What's the Wi-Fi password?"] },
        { type: "arrange", ko: "수건 좀 더 주실 수 있어요?", answers: ["Could I get some extra towels?"] },
        { type: "arrange", ko: "택시 좀 불러 주시겠어요?", answers: ["Could you call a taxi for me?"] }
    ]
});
