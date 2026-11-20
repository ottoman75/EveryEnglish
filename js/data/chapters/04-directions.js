(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "directions",
    order: 4,
    title: "길 묻기와 대중교통",
    titleEn: "Getting Around",
    emoji: "🗺️",
    level: "A2",
    gradient: ["#84FAB0", "#8FD3F4"],
    goal: "길을 묻고 알아듣고, 지하철과 버스를 갈아타며 목적지까지 혼자 찾아간다",

    vocab: [
        { word: "lost", pos: "adj.", meaning: "길을 잃은", example: "I think I'm lost.", exampleKo: "저 길을 잃은 것 같아요." },
        { word: "straight", pos: "adv.", meaning: "똑바로, 직진으로", example: "Go straight two blocks.", exampleKo: "두 블록 직진하세요." },
        { word: "turn left", pos: "phr.", meaning: "왼쪽으로 돌다", example: "Turn left at the bank.", exampleKo: "은행에서 왼쪽으로 도세요." },
        { word: "block", pos: "n.", meaning: "블록, 구획(한 길모퉁이에서 다음 모퉁이까지)", example: "It's two blocks from here.", exampleKo: "여기서 두 블록 거리예요." },
        { word: "subway station", pos: "n.", meaning: "지하철역", example: "Where's the subway station?", exampleKo: "지하철역이 어디예요?" },
        { word: "line", pos: "n.", meaning: "(지하철) 노선, 호선", example: "Which line should I take?", exampleKo: "몇 호선 타야 돼요?" },
        { word: "transfer", pos: "v.", meaning: "갈아타다, 환승하다", example: "Do I need to transfer?", exampleKo: "갈아타야 돼요?" },
        { word: "platform", pos: "n.", meaning: "승강장", example: "The train leaves from platform 2.", exampleKo: "열차는 2번 승강장에서 출발해요." },
        { word: "fare", pos: "n.", meaning: "(교통) 요금", example: "How much is the fare?", exampleKo: "요금이 얼마예요?" },
        { word: "get off", pos: "phr. v.", meaning: "(차에서) 내리다", example: "I'll get off here.", exampleKo: "여기서 내릴게요." }
    ],

    expressions: [
        { en: "How do I get to ~?", ko: "~에 어떻게 가요?", note: "길을 물을 때 가장 기본. 'Where is ~?'보다 가는 방법까지 묻는 느낌", example: "Excuse me, how do I get to City Hall?" },
        { en: "How long does it take ~?", ko: "~ 얼마나 걸려요?", note: "소요 시간을 물을 때. 'to walk', 'to get there' 등을 붙인다", example: "How long does it take to walk?" },
        { en: "Which line should I take?", ko: "몇 호선 타야 돼요?", note: "지하철 노선을 물을 때. 'What line do I take?'도 자연스럽다", example: "I'm going to City Hall. Which line should I take?" },
        { en: "Do I need to transfer?", ko: "갈아타야 돼요?", note: "환승 여부를 물을 때. 'change trains'도 같은 뜻", example: "Do I need to transfer to get to the airport?" },
        { en: "Does this bus go to ~?", ko: "이 버스 ~ 가요?", note: "버스 탈 때 기사님께 확인하는 한마디", example: "Does this bus go to the art museum?" },
        { en: "Could you let me know when ~?", ko: "~하면 알려 주실 수 있어요?", note: "내릴 곳을 모를 때 기사님이나 옆 사람에게 부탁하는 표현", example: "Could you let me know when we get there?" }
    ],

    dialogues: [
        {
            id: "s1",
            title: "길에서 길 묻기",
            setting: "처음 와 본 동네, 휴대폰 배터리가 꺼져 지도를 볼 수 없다",
            lines: [
                { speaker: "partner", name: "Passerby", en: "Hi, you look a little lost. Can I help?", ko: "저기요, 길 잃으신 것 같은데 도와드릴까요?" },
                { speaker: "you", ko: "네! 지하철역이 어디예요?", hint: "Where's the ~?",
                    answers: ["Yes! Where's the subway station?", "Yes, please! Where is the subway station?", "Yes! How do I get to the subway station?", "Yes! Is there a subway station near here?", "Yes, I'm looking for the subway station.", "Yes! Which way is the subway station?", "Where's the nearest subway station?"] },
                { speaker: "partner", name: "Passerby", en: "The closest one is on Main Street. Go straight two blocks and turn left.", ko: "제일 가까운 건 메인 스트리트에 있어요. 두 블록 직진해서 왼쪽으로 도세요." },
                { speaker: "you", ko: "두 블록 가서 왼쪽이요?", hint: "Two blocks, then ~?",
                    answers: ["Two blocks and then left?", "Two blocks, then left?", "Two blocks and turn left?", "So two blocks and turn left?", "Go straight two blocks and turn left?", "Straight two blocks, then left?"] },
                { speaker: "partner", name: "Passerby", en: "That's right. It's next to a big bank.", ko: "맞아요. 큰 은행 옆에 있어요." },
                { speaker: "you", ko: "걸어서 얼마나 걸려요?", hint: "How long ~ walk?",
                    answers: ["How long does it take to walk?", "How long is the walk?", "How long does it take on foot?", "How long will it take on foot?", "How long will it take to walk?", "How long of a walk is it?", "Is it far to walk?"] },
                { speaker: "partner", name: "Passerby", en: "About five minutes. You can't miss it. Where are you headed, by the way?", ko: "5분 정도요. 금방 찾으실 거예요. 그런데 어디 가세요?" },
                { speaker: "you", ko: "시청에 가요.", hint: "I'm going to ~.",
                    answers: ["I'm going to City Hall.", "City Hall.", "To City Hall.", "I'm heading to City Hall.", "I need to get to City Hall.", "I'm on my way to City Hall."] },
                { speaker: "partner", name: "Passerby", en: "Oh, then the subway is perfect. It's only a few stops.", ko: "아, 그럼 지하철이 딱이에요. 몇 정거장 안 돼요." },
                { speaker: "you", ko: "정말 감사합니다. 큰 도움이 됐어요.", hint: "That helps ~.",
                    answers: ["Thank you so much. That really helps.", "Thank you. That helps a lot.", "Thanks, that helps a lot.", "Thanks a lot. That's really helpful.", "Thank you so much. That was really helpful.", "Thanks so much. You've been very helpful."] }
            ]
        },
        {
            id: "s2",
            title: "지하철 타기",
            setting: "역에 도착했는데 발권기 앞에서 어떻게 해야 할지 모르겠다",
            lines: [
                { speaker: "partner", name: "Station Staff", en: "Do you need help with the machine?", ko: "발권기 사용하는 거 도와드릴까요?" },
                { speaker: "you", ko: "네, 시청 가는 표는 어떻게 사요?", hint: "How do I ~?",
                    answers: ["Yes, how do I buy a ticket to City Hall?", "Yes, how do I get a ticket to City Hall?", "Yes, please. How do I buy a ticket for City Hall?", "Yes. How can I buy a ticket to City Hall?", "Yeah, how do I get a ticket to City Hall?", "Yes, how do I buy a ticket for City Hall?"] },
                { speaker: "partner", name: "Station Staff", en: "You don't need a ticket. Just tap your credit card at the gate.", ko: "표는 필요 없어요. 개찰구에서 신용카드를 찍으시면 돼요." },
                { speaker: "you", ko: "아, 편하네요! 몇 호선 타야 돼요?", hint: "Which line ~?",
                    answers: ["Oh, that's easy! Which line should I take?", "Oh, that's convenient! Which line should I take?", "Oh, great! Which line should I take?", "Oh, nice! What line do I take?", "Oh, convenient! Which line do I take?", "That's easy! Which line do I need?", "Oh, cool! Which line goes to City Hall?"] },
                { speaker: "partner", name: "Station Staff", en: "Take the Green Line toward Downtown.", ko: "다운타운 방면 그린 라인 타세요." },
                { speaker: "you", ko: "다음 열차는 언제 와요?", hint: "When's the next ~?",
                    answers: ["When's the next train?", "When does the next train come?", "What time is the next train?", "When does the next one come?", "When is the next train coming?", "How often do the trains come?"] },
                { speaker: "partner", name: "Station Staff", en: "They come every five minutes or so.", ko: "5분 정도마다 와요." },
                { speaker: "you", ko: "갈아타야 돼요?", hint: "Do I need to ~?",
                    answers: ["Do I need to transfer?", "Do I have to transfer?", "Do I need to change trains?", "Do I have to change trains?", "Do I need to change lines?", "Do I have to change lines?", "Do I need to switch lines?", "Is there a transfer?"] },
                { speaker: "partner", name: "Station Staff", en: "No, it's a direct line. City Hall is the sixth stop.", ko: "아니요, 한 번에 가요. 시청은 여섯 번째 역이에요." },
                { speaker: "you", ko: "여섯 번째 역이요? 알겠어요.", hint: "The sixth stop?",
                    answers: ["The sixth stop? Got it.", "Sixth stop? Got it.", "Six stops? Got it.", "The sixth stop? Okay.", "Six stops? Okay, thanks.", "Got it, the sixth stop.", "The sixth stop? Okay, got it."] },
                { speaker: "partner", name: "Station Staff", en: "And make sure you're on the right platform. Downtown trains leave from platform 2.", ko: "그리고 승강장 꼭 확인하세요. 다운타운행은 2번 승강장에서 출발해요." },
                { speaker: "you", ko: "2번 승강장이요. 감사합니다!", hint: "Platform ~",
                    answers: ["Platform 2. Thank you!", "Platform 2. Thanks!", "Platform 2, got it. Thanks!", "Okay, platform 2. Thank you!", "Got it, platform 2. Thanks!", "Platform number 2. Thank you!"] }
            ]
        },
        {
            id: "s3",
            title: "버스 타고 이동",
            setting: "시청에서 볼일을 마치고, 미술관에 가려고 버스에 올라탄다",
            lines: [
                { speaker: "partner", name: "Bus Driver", en: "Hop on! Where are you going?", ko: "타세요! 어디 가세요?" },
                { speaker: "you", ko: "이 버스 미술관 가요?", hint: "Does this bus ~?",
                    answers: ["Does this bus go to the art museum?", "Does this bus stop at the art museum?", "Is this the bus to the art museum?", "Is this bus going to the art museum?", "Does this go to the art museum?", "Does this bus go to the museum?"] },
                { speaker: "partner", name: "Bus Driver", en: "Yep. It's about 20 minutes from here.", ko: "네. 여기서 20분쯤 걸려요." },
                { speaker: "you", ko: "요금이 얼마예요?", hint: "How much ~?",
                    answers: ["How much is the fare?", "What's the fare?", "How much is it?", "How much does it cost?", "How much do I pay?", "How much is a ticket?"] },
                { speaker: "partner", name: "Bus Driver", en: "Two seventy-five. You can tap your card right here.", ko: "2달러 75센트요. 여기 카드 대시면 돼요." },
                { speaker: "you", ko: "도착하면 좀 알려 주실 수 있어요?", hint: "let me know when ~",
                    answers: ["Could you let me know when we get there?", "Can you let me know when we get there?", "Could you tell me when we get there?", "Can you tell me when we get there?", "Could you tell me when to get off?", "Can you tell me when to get off?", "Could you let me know when to get off?"] },
                { speaker: "partner", name: "Bus Driver", en: "Sure. Just take a seat... Hmm, sorry, folks. There's a lot of traffic today.", ko: "그럼요. 앉아 계세요... 음, 여러분 죄송해요. 오늘 차가 많이 막히네요." },
                { speaker: "you", ko: "얼마나 더 걸릴까요?", hint: "How much longer ~?",
                    answers: ["How much longer will it take?", "How much longer?", "How much longer is it?", "How much longer do you think?", "How much more time will it take?", "How long will it take now?"] },
                { speaker: "partner", name: "Bus Driver", en: "Maybe ten more minutes. Or you can get off here and walk. It's close.", ko: "10분 정도 더요. 아니면 여기서 내려서 걸어가셔도 돼요. 가까워요." },
                { speaker: "you", ko: "그럼 여기서 내릴게요. 어느 쪽으로 가요?", hint: "Which way ~?",
                    answers: ["Then I'll get off here. Which way do I go?", "Then I'll get off here. Which way is it?", "I'll get off here, then. Which way is it?", "Okay, I'll get off here. Which way should I go?", "I'll just get off here. Which direction is it?", "Then I'll get off here. Which way should I go?"] },
                { speaker: "partner", name: "Bus Driver", en: "Cross the street and walk one block. It's on your right.", ko: "길 건너서 한 블록 걸어가세요. 오른쪽에 있어요." },
                { speaker: "you", ko: "알겠어요. 감사합니다, 좋은 하루 보내세요!", hint: "Have a ~ day!",
                    answers: ["Got it. Thanks, have a good day!", "Got it. Thank you, have a nice day!", "Okay, thank you! Have a good day!", "Thanks so much! Have a great day!", "Got it, thanks! Have a good one!", "Thank you! Have a nice day!"] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "실례지만, 버스 정류장이 어디예요?", answers: ["Excuse me, where's the bus stop?", "Excuse me, where is the bus stop?", "Excuse me, how do I get to the bus stop?", "Excuse me, is there a bus stop near here?", "Excuse me, where can I find the bus stop?", "Sorry, where's the bus stop?"] },
        { type: "translate", ko: "공항까지 얼마나 걸려요?", answers: ["How long does it take to get to the airport?", "How long does it take to the airport?", "How long will it take to get to the airport?", "How long to the airport?", "How long is it to the airport?"] },
        { type: "translate", ko: "어디서 갈아타야 돼요?", answers: ["Where do I transfer?", "Where should I transfer?", "Where do I need to transfer?", "Where do I have to transfer?", "Where do I change trains?", "Where do I change lines?", "Where should I change trains?"] },
        { type: "translate", ko: "저 다음 정거장에서 내려요.", answers: ["I'm getting off at the next stop.", "I'll get off at the next stop.", "I get off at the next stop.", "I'm getting off at the next one.", "I need to get off at the next stop."] },
        { type: "blank", en: "Go straight and turn ___ at the bank.", ko: "직진하다가 은행에서 왼쪽으로 도세요.", answers: ["left"] },
        { type: "blank", en: "Does this bus ___ to the airport?", ko: "이 버스 공항 가요?", answers: ["go"] },
        { type: "blank", en: "Which ___ should I take?", ko: "몇 호선 타야 돼요?", answers: ["line", "train"] },
        { type: "arrange", ko: "걸어서 얼마나 걸려요?", answers: ["How long does it take to walk?"] },
        { type: "arrange", ko: "시청에 어떻게 가요?", answers: ["How do I get to City Hall?"] },
        { type: "arrange", ko: "도착하면 알려 주세요.", answers: ["Please tell me when we get there."] }
    ]
});
