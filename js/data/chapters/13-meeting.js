(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "meeting",
    order: 13,
    title: "회의에서 의견 말하기",
    titleEn: "Speaking Up in Meetings",
    emoji: "📊",
    level: "B1",
    gradient: ["#5EE7DF", "#B490CA"],
    goal: "회의에서 의견을 내고, 정중하게 반대하고, 할 일을 정리해 맡는다",

    vocab: [
        { word: "agenda", pos: "n.", meaning: "(회의) 안건", example: "First on the agenda is the app launch.", exampleKo: "첫 번째 안건은 앱 출시입니다." },
        { word: "push back", pos: "phr. v.", meaning: "(일정을) 미루다", example: "I think we should push the launch back.", exampleKo: "출시를 미루는 게 좋을 것 같아요." },
        { word: "point", pos: "n.", meaning: "요점, 지적", example: "That's a good point.", exampleKo: "좋은 지적이에요." },
        { word: "budget", pos: "n.", meaning: "예산", example: "We can stay within budget.", exampleKo: "예산 안에서 할 수 있어요." },
        { word: "disagree", pos: "v.", meaning: "반대하다, 의견이 다르다", example: "Honestly, I disagree.", exampleKo: "솔직히 저는 생각이 달라요." },
        { word: "concern", pos: "n.", meaning: "우려, 걱정", example: "My concern is the first reviews.", exampleKo: "제가 걱정하는 건 초기 리뷰예요." },
        { word: "suggest", pos: "v.", meaning: "제안하다", example: "Are you suggesting a beta?", exampleKo: "베타 버전을 제안하시는 거예요?" },
        { word: "follow up", pos: "phr. v.", meaning: "후속 연락하다, 챙기다", example: "I'll follow up with them by email.", exampleKo: "제가 메일로 후속 연락할게요." },
        { word: "action item", pos: "n.", meaning: "(회의 후) 할 일", example: "Can you send the action items to everyone?", exampleKo: "할 일 목록을 모두에게 보내 줄래요?" },
        { word: "on the same page", pos: "idiom", meaning: "같은 이해를 하고 있는", example: "Are we all on the same page?", exampleKo: "다들 같은 생각인 거죠?" }
    ],

    expressions: [
        { en: "I think we should ~.", ko: "~하는 게 좋을 것 같아요.", note: "의견을 단정하지 않고 부드럽게 내는 기본형", example: "I think we should push the launch back." },
        { en: "That's a good point, but ~.", ko: "좋은 지적이에요. 그런데 ~", note: "상대 말을 먼저 인정하고 반대 의견을 꺼내는 쿠션 표현", example: "That's a good point, but quality matters more." },
        { en: "My concern is ~.", ko: "제가 걱정하는 건 ~예요.", note: "'I disagree'보다 덜 대립적. 문제를 구체적으로 짚는다", example: "My concern is the budget." },
        { en: "What if we ~?", ko: "~하면 어떨까요?", note: "대안을 제안할 때. 동사는 현재형으로 쓴다", example: "What if we show them a beta first?" },
        { en: "I'd like to hear ~.", ko: "~을 듣고 싶어요.", note: "다른 사람의 의견을 끌어낼 때. 뒤에 'what everyone thinks' 같은 간접의문문이 온다", example: "I'd like to hear what everyone thinks." },
        { en: "Are we all on the same page?", ko: "다들 같은 생각인 거죠?", note: "결정 사항을 확인할 때. 'Just to make sure we're on the same page'로 시작하기도 한다", example: "So we're delaying the launch. Are we all on the same page?" }
    ],

    dialogues: [
        {
            id: "s1",
            title: "의견 내기",
            setting: "월요일 오전 주간 팀 회의, 첫 안건은 신규 앱 출시 일정",
            lines: [
                { speaker: "partner", name: "Rachel", en: "Okay, first on the agenda is the app launch. Minsu, what do you think?", ko: "자, 첫 번째 안건은 앱 출시예요. 민수 씨는 어떻게 생각해요?" },
                { speaker: "you", ko: "출시를 2주 미루는 게 좋을 것 같아요.", hint: "I think we should ~",
                    answers: ["I think we should push the launch back two weeks.", "I think we should push the launch back by two weeks.", "I think we should push back the launch two weeks.", "I think we should delay the launch by two weeks.", "I think we should delay the launch two weeks.", "I think we should postpone the launch by two weeks.", "I think we should postpone the launch two weeks."] },
                { speaker: "partner", name: "Rachel", en: "Two weeks? Can you tell us why?", ko: "2주요? 이유를 말해 줄래요?" },
                { speaker: "you", ko: "아직 테스트가 안 끝났거든요.", hint: "We haven't ~ yet",
                    answers: ["We haven't finished testing yet.", "Because we haven't finished testing yet.", "We haven't finished the testing yet.", "We still haven't finished testing.", "We're not done with testing yet.", "Testing isn't finished yet.", "Testing isn't done yet."] },
                { speaker: "partner", name: "David", en: "But the marketing campaign is already scheduled.", ko: "그런데 마케팅 캠페인은 이미 일정이 잡혀 있잖아요." },
                { speaker: "you", ko: "좋은 지적이에요. 그래도 품질이 더 중요해요.", hint: "Good point, but ~",
                    answers: ["That's a good point, but quality is more important.", "That's a good point, but quality matters more.", "Good point, but quality is more important.", "Good point, but quality matters more.", "That's a fair point, but quality is more important.", "I see your point, but quality is more important.", "That's true, but quality is more important."] },
                { speaker: "partner", name: "Rachel", en: "Hmm. What about the budget? Would a delay cost us more?", ko: "음. 예산은요? 미루면 비용이 더 들까요?" },
                { speaker: "you", ko: "크게는 아니에요. 예산 안에서 할 수 있어요.", hint: "within budget",
                    answers: ["Not much. We can stay within budget.", "Not much. We can stay within the budget.", "Not much. We can still stay within budget.", "Not really. We can stay within budget.", "Not really. We can still stay within the budget.", "Not by much. We can stay within budget.", "Not much. We can do it within budget.", "Not much. It's still within budget."] },
                { speaker: "partner", name: "Rachel", en: "Okay, that makes sense. Anything else?", ko: "그렇군요, 이해돼요. 더 할 말 있어요?" },
                { speaker: "you", ko: "다른 분들 생각도 듣고 싶어요.", hint: "I'd like to hear ~",
                    answers: ["I'd like to hear what everyone else thinks.", "I'd like to hear what everyone thinks.", "I'd like to hear what others think.", "I'd love to hear what everyone else thinks.", "I'd love to hear what others think.", "I'm curious what everyone else thinks.", "What does everyone else think?", "What do the rest of you think?"] }
            ]
        },
        {
            id: "s2",
            title: "반대 의견과 대안",
            setting: "회의 중반, 동료 David가 다른 의견을 낸다",
            lines: [
                { speaker: "partner", name: "David", en: "Honestly, I disagree. I think we should launch on time and fix bugs later.", ko: "솔직히 저는 생각이 달라요. 일정대로 출시하고 버그는 나중에 고치는 게 낫다고 봐요." },
                { speaker: "you", ko: "무슨 말인지 알겠어요. 그런데 제가 걱정하는 건 초기 리뷰예요.", hint: "My concern is ~",
                    answers: ["I see what you mean. My concern is the first reviews.", "I see what you mean. My concern is the early reviews.", "I see your point. My concern is the early reviews.", "I understand. My concern is the first reviews.", "I get it, but my concern is the first reviews.", "I get that. My concern is the early reviews.", "I see what you mean, but I'm worried about early reviews."] },
                { speaker: "partner", name: "David", en: "Why are the first reviews so important?", ko: "초기 리뷰가 왜 그렇게 중요해요?" },
                { speaker: "you", ko: "나쁜 리뷰가 달리면 회복하기 어렵거든요.", hint: "If we get ~",
                    answers: ["If we get bad reviews, it's hard to recover.", "If we get bad reviews, it's really hard to recover.", "If we get bad reviews, it'll be hard to recover.", "If we get bad reviews early, it's hard to recover.", "It's hard to recover from bad reviews.", "It's really hard to recover from bad reviews.", "Bad reviews are hard to recover from."] },
                { speaker: "partner", name: "David", en: "Fair enough. But the client wants something by the end of the month.", ko: "그건 맞아요. 그래도 고객사는 월말까지 뭔가를 받고 싶어 해요." },
                { speaker: "you", ko: "그럼 베타 버전을 먼저 보여 주면 어떨까요?", hint: "What if we ~?",
                    answers: ["What if we show them a beta version first?", "Then what if we show them a beta version first?", "What if we show the client a beta version first?", "What if we give them a beta version first?", "What if we share a beta version with them first?", "How about showing them a beta version first?", "Why don't we show them a beta version first?"] },
                { speaker: "partner", name: "David", en: "Hmm, that could work. So you're suggesting a beta just for the client?", ko: "음, 그거 괜찮겠네요. 그러니까 고객사용 베타를 제안하는 거죠?" },
                { speaker: "you", ko: "맞아요. 그리고 피드백도 미리 받을 수 있고요.", hint: "And we can ~",
                    answers: ["Exactly. And we can get feedback early.", "Exactly. And we can get their feedback early.", "Exactly, and we can also get feedback early.", "Exactly. Plus, we can get feedback early.", "Right. And we can get early feedback.", "Right. Plus, we can get early feedback.", "Right, and we can get feedback in advance."] },
                { speaker: "partner", name: "Rachel", en: "I like that idea. How long would it take to get a beta ready?", ko: "좋은 생각이네요. 베타 준비하는 데 얼마나 걸릴까요?" },
                { speaker: "you", ko: "일주일 정도면 될 것 같아요.", hint: "It should take ~",
                    answers: ["It should take about a week.", "I think it would take about a week.", "I think it'll take about a week.", "It'll take about a week, I think.", "About a week, I think.", "I think about a week.", "Probably about a week.", "I think we need about a week."] }
            ]
        },
        {
            id: "s3",
            title: "정리와 할 일 나누기",
            setting: "회의 마무리, 결정 사항과 담당자를 정리한다",
            lines: [
                { speaker: "partner", name: "Rachel", en: "Great discussion, everyone. So, let's wrap up. What did we decide?", ko: "다들 좋은 논의였어요. 그럼 정리해 볼까요. 뭘 결정했죠?" },
                { speaker: "you", ko: "정리하면, 출시를 2주 미루는 거죠?", hint: "So, we're ~",
                    answers: ["So, we're pushing the launch back two weeks, right?", "So, we're pushing the launch back by two weeks, right?", "So, we're pushing the launch back two weeks?", "So we're pushing back the launch two weeks, right?", "So we're delaying the launch by two weeks, right?", "So, we're delaying the launch two weeks?", "So we're postponing the launch by two weeks?", "So, the launch is delayed by two weeks, right?"] },
                { speaker: "partner", name: "Rachel", en: "Right. And David will talk to the client about the beta. Are we all on the same page?", ko: "맞아요. 그리고 베타 건은 David가 고객사와 얘기하고요. 다들 같은 생각인 거죠?" },
                { speaker: "you", ko: "네, 저도 같은 생각이에요.", hint: "on the same page",
                    answers: ["Yes, I'm on the same page.", "Yeah, I'm on the same page.", "Yes, we're on the same page.", "Yes, I'm on board.", "Yeah, I'm on board.", "Yes, I agree.", "Yes, sounds good to me.", "Yes, I'm good with that.", "I agree."] },
                { speaker: "partner", name: "Rachel", en: "Great. Minsu, can you take care of the testing schedule?", ko: "좋아요. 민수 씨, 테스트 일정 좀 맡아 줄래요?" },
                { speaker: "you", ko: "네, 내일까지 업데이트된 일정 공유할게요.", hint: "I'll share ~",
                    answers: ["Sure, I'll share an updated schedule by tomorrow.", "Sure, I'll share the updated schedule by tomorrow.", "Yes, I'll share an updated schedule by tomorrow.", "Sure, I'll send the updated schedule by tomorrow.", "Sure, I'll send out an updated schedule by tomorrow.", "Sure. I'll share the new schedule by tomorrow.", "No problem. I'll share an updated schedule tomorrow."] },
                { speaker: "partner", name: "Rachel", en: "Perfect. Should we also invite the design team next time?", ko: "좋아요. 다음엔 디자인팀도 부를까요?" },
                { speaker: "you", ko: "좋은 생각이에요. 제가 메일로 연락해 둘게요.", hint: "I'll follow up ~",
                    answers: ["Good idea. I'll follow up with them by email.", "Great idea. I'll follow up with them by email.", "That's a good idea. I'll follow up with them.", "Good idea. I'll follow up with them.", "Good idea. I'll send them a follow-up email.", "Good idea. I'll email them.", "That's a great idea. I'll email them."] },
                { speaker: "partner", name: "Rachel", en: "Thanks. Can you also send the action items to everyone?", ko: "고마워요. 할 일 목록도 모두에게 보내 줄 수 있어요?" },
                { speaker: "you", ko: "물론이죠. 회의 끝나고 바로 보낼게요.", hint: "right after ~",
                    answers: ["Of course. I'll send them right after the meeting.", "Sure. I'll send them right after the meeting.", "Sure thing. I'll send them right after this meeting.", "No problem. I'll send them out right after the meeting.", "Of course. I'll send them after the meeting.", "Sure, I'll send them out after the meeting.", "Of course, right after the meeting."] },
                { speaker: "partner", name: "Rachel", en: "Thanks, everyone. Good meeting.", ko: "다들 고마워요. 좋은 회의였어요." },
                { speaker: "you", ko: "감사합니다, 다들 수고하셨어요.", hint: "Thanks, ~",
                    answers: ["Thanks, everyone.", "Thank you, everyone.", "Thanks, everyone. Great meeting.", "Thanks, good meeting.", "Thank you. Great meeting.", "Thanks, Rachel. Good meeting.", "Thanks, Rachel.", "Thanks, everyone. Good meeting."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "출시를 미루는 게 좋을 것 같아요.", answers: ["I think we should delay the launch.", "I think we should push the launch back.", "I think we should push back the launch.", "I think we should postpone the launch.", "I think it'd be better to delay the launch.", "We should probably delay the launch."] },
        { type: "translate", ko: "좋은 지적이에요. 그런데 시간이 부족해요.", answers: ["That's a good point, but we don't have enough time.", "Good point, but we don't have enough time.", "That's a good point, but there isn't enough time.", "Good point, but there's not enough time.", "That's a good point, but we're short on time.", "Good point, but we don't have time."] },
        { type: "translate", ko: "한 가지 덧붙여도 될까요?", answers: ["Can I add one thing?", "Can I add something?", "Can I add one more thing?", "Could I add one thing?", "Could I add something?", "May I add something?", "Can I just add one thing?"] },
        { type: "translate", ko: "제가 걱정하는 건 예산이에요.", answers: ["My concern is the budget.", "My main concern is the budget.", "I'm worried about the budget.", "I'm concerned about the budget.", "What I'm worried about is the budget.", "The budget is my concern."] },
        { type: "blank", en: "What ___ we try a different approach?", ko: "다른 방법을 써 보면 어떨까요?", answers: ["if"] },
        { type: "blank", en: "Are we all on the same ___?", ko: "다들 같은 생각인 거죠?", answers: ["page"] },
        { type: "blank", en: "I'll ___ up with the client tomorrow.", ko: "내일 고객사에 후속 연락할게요.", answers: ["follow"] },
        { type: "arrange", ko: "무슨 말씀인지 알겠어요.", answers: ["I see what you mean."] },
        { type: "arrange", ko: "다들 어떻게 생각하는지 듣고 싶어요.", answers: ["I'd like to hear what everyone thinks."] },
        { type: "arrange", ko: "회의 끝나고 바로 보낼게요.", answers: ["I'll send it right after the meeting.", "I'll send them right after the meeting."] }
    ]
});
