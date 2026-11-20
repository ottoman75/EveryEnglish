(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "phone-call",
    order: 10,
    title: "전화로 예약·일정 변경",
    titleEn: "Making a Phone Call",
    emoji: "📞",
    level: "B1",
    gradient: ["#FA709A", "#FEE140"],
    goal: "전화로 예약을 잡고, 일정을 바꾸고, 담당자가 없을 때 메시지까지 남긴다",

    vocab: [
        { word: "appointment", pos: "n.", meaning: "예약, 약속", example: "I'd like to make an appointment for a haircut.", exampleKo: "커트 예약하고 싶어요." },
        { word: "available", pos: "adj.", meaning: "(시간·자리가) 비어 있는, 가능한", example: "Is this Saturday afternoon available?", exampleKo: "이번 토요일 오후 가능한가요?" },
        { word: "reach", pos: "v.", meaning: "(전화로) 연락하다", example: "You can reach me at this number.", exampleKo: "이 번호로 연락 주시면 돼요." },
        { word: "reschedule", pos: "v.", meaning: "일정을 변경하다", example: "I need to reschedule my appointment.", exampleKo: "예약 일정을 바꿔야 해요." },
        { word: "fully booked", pos: "adj.", meaning: "예약이 꽉 찬", example: "Tuesday evening is fully booked.", exampleKo: "화요일 저녁은 예약이 꽉 찼어요." },
        { word: "opening", pos: "n.", meaning: "빈자리, 빈 시간", example: "We have a 6:30 opening on Wednesday.", exampleKo: "수요일 6시 반이 비어 있어요." },
        { word: "leave a message", pos: "phr.", meaning: "메시지를 남기다", example: "Would you like to leave a message?", exampleKo: "메시지 남기시겠어요?" },
        { word: "break up", pos: "phr. v.", meaning: "(전화 소리가) 끊기다", example: "Sorry, you're breaking up.", exampleKo: "죄송한데 소리가 끊겨요." },
        { word: "spell", pos: "v.", meaning: "철자를 말하다", example: "Can you spell your name for me?", exampleKo: "성함 철자 좀 불러 주시겠어요?" },
        { word: "call back", pos: "phr. v.", meaning: "다시 전화하다, 회신하다", example: "Could she call me back before five?", exampleKo: "5시 전에 다시 전화 주실 수 있을까요?" }
    ],

    expressions: [
        { en: "I'd like to make an appointment for ~.", ko: "~ 예약하고 싶어요.", note: "전화 예약의 첫마디. 'book'으로 바꿔도 된다", example: "I'd like to make an appointment for a haircut." },
        { en: "~ works for me.", ko: "~ 좋아요(괜찮아요).", note: "제안받은 시간을 수락할 때 가장 자연스러운 말", example: "Two o'clock works for me." },
        { en: "I need to reschedule ~.", ko: "~ 일정을 바꿔야 해요.", note: "'change'보다 예약 변경에 딱 맞는 단어", example: "I need to reschedule my appointment." },
        { en: "How about ~?", ko: "~은 어때요?", note: "원하는 시간이 안 될 때 대안을 제시", example: "How about Wednesday, then?" },
        { en: "Can I speak to ~?", ko: "~와 통화할 수 있을까요?", note: "전화에서는 'talk to'보다 'speak to'가 정중하게 들린다", example: "Can I speak to Sarah, please?" },
        { en: "I'm calling about ~.", ko: "~ 건으로 전화드렸어요.", note: "용건을 먼저 밝히면 통화가 빨라진다", example: "I'm calling about my appointment next week." }
    ],

    dialogues: [
        {
            id: "s1",
            title: "미용실 예약 전화",
            setting: "평일 점심시간, 동네 미용실에 전화를 건다",
            lines: [
                { speaker: "partner", name: "Receptionist", en: "Thank you for calling Bella Hair Salon. How can I help you?", ko: "벨라 헤어살롱입니다. 무엇을 도와드릴까요?" },
                { speaker: "you", ko: "안녕하세요, 커트 예약하고 싶어서요.", hint: "I'd like to make ~.",
                    answers: ["Hi, I'd like to make an appointment for a haircut.", "Hi, I'd like to book an appointment for a haircut.", "Hi, I'd like to book a haircut.", "Hi, I'd like to schedule a haircut.", "Hi, can I make an appointment for a haircut?", "Hi, I want to book a haircut.", "I'd like to make a haircut appointment."] },
                { speaker: "partner", name: "Receptionist", en: "Sure. When would you like to come in?", ko: "네. 언제 오시겠어요?" },
                { speaker: "you", ko: "이번 주 토요일 오후 가능한가요?", hint: "Is ~ available?",
                    answers: ["Is this Saturday afternoon available?", "Is Saturday afternoon available?", "Do you have anything this Saturday afternoon?", "Do you have any openings this Saturday afternoon?", "Is there anything available this Saturday afternoon?", "How about this Saturday afternoon?", "Is this Saturday afternoon okay?"] },
                { speaker: "partner", name: "Receptionist", en: "Let me check... We have 2 o'clock or 4:30.", ko: "확인해 볼게요… 2시나 4시 반 가능해요." },
                { speaker: "you", ko: "2시가 좋겠어요.", hint: "~ works for me.",
                    answers: ["Two o'clock works for me.", "2 works for me.", "2:00 works for me.", "2 p.m. works for me.", "2 PM works for me.", "Two o'clock, please.", "2:00, please.", "I'll take 2 o'clock.", "Two o'clock is good.", "Let's do 2 o'clock."] },
                { speaker: "partner", name: "Receptionist", en: "Great. Can I get your name, please?", ko: "좋아요. 성함 알려 주시겠어요?" },
                { speaker: "you", ko: "김민수예요.", hint: "It's ~.",
                    answers: ["It's Minsu Kim.", "Minsu Kim.", "My name is Minsu Kim.", "Sure, it's Minsu Kim.", "This is Minsu Kim.", "It's Minsu."] },
                { speaker: "partner", name: "Receptionist", en: "Thanks, Minsu. Is this the best number to reach you?", ko: "감사합니다, 민수 님. 이 번호로 연락드리면 될까요?" },
                { speaker: "you", ko: "네, 이 번호로 연락 주시면 돼요.", hint: "You can reach me ~.",
                    answers: ["Yes, you can reach me at this number.", "Yes, you can call me at this number.", "Yes, this number is fine.", "Yes, this is the best number.", "Yes, that's the best number.", "Yep, this number works.", "Yes, that's fine.", "That's fine."] },
                { speaker: "partner", name: "Receptionist", en: "Perfect. You're all set for Saturday at 2.", ko: "좋습니다. 토요일 2시로 예약됐어요." },
                { speaker: "you", ko: "감사합니다. 그때 뵐게요.", hint: "See you ~.",
                    answers: ["Thank you. See you then.", "Thanks, see you then!", "Thanks. See you on Saturday.", "Thank you. See you Saturday!", "Great, thanks. See you Saturday.", "Thanks so much. See you then."] }
            ]
        },
        {
            id: "s2",
            title: "예약 변경",
            setting: "목요일, 토요일에 갑자기 일이 생겨 미용실에 다시 전화를 건다",
            lines: [
                { speaker: "partner", name: "Amy", en: "Bella Hair Salon, this is Amy speaking.", ko: "벨라 헤어살롱, 에이미입니다." },
                { speaker: "you", ko: "안녕하세요, 토요일 예약을 변경해야 해서요.", hint: "I need to reschedule ~.",
                    answers: ["Hi, I need to reschedule my Saturday appointment.", "Hi, I need to reschedule my appointment on Saturday.", "Hi, I'd like to reschedule my Saturday appointment.", "Hi, I need to change my appointment for Saturday.", "Hi, I'd like to change my Saturday appointment.", "Hi, can I reschedule my appointment for Saturday?", "Hi, I need to change my Saturday appointment."] },
                { speaker: "partner", name: "Amy", en: "Sure. Can I have your name?", ko: "네. 성함이 어떻게 되세요?" },
                { speaker: "you", ko: "김민수예요. 토요일 2시로 예약돼 있어요.", hint: "I have an appointment ~.",
                    answers: ["It's Minsu Kim. I have an appointment at two on Saturday.", "Minsu Kim. I have an appointment at 2 on Saturday.", "It's Minsu Kim. I have a 2 o'clock on Saturday.", "It's Minsu Kim. I'm booked for 2 on Saturday.", "Minsu Kim. I'm booked for Saturday at 2.", "It's Minsu Kim. My appointment is Saturday at 2.", "It's Minsu Kim, Saturday at 2:00.", "Minsu Kim, Saturday at 2 o'clock."] },
                { speaker: "partner", name: "Amy", en: "Found it. What day works better for you?", ko: "찾았어요. 어느 날이 더 편하세요?" },
                { speaker: "you", ko: "다음 주 화요일 저녁에 가능할까요?", hint: "Would ~ be possible?",
                    answers: ["Would next Tuesday evening be possible?", "Is next Tuesday evening possible?", "Is next Tuesday evening available?", "Do you have anything next Tuesday evening?", "Do you have any openings next Tuesday evening?", "Could I come in next Tuesday evening?", "How about next Tuesday evening?"] },
                { speaker: "partner", name: "Amy", en: "Hmm, Tuesday evening is fully booked, I'm afraid.", ko: "음, 화요일 저녁은 예약이 꽉 찼네요." },
                { speaker: "you", ko: "그럼 수요일은 어때요?", hint: "How about ~?",
                    answers: ["How about Wednesday, then?", "Then how about Wednesday?", "What about Wednesday, then?", "Then what about Wednesday?", "Is Wednesday available, then?", "Do you have anything on Wednesday?", "Okay, how about Wednesday?"] },
                { speaker: "partner", name: "Amy", en: "On Wednesday, we have a 6:30 opening.", ko: "수요일은 6시 반이 비어 있어요." },
                { speaker: "you", ko: "6시 반 좋아요. 그걸로 바꿔 주세요.", hint: "~ works. Please ~.",
                    answers: ["6:30 works. Please change it to that.", "6:30 works for me. Please change it.", "6:30 works. I'll take it.", "6:30 is perfect. Let's do that.", "6:30 sounds good. I'll take it.", "6:30 p.m. works for me.", "6:30 PM works for me.", "Perfect, I'll take 6:30.", "That works. Can you change it to 6:30?"] },
                { speaker: "partner", name: "Amy", en: "Done. Wednesday at 6:30. Anything else?", ko: "변경됐습니다. 수요일 6시 반이에요. 더 필요하신 거 있으세요?" },
                { speaker: "you", ko: "아니요, 그게 다예요. 바꿔 주셔서 감사해요.", hint: "Thanks for ~.",
                    answers: ["No, that's all. Thanks for changing it.", "No, that's it. Thanks for changing it.", "No, that's all. Thanks for your help.", "No, that's it. Thank you for your help.", "That's all. Thanks for rescheduling.", "No, that's it. Thanks so much.", "Nope, that's it. Thanks for switching it."] }
            ]
        },
        {
            id: "s3",
            title: "메시지 남기기",
            setting: "치과 담당 직원과 통화하고 싶은데 자리에 없다. 게다가 통화 상태도 나쁘다",
            lines: [
                { speaker: "partner", name: "Front Desk", en: "Smile Dental, how can I help you?", ko: "스마일 치과입니다. 무엇을 도와드릴까요?" },
                { speaker: "you", ko: "안녕하세요, 사라 존슨 씨와 통화할 수 있을까요?", hint: "Can I speak to ~?",
                    answers: ["Hi, can I speak to Sarah Johnson?", "Hi, could I speak to Sarah Johnson?", "Hi, may I speak to Sarah Johnson?", "Hi, can I speak with Sarah Johnson, please?", "Hi, can I talk to Sarah Johnson?", "Hi, is Sarah Johnson available?", "Hi, I'd like to speak to Sarah Johnson."] },
                { speaker: "partner", name: "Front Desk", en: "I'm sorry, she's on another call right now. Would you like to leave a message?", ko: "죄송하지만 지금 다른 전화를 받고 계세요. 메시지 남기시겠어요?" },
                { speaker: "you", ko: "네, 메시지 남길게요.", hint: "~ leave a message.",
                    answers: ["Yes, I'd like to leave a message.", "Sure, I'll leave a message.", "Yes, I'll leave a message.", "Yes, can I leave a message?", "Sure, can I leave a message?", "Yes, please."] },
                { speaker: "partner", name: "Front Desk", en: "Sure, go ahead.", ko: "네, 말씀하세요." },
                { speaker: "you", ko: "김민수인데요, 다음 주 예약 건으로 전화드렸어요.", hint: "I'm calling about ~.",
                    answers: ["This is Minsu Kim. I'm calling about my appointment next week.", "It's Minsu Kim. I'm calling about my appointment next week.", "This is Minsu Kim, calling about my appointment next week.", "This is Minsu Kim. I'm calling about next week's appointment.", "Hi, this is Minsu Kim. I'm calling about my appointment."] },
                { speaker: "partner", name: "Front Desk", en: "Sorry, you're breaking up. Could you say that again?", ko: "죄송한데 소리가 끊겨요. 다시 말씀해 주시겠어요?" },
                { speaker: "you", ko: "이제 잘 들리세요? 천천히 다시 말할게요.", hint: "Can you hear me ~?",
                    answers: ["Can you hear me now? I'll say it again slowly.", "Can you hear me now? I'll say it slowly.", "Can you hear me now? I'll speak more slowly.", "Can you hear me better now? I'll say it again slowly.", "Can you hear me okay now? I'll say it slowly.", "Can you hear me now? Let me say it again slowly.", "Is this better? I'll say it again slowly."] },
                { speaker: "partner", name: "Front Desk", en: "Yes, much better. Could you spell your name for me?", ko: "네, 훨씬 잘 들려요. 성함 철자 좀 불러 주시겠어요?" },
                { speaker: "you", ko: "M-I-N-S-U, 민수예요.", hint: "Letter by letter",
                    answers: ["M-I-N-S-U. Minsu.", "M-I-N-S-U.", "It's M-I-N-S-U.", "Sure, it's M-I-N-S-U.", "Sure. M-I-N-S-U, Minsu.", "M, I, N, S, U. Minsu.", "Minsu. M-I-N-S-U."] },
                { speaker: "partner", name: "Front Desk", en: "Got it. I'll have her call you back.", ko: "알겠습니다. 다시 전화드리라고 전할게요." },
                { speaker: "you", ko: "감사합니다. 오늘 5시 전에 전화 주실 수 있을까요?", hint: "Could she call me ~?",
                    answers: ["Thanks. Could she call me back before five today?", "Thanks. Could she call me back before 5?", "Thank you. Could she call me before 5 today?", "Thanks. Can she call me back before 5 today?", "Thanks. Could she call me back before 5 p.m. today?", "Thanks. Could she call me back before 5 PM today?", "Thanks. Could she call me back before 5:00 today?", "Thanks. Could she call me back before 5 o'clock today?", "Thank you. Please have her call me before 5 today."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "치과 예약하고 싶어요.", answers: ["I'd like to make a dentist appointment.", "I'd like to make an appointment with the dentist.", "I'd like to book a dentist appointment.", "I'd like to schedule a dentist appointment.", "I'd like to book an appointment with the dentist.", "I want to make a dentist appointment.", "I'd like to make an appointment at the dentist."] },
        { type: "translate", ko: "금요일 3시 가능한가요?", answers: ["Is Friday at 3 available?", "Is Friday at 3:00 available?", "Is Friday at 3 p.m. available?", "Is Friday at 3 PM available?", "Is 3 o'clock on Friday available?", "Is 3 on Friday available?", "Do you have anything Friday at 3?", "Do you have an opening on Friday at 3?", "Is Friday at 3 okay?", "How about Friday at 3?"] },
        { type: "translate", ko: "예약 취소하려고 전화드렸어요.", answers: ["I'm calling to cancel my appointment.", "I'm calling to cancel an appointment.", "I'm calling to cancel my reservation.", "I'd like to cancel my appointment.", "I need to cancel my appointment.", "I'm calling because I need to cancel my appointment."] },
        { type: "translate", ko: "다시 한번 말씀해 주시겠어요?", answers: ["Could you say that again?", "Can you say that again?", "Could you repeat that?", "Can you repeat that?", "Could you repeat that, please?", "Sorry, could you say that again?", "Could you say that one more time?", "Can you say that one more time?"] },
        { type: "blank", en: "Tuesday evening is fully ___.", ko: "화요일 저녁은 예약이 꽉 찼어요.", answers: ["booked"] },
        { type: "blank", en: "Would you like to ___ a message?", ko: "메시지 남기시겠어요?", answers: ["leave"] },
        { type: "blank", en: "I'm calling ___ my appointment.", ko: "예약 건으로 전화드렸어요.", answers: ["about", "regarding"] },
        { type: "arrange", ko: "2시 괜찮아요.", answers: ["Two o'clock works for me."] },
        { type: "arrange", ko: "예약 일정을 바꿔야 해요.", answers: ["I need to reschedule my appointment."] },
        { type: "arrange", ko: "이 번호로 다시 전화 주세요.", answers: ["Please call me back at this number."] }
    ]
});
