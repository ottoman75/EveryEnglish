(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "making-plans",
    order: 11,
    title: "친구와 약속 잡기",
    titleEn: "Making Plans",
    emoji: "🎉",
    level: "A2",
    gradient: ["#FF9A9E", "#FECFEF"],
    goal: "약속을 제안하고, 일정을 바꾸고, 늦을 때 연락까지 자연스럽게 한다",

    vocab: [
        { word: "free", pos: "adj.", meaning: "(시간이) 비는, 한가한", example: "Are you free this Saturday?", exampleKo: "이번 주 토요일에 시간 돼?" },
        { word: "hang out", pos: "phr. v.", meaning: "같이 놀다, 어울리다", example: "Do you want to hang out this weekend?", exampleKo: "이번 주말에 같이 놀래?" },
        { word: "grab", pos: "v.", meaning: "(간단히) 먹다, 마시다", example: "Let's grab dinner after work.", exampleKo: "퇴근하고 저녁 먹자." },
        { word: "work for", pos: "phr.", meaning: "(일정이) ~에게 괜찮다", example: "Does 7 work for you?", exampleKo: "7시 괜찮아?" },
        { word: "plans", pos: "n.", meaning: "약속, 계획", example: "I don't have any plans yet.", exampleKo: "아직 약속 없어." },
        { word: "reschedule", pos: "v.", meaning: "일정을 다시 잡다", example: "Do you want to reschedule?", exampleKo: "다른 날로 다시 잡을까?" },
        { word: "rain check", pos: "n.", meaning: "다음 기회(로 미루기)", example: "Can I take a rain check?", exampleKo: "다음에 해도 될까?" },
        { word: "meet up", pos: "phr. v.", meaning: "(약속하고) 만나다", example: "Where should we meet up?", exampleKo: "어디서 만날까?" },
        { word: "running late", pos: "phr.", meaning: "늦어지고 있는", example: "Sorry, I'm running a little late.", exampleKo: "미안, 좀 늦을 것 같아." },
        { word: "sounds good", pos: "phr.", meaning: "좋아, 그러자", example: "Sounds good. See you then!", exampleKo: "좋아. 그때 봐!" }
    ],

    expressions: [
        { en: "Are you free ~?", ko: "~ 시간 돼?", note: "약속을 꺼낼 때 가장 먼저 쓰는 말. 'Do you have time?'보다 가볍고 자연스럽다", example: "Are you free on Friday night?" },
        { en: "Do you want to ~?", ko: "~할래?", note: "친구 사이 제안. 말할 때는 'wanna'로 줄여 발음하는 경우가 많다", example: "Do you want to grab lunch?" },
        { en: "How about ~?", ko: "~는 어때?", note: "장소·시간을 제안할 때. 뒤에 명사나 -ing가 온다", example: "How about next Friday?" },
        { en: "Does ~ work for you?", ko: "~ 괜찮아?", note: "상대 일정에 맞는지 물을 때. 대답은 '~ works (for me).'", example: "Does 7 work for you?" },
        { en: "Can I take a rain check?", ko: "다음에 해도 될까?", note: "거절이 아니라 '다음으로 미루자'는 뜻. 부드럽게 약속을 미룰 때", example: "Sorry, can I take a rain check on dinner?" },
        { en: "Sounds good. / Sounds like a plan.", ko: "좋아. / 그렇게 하자.", note: "제안을 받아들이거나 약속을 확정할 때", example: "Friday at 7? Sounds like a plan." }
    ],

    dialogues: [
        {
            id: "s1",
            title: "약속 제안하기",
            setting: "금요일 점심시간, 친구 Jake에게 전화를 건다",
            lines: [
                { speaker: "partner", name: "Jake", en: "Hey Minsu! What's up?", ko: "어, 민수! 무슨 일이야?" },
                { speaker: "you", ko: "이번 주 토요일에 시간 돼?", hint: "Are you free ~?",
                    answers: ["Are you free this Saturday?", "Are you free on Saturday?", "Are you free Saturday?", "Hey, are you free this Saturday?", "Do you have time this Saturday?", "Are you busy this Saturday?"] },
                { speaker: "partner", name: "Jake", en: "I think so. I don't have any plans yet. Do you want to hang out?", ko: "아마 될걸. 아직 약속 없어. 같이 놀까?" },
                { speaker: "you", ko: "응, 저녁 같이 먹을래?", hint: "Do you want to ~?",
                    answers: ["Yeah, do you want to grab dinner?", "Yeah, do you want to get dinner?", "Yeah, do you wanna grab dinner?", "Yes, do you want to have dinner together?", "Yeah, want to grab dinner?", "Do you want to grab dinner?", "Yeah, let's grab dinner.", "Yeah, do you want to grab dinner together?"] },
                { speaker: "partner", name: "Jake", en: "Sure, I'd love to. Where do you want to go?", ko: "좋지. 어디 갈래?" },
                { speaker: "you", ko: "새로 생긴 태국 식당 어때?", hint: "How about ~?",
                    answers: ["How about the new Thai place?", "How about that new Thai place?", "How about the new Thai restaurant?", "How about that new Thai restaurant?", "What about the new Thai place?", "What about the new Thai restaurant?"] },
                { speaker: "partner", name: "Jake", en: "Oh, I've heard good things about it. What time?", ko: "오, 거기 괜찮다던데. 몇 시에?" },
                { speaker: "you", ko: "7시 괜찮아?", hint: "Does ~ work for you?",
                    answers: ["Does 7 work for you?", "Does 7 o'clock work for you?", "Does 7 work?", "Is 7 okay?", "Is 7 okay for you?", "Is 7 good for you?", "How about 7?", "How about 7 o'clock?"] },
                { speaker: "partner", name: "Jake", en: "7 works for me. Should I invite Sarah too?", ko: "7시 좋아. 사라도 부를까?" },
                { speaker: "you", ko: "좋지, 사라도 불러.", hint: "Sure, invite ~",
                    answers: ["Sure, invite Sarah too.", "Sure, invite her too.", "Sure, invite her.", "Yeah, invite her too.", "Sounds good, invite her too.", "Sure, ask her too.", "Yeah, ask Sarah too.", "Sure, the more the merrier.", "Invite Sarah too.", "Invite her too.", "Invite her.", "Ask her too.", "Ask Sarah too."] },
                { speaker: "partner", name: "Jake", en: "Great. See you Saturday!", ko: "좋아. 토요일에 봐!" },
                { speaker: "you", ko: "응, 토요일에 봐!", hint: "See you ~",
                    answers: ["See you Saturday!", "See you on Saturday!", "Okay, see you Saturday!", "Yeah, see you Saturday!", "See you then!", "Sounds good. See you Saturday!"] }
            ]
        },
        {
            id: "s2",
            title: "약속 미루기",
            setting: "토요일 오후, 갑자기 회사 일이 생겨 Jake에게 다시 전화한다",
            lines: [
                { speaker: "partner", name: "Jake", en: "Hey! Are we still on for tonight?", ko: "어! 오늘 저녁 약속 그대로지?" },
                { speaker: "you", ko: "미안, 오늘 못 갈 것 같아.", hint: "I don't think ~",
                    answers: ["Sorry, I don't think I can make it tonight.", "Sorry, I can't make it tonight.", "I'm sorry, I don't think I can make it tonight.", "Sorry, I don't think I can make it.", "Sorry, I don't think I can go tonight.", "Sorry, I can't go tonight.", "Sorry, I don't think I can come tonight."] },
                { speaker: "partner", name: "Jake", en: "Oh no. Is everything okay?", ko: "아이고. 별일 없지?" },
                { speaker: "you", ko: "응, 갑자기 회사 일이 생겼어.", hint: "Something came up ~",
                    answers: ["Yeah, something came up at work.", "Yes, something came up at work.", "Yeah, something came up.", "Yeah, something just came up at work.", "Yeah, I suddenly have to work.", "Yeah, I have to work tonight.", "Something came up."] },
                { speaker: "partner", name: "Jake", en: "That's too bad. Do you want to reschedule?", ko: "아쉽다. 다른 날로 다시 잡을까?" },
                { speaker: "you", ko: "응, 다음으로 미뤄도 될까?", hint: "take a rain check",
                    answers: ["Yeah, can I take a rain check?", "Yes, can I take a rain check?", "Can I take a rain check?", "Yeah, can we do it another time?", "Can we do it another time?", "Yeah, let's reschedule.", "Yeah, can we reschedule?", "Yeah, can we do it some other time?", "Let's reschedule.", "Can we reschedule?"] },
                { speaker: "partner", name: "Jake", en: "Of course. When are you free next week?", ko: "당연하지. 다음 주엔 언제 시간 돼?" },
                { speaker: "you", ko: "다음 주 금요일은 어때?", hint: "How about ~?",
                    answers: ["How about next Friday?", "What about next Friday?", "How about Friday next week?", "How about next Friday night?", "Does next Friday work for you?", "Is next Friday okay?", "Next Friday?"] },
                { speaker: "partner", name: "Jake", en: "Friday works for me. Should we meet up at the same time?", ko: "금요일 좋아. 같은 시간에 만날까?" },
                { speaker: "you", ko: "응, 같은 시간에 같은 데서 보자.", hint: "Same time, ~",
                    answers: ["Yeah, same time, same place.", "Yes, same time, same place.", "Sure, same time, same place.", "Same time, same place.", "Yeah, same time and same place.", "Sounds good. Same time, same place.", "Yeah, let's meet at the same time and place."] },
                { speaker: "partner", name: "Jake", en: "Sounds like a plan. I'll tell Sarah.", ko: "그렇게 하자. 사라한테는 내가 말할게." },
                { speaker: "you", ko: "이해해 줘서 고마워.", hint: "Thanks for ~",
                    answers: ["Thanks for understanding.", "Thank you for understanding.", "Thanks for being so understanding.", "Thanks for understanding. Sorry again.", "Thanks, and sorry again."] }
            ]
        },
        {
            id: "s3",
            title: "늦을 때 연락하기",
            setting: "다음 주 금요일 저녁, 약속 장소로 가는 지하철 안",
            lines: [
                { speaker: "partner", name: "Jake", en: "Hey, I'm here. Where are you?", ko: "야, 나 도착했어. 어디야?" },
                { speaker: "you", ko: "미안, 좀 늦을 것 같아.", hint: "I'm running ~",
                    answers: ["Sorry, I'm running a little late.", "Sorry, I'm running late.", "Sorry, I'm running a bit late.", "Sorry, I'm going to be a little late.", "Sorry, I'm gonna be a little late.", "Sorry, I'll be a little late.", "Sorry, I'll be a bit late.", "Sorry, I think I'll be a little late."] },
                { speaker: "partner", name: "Jake", en: "No worries. How long will you be?", ko: "괜찮아. 얼마나 걸려?" },
                { speaker: "you", ko: "10분 정도 걸려.", hint: "About ~ minutes",
                    answers: ["About 10 minutes.", "Around 10 minutes.", "Maybe 10 minutes.", "Like 10 minutes.", "10 minutes or so.", "I'll be there in about 10 minutes.", "I'll be there in 10 minutes.", "About 10 more minutes."] },
                { speaker: "partner", name: "Jake", en: "Okay. Should I go ahead and get a table?", ko: "알았어. 먼저 자리 잡고 있을까?" },
                { speaker: "you", ko: "응, 먼저 들어가 있어.", hint: "Go ahead",
                    answers: ["Yeah, go ahead.", "Yes, go ahead.", "Yeah, go ahead and get a table.", "Sure, go ahead and get a table.", "Yeah, you can go in first.", "Yeah, go ahead and go in.", "Yes, please get a table.", "Go ahead."] },
                { speaker: "partner", name: "Jake", en: "Got it. Sarah's here too. Do you want us to order for you?", ko: "알았어. 사라도 왔어. 네 것도 시켜 줄까?" },
                { speaker: "you", ko: "응, 팟타이 시켜 줘.", hint: "Can you order ~?",
                    answers: ["Yeah, can you order pad thai for me?", "Yeah, can you order me pad thai?", "Yeah, can you get me pad thai?", "Yeah, can you get me the pad thai?", "Yes, can you order the pad thai for me?", "Could you order pad thai for me?", "Yeah, get me the pad thai.", "Sure, pad thai, please.", "Pad thai, please."] },
                { speaker: "partner", name: "Jake", en: "Pad thai it is. See you soon!", ko: "팟타이 알겠어. 이따 봐!" },
                { speaker: "you", ko: "고마워, 금방 갈게!", hint: "I'll be there ~",
                    answers: ["Thanks, I'll be there soon!", "Thank you, I'll be there soon!", "Thanks! I'll be right there.", "Thanks, I'll be there in a bit!", "Thanks, be there soon!", "Thanks, see you soon!"] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "이번 주 금요일에 시간 돼?", answers: ["Are you free this Friday?", "Are you free on Friday?", "Are you free Friday?", "Do you have time this Friday?", "Are you free on Friday this week?"] },
        { type: "translate", ko: "다음에 해도 될까?", answers: ["Can I take a rain check?", "Could I take a rain check?", "Can we do it another time?", "Can we do it some other time?", "Can we do this another time?", "Can we reschedule?"] },
        { type: "translate", ko: "7시 괜찮아?", answers: ["Does 7 work for you?", "Does 7 o'clock work for you?", "Does 7 work?", "Is 7 okay?", "Is 7 okay for you?", "Is 7 good for you?", "Is 7 o'clock okay?"] },
        { type: "translate", ko: "조금 늦을 것 같아.", answers: ["I'm running a little late.", "I'm running a bit late.", "I'm running late.", "I'm going to be a little late.", "I'm gonna be a little late.", "I'll be a little late.", "I'll be a bit late.", "I think I'll be a little late."] },
        { type: "blank", en: "Do you want to ___ dinner?", ko: "저녁 먹을래?", answers: ["grab", "get", "have"] },
        { type: "blank", en: "Does Friday ___ for you?", ko: "금요일 괜찮아?", answers: ["work"] },
        { type: "blank", en: "Sorry, something came ___ at work.", ko: "미안, 회사에 갑자기 일이 생겼어.", answers: ["up"] },
        { type: "arrange", ko: "새로 생긴 태국 식당 어때?", answers: ["How about the new Thai place?", "How about the new Thai restaurant?"] },
        { type: "arrange", ko: "토요일에 같이 놀래?", answers: ["Do you want to hang out on Saturday?", "Do you want to hang out Saturday?"] },
        { type: "arrange", ko: "좋아. 그때 보자.", answers: ["Sounds good. See you then.", "Sounds good, see you then."] }
    ]
});
