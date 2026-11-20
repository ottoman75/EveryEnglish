(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "small-talk",
    order: 8,
    title: "날씨와 주말 스몰토크",
    titleEn: "Small Talk",
    emoji: "☀️",
    level: "B1",
    gradient: ["#FDDB92", "#D1FDFF"],
    goal: "주말 이야기와 날씨로 가볍게 대화를 열고, 자연스럽게 다음 약속까지 이어간다",

    vocab: [
        { word: "go hiking", pos: "phr.", meaning: "하이킹(등산)하러 가다", example: "I went hiking with some friends.", exampleKo: "친구들이랑 하이킹 갔어요." },
        { word: "view", pos: "n.", meaning: "경치, 전망", example: "The view from the top was amazing.", exampleKo: "정상에서 본 경치가 정말 좋았어요." },
        { word: "jealous", pos: "adj.", meaning: "부러운", example: "I'm so jealous!", exampleKo: "너무 부럽다!" },
        { word: "stuck", pos: "adj.", meaning: "(어디에) 꼼짝 못 하는, 갇힌", example: "I was stuck at home all weekend.", exampleKo: "주말 내내 집에 박혀 있었어요." },
        { word: "forecast", pos: "n.", meaning: "(일기)예보", example: "Have you checked the forecast?", exampleKo: "일기예보 확인해 봤어요?" },
        { word: "be supposed to", pos: "phr.", meaning: "~할 거라고 한다, ~하기로 되어 있다", example: "It's supposed to rain all weekend.", exampleKo: "주말 내내 비가 온대요." },
        { word: "postpone", pos: "v.", meaning: "미루다, 연기하다", example: "We'll probably postpone it to next week.", exampleKo: "아마 다음 주로 미룰 것 같아요." },
        { word: "clear up", pos: "phr. v.", meaning: "(날씨가) 개다", example: "Hopefully it clears up by then.", exampleKo: "그때까지는 날이 개면 좋겠네요." },
        { word: "unpredictable", pos: "adj.", meaning: "예측할 수 없는, 오락가락하는", example: "The weather has been so unpredictable lately.", exampleKo: "요즘 날씨가 너무 오락가락해요." },
        { word: "check out", pos: "phr. v.", meaning: "가 보다, 구경하다", example: "You should check it out.", exampleKo: "한번 가 봐요." }
    ],

    expressions: [
        { en: "How was your ~?", ko: "~ 어땠어요?", note: "스몰토크를 여는 가장 무난한 질문. 월요일엔 거의 인사말이다", example: "How was your weekend?" },
        { en: "Tell me about it.", ko: "그러니까요. (완전 공감)", note: "'얘기해 줘'가 아니라 '내 말이!'라는 맞장구", example: "Tell me about it. It's freezing today." },
        { en: "I heard it's supposed to ~.", ko: "~한다던데요.", note: "어디서 들은 예보·소식을 전할 때", example: "I heard it's supposed to rain all weekend." },
        { en: "I was going to ~.", ko: "~하려고 했는데요.", note: "계획이 틀어졌을 때. 뒤에 'but ~'이 생략된 느낌", example: "I was going to have a barbecue." },
        { en: "If it ~, I'll ~.", ko: "~하면 ~할 거예요.", note: "날씨에 따라 달라지는 계획. if절은 현재형", example: "If it's nice, I'll go biking." },
        { en: "I haven't ~ yet.", ko: "아직 ~ 안 해 봤어요.", note: "현재완료로 '아직 경험 없음'을 말할 때", example: "I haven't tried it yet." }
    ],

    dialogues: [
        {
            id: "s1",
            title: "월요일 아침 인사",
            setting: "월요일 아침, 사무실 탕비실에서 동료 Jessica와 마주쳤다",
            lines: [
                { speaker: "partner", name: "Jessica", en: "Morning, Minsu! How was your weekend?", ko: "좋은 아침이에요, 민수 씨! 주말 어땠어요?" },
                { speaker: "you", ko: "좋았어요. 친구들이랑 하이킹 갔어요.", hint: "I went ~ with ~.",
                    answers: ["It was good. I went hiking with some friends.", "It was great. I went hiking with some friends.", "It was good. I went hiking with friends.", "It was nice. I went hiking with my friends.", "Pretty good. I went hiking with some friends.", "Good! I went hiking with friends.", "It was good. I went hiking with my friends."] },
                { speaker: "partner", name: "Jessica", en: "Oh, nice! Where did you go?", ko: "오, 좋네요! 어디로 갔어요?" },
                { speaker: "you", ko: "그냥 근처 산이요. 경치가 정말 좋았어요.", hint: "The view was ~.",
                    answers: ["Just a mountain nearby. The view was amazing.", "Just a mountain nearby. The view was great.", "A mountain nearby. The view was amazing.", "Just a mountain near my place. The view was amazing.", "I went to a mountain nearby. The view was amazing.", "A mountain close by. The view was beautiful.", "Just a mountain nearby. The view was beautiful.", "Just a mountain nearby. The view was incredible."] },
                { speaker: "partner", name: "Jessica", en: "Sounds fun. The weather was perfect for it, too.", ko: "재밌었겠다. 날씨도 딱 좋았잖아요." },
                { speaker: "you", ko: "맞아요, 날씨가 정말 좋았어요.", hint: "the weather was ~",
                    answers: ["Yeah, the weather was really nice.", "Yeah, the weather was perfect.", "Yes, the weather was really nice.", "Yeah, the weather was so nice.", "Yeah, it was really nice out.", "Yeah, it was beautiful out.", "Totally, the weather was great.", "Right, the weather was really nice."] },
                { speaker: "partner", name: "Jessica", en: "I'm so jealous. I was stuck at home doing laundry all weekend.", ko: "너무 부럽다. 저는 주말 내내 집에서 빨래만 했어요." },
                { speaker: "you", ko: "그래도 집에서 쉬는 것도 좋잖아요.", hint: "~ is nice too.",
                    answers: ["Well, relaxing at home is nice too.", "Relaxing at home is nice too.", "Hey, relaxing at home is nice too.", "Well, it's nice to relax at home too.", "Well, it's good to relax at home too.", "Resting at home is nice too.", "Well, staying home and relaxing is nice too."] },
                { speaker: "partner", name: "Jessica", en: "True. Honestly, it was kind of nice.", ko: "맞아요. 솔직히 좀 좋긴 했어요." },
                { speaker: "you", ko: "근데 주말이 너무 빨리 지나갔어요.", hint: "~ went by so fast.",
                    answers: ["But the weekend went by so fast.", "But the weekend went by too fast.", "But the weekend went by so quickly.", "But the weekend flew by.", "Yeah, but the weekend went by so fast.", "Right, but the weekend went by way too fast.", "But weekends always go by so fast."] },
                { speaker: "partner", name: "Jessica", en: "Tell me about it. Anyway, I've got a meeting. Talk later?", ko: "그러니까요. 아무튼 저 회의 있어서요. 이따 얘기해요?" },
                { speaker: "you", ko: "네, 이따 점심때 봐요.", hint: "See you at ~.",
                    answers: ["Sure, see you at lunch!", "Sure, see you at lunch.", "Okay, see you at lunch!", "Yeah, see you at lunch.", "Sounds good. See you at lunch!", "Sure, talk to you at lunch.", "Sure, catch you at lunch!"] }
            ]
        },
        {
            id: "s2",
            title: "갑자기 쏟아진 비",
            setting: "목요일 저녁, 아파트 엘리베이터에서 이웃 Mark를 만났다. 밖에는 비가 쏟아진다",
            lines: [
                { speaker: "partner", name: "Mark", en: "Crazy weather today, huh? It was sunny this morning.", ko: "오늘 날씨 장난 아니죠? 아침엔 맑았는데." },
                { speaker: "you", ko: "그러니까요. 우산도 안 가져왔어요.", hint: "Tell me about it.",
                    answers: ["Tell me about it. I didn't bring an umbrella.", "Tell me about it. I didn't bring my umbrella.", "I know! I didn't bring an umbrella.", "I know, right? I didn't bring an umbrella.", "Right? I didn't bring an umbrella.", "I know. I forgot my umbrella.", "Tell me about it. I forgot my umbrella."] },
                { speaker: "partner", name: "Mark", en: "Oh no. I heard it's supposed to rain all weekend, too.", ko: "저런. 주말 내내 비 온다던데요." },
                { speaker: "you", ko: "정말요? 일기예보를 아직 확인 못 했어요.", hint: "I haven't checked ~.",
                    answers: ["Really? I haven't checked the forecast yet.", "Really? I haven't checked the forecast.", "Really? I haven't checked the weather forecast.", "Really? I haven't seen the forecast yet.", "Seriously? I didn't check the forecast.", "Oh, really? I didn't check the forecast.", "Really? I haven't checked the weather yet."] },
                { speaker: "partner", name: "Mark", en: "Yeah, heavy rain on Saturday. Did you have plans?", ko: "네, 토요일에 비가 많이 온대요. 계획 있었어요?" },
                { speaker: "you", ko: "토요일에 바비큐 하려고 했는데요.", hint: "I was going to ~.",
                    answers: ["I was going to have a barbecue on Saturday.", "I was planning to have a barbecue on Saturday.", "I was going to have a BBQ on Saturday.", "I was gonna have a barbecue on Saturday.", "We were going to have a barbecue on Saturday.", "I was planning a barbecue on Saturday.", "I was going to have a barbecue Saturday."] },
                { speaker: "partner", name: "Mark", en: "Ugh, that's too bad. Could you move it inside?", ko: "아, 아쉽네요. 실내에서 하면 안 돼요?" },
                { speaker: "you", ko: "비 오면 아마 다음 주로 미룰 것 같아요.", hint: "If it rains, ~.",
                    answers: ["If it rains, I'll probably postpone it to next week.", "If it rains, I'll probably postpone it.", "If it rains, I'll probably push it to next week.", "If it rains, I'll probably move it to next week.", "If it rains, we'll probably postpone it to next week.", "If it rains, I'll probably do it next week.", "If it rains, I think I'll postpone it.", "If it rains, I'll push it back a week."] },
                { speaker: "partner", name: "Mark", en: "Good idea. Hopefully it clears up by then.", ko: "좋은 생각이에요. 그때까지는 날이 개면 좋겠네요." },
                { speaker: "you", ko: "그러길 바라요. 요즘 날씨가 너무 오락가락하네요.", hint: "The weather has been ~.",
                    answers: ["I hope so. The weather has been so unpredictable lately.", "I hope so. The weather has been really unpredictable lately.", "I hope so. The weather has been so weird lately.", "I hope so. The weather has been crazy lately.", "I hope so. The weather's been so unpredictable lately.", "I hope so. The weather's been crazy lately.", "Hopefully. The weather has been so unpredictable lately.", "Me too. The weather has been so unpredictable."] }
            ]
        },
        {
            id: "s3",
            title: "주말 계획과 다음 약속",
            setting: "금요일 퇴근길, 엘리베이터에서 다시 만난 동료 Jessica",
            lines: [
                { speaker: "partner", name: "Jessica", en: "Any plans for the weekend, Minsu?", ko: "민수 씨, 주말에 뭐 해요?" },
                { speaker: "you", ko: "아직 없어요. 날씨 좋으면 자전거 타려고요.", hint: "If it's nice, ~.",
                    answers: ["Not yet. If it's nice, I'll go biking.", "Not yet. If it's nice, I might go biking.", "Nothing yet. If it's nice, I'll go biking.", "No plans yet. If it's nice, I'll go biking.", "Not yet. If it's nice out, I'll go biking.", "Not yet. If the weather is nice, I'll go biking.", "Not yet. If the weather's nice, I'll go biking.", "Not yet. If it's nice, I'll ride my bike.", "Not yet. If it's nice, I'll go cycling."] },
                { speaker: "partner", name: "Jessica", en: "Nice. Have you tried the bike trail along the river?", ko: "좋네요. 강변 자전거 길 가 봤어요?" },
                { speaker: "you", ko: "아니요, 아직 안 가 봤어요. 어때요?", hint: "I haven't ~ yet.",
                    answers: ["No, I haven't tried it yet. How is it?", "No, I haven't been there yet. How is it?", "No, I haven't tried it yet. Is it good?", "No, I haven't been yet. How is it?", "No, not yet. How is it?", "Not yet. How is it?", "No, I haven't. Is it nice?", "No, I haven't. How is it?"] },
                { speaker: "partner", name: "Jessica", en: "It's gorgeous, especially this time of year. You should check it out.", ko: "엄청 예뻐요, 특히 요즘 같은 때는요. 꼭 가 봐요." },
                { speaker: "you", ko: "좋네요. 언제 같이 가실래요?", hint: "Do you want to ~?",
                    answers: ["Sounds great. Do you want to go together sometime?", "Sounds good. Do you want to go together sometime?", "Nice. Want to go together sometime?", "Sounds great. Wanna go together sometime?", "Sounds good. Do you want to come with me sometime?", "Cool. Would you like to go together sometime?", "Sounds great. We should go together sometime.", "Sounds great. Want to come with me sometime?"] },
                { speaker: "partner", name: "Jessica", en: "Sure, I'd love to! Let me know when you're free.", ko: "좋아요, 저야 좋죠! 시간 될 때 알려 줘요." },
                { speaker: "you", ko: "좋아요, 이번 주말에 문자할게요.", hint: "I'll text you ~.",
                    answers: ["Great, I'll text you this weekend.", "Okay, I'll text you this weekend.", "Sounds good. I'll text you this weekend.", "Perfect, I'll text you this weekend.", "Cool, I'll text you over the weekend.", "Great, I'll message you this weekend.", "Okay, I'll send you a text this weekend."] },
                { speaker: "partner", name: "Jessica", en: "Perfect. Well, have a good weekend!", ko: "좋아요. 그럼 주말 잘 보내요!" },
                { speaker: "you", ko: "주말 잘 보내요! 월요일에 봐요.", hint: "You too. See you ~.",
                    answers: ["You too! See you on Monday.", "You too! See you Monday.", "Thanks, you too! See you Monday.", "You too. See you on Monday!", "Have a good one! See you Monday.", "Have a great weekend! See you Monday.", "You too! See you next week."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "주말 어땠어요?", answers: ["How was your weekend?", "How was the weekend?", "How did your weekend go?", "Did you have a good weekend?", "Did you have a nice weekend?"] },
        { type: "translate", ko: "이번 주말에 비 온다던데요.", answers: ["I heard it's supposed to rain this weekend.", "I heard it's going to rain this weekend.", "I heard it's gonna rain this weekend.", "I heard it will rain this weekend.", "It's supposed to rain this weekend.", "Apparently it's going to rain this weekend.", "They say it's going to rain this weekend."] },
        { type: "translate", ko: "그 영화 아직 안 봤어요.", answers: ["I haven't seen that movie yet.", "I haven't seen the movie yet.", "I haven't watched that movie yet.", "I haven't watched the movie yet.", "I haven't seen it yet."] },
        { type: "translate", ko: "날씨 좋으면 공원에 갈 거예요.", answers: ["If it's nice, I'll go to the park.", "If the weather is nice, I'll go to the park.", "If the weather's nice, I'll go to the park.", "If it's nice out, I'll go to the park.", "If the weather is good, I'll go to the park.", "If it's nice, I'm going to go to the park.", "If the weather is nice, I'm going to the park."] },
        { type: "blank", en: "I was ___ to have a barbecue.", ko: "바비큐 하려고 했는데요.", answers: ["going", "planning"] },
        { type: "blank", en: "Hopefully it ___ up by Saturday.", ko: "토요일까지는 날이 개면 좋겠네요.", answers: ["clears"] },
        { type: "blank", en: "I haven't checked the ___ yet.", ko: "아직 일기예보 확인 안 했어요.", answers: ["forecast", "weather"] },
        { type: "arrange", ko: "정상에서 본 경치가 정말 좋았어요.", answers: ["The view from the top was amazing."] },
        { type: "arrange", ko: "다음 주로 미루는 게 좋겠어요.", answers: ["We should postpone it to next week."] },
        { type: "arrange", ko: "언제 같이 가요.", answers: ["We should go together sometime."] }
    ]
});
