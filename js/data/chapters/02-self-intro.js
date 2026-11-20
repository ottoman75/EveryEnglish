(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "self-intro",
    order: 2,
    title: "첫 만남과 자기소개",
    titleEn: "Meeting New People",
    emoji: "👋",
    level: "A1",
    gradient: ["#A18CD1", "#FBC2EB"],
    goal: "처음 만난 사람에게 나를 소개하고, 연락처를 주고받으며 기분 좋게 헤어진다",

    vocab: [
        { word: "meet", pos: "v.", meaning: "만나다, 처음 알게 되다", example: "Nice to meet you.", exampleKo: "만나서 반가워요." },
        { word: "originally", pos: "adv.", meaning: "원래, 본래", example: "Where are you originally from?", exampleKo: "원래 어디 출신이에요?" },
        { word: "move", pos: "v.", meaning: "이사하다", example: "I moved here last year.", exampleKo: "작년에 여기로 이사 왔어요." },
        { word: "coworker", pos: "n.", meaning: "직장 동료", example: "Jake is my coworker.", exampleKo: "제이크는 제 직장 동료예요." },
        { word: "engineer", pos: "n.", meaning: "엔지니어, 기술자", example: "I'm an engineer.", exampleKo: "저는 엔지니어예요." },
        { word: "company", pos: "n.", meaning: "회사", example: "I work at a small IT company.", exampleKo: "작은 IT 회사에서 일해요." },
        { word: "hobby", pos: "n.", meaning: "취미", example: "Do you have any hobbies?", exampleKo: "취미 있어요?" },
        { word: "neighborhood", pos: "n.", meaning: "동네", example: "That's a nice neighborhood.", exampleKo: "거기 좋은 동네죠." },
        { word: "text", pos: "v.", meaning: "문자를 보내다", example: "I'll text you later.", exampleKo: "이따가 문자할게요." },
        { word: "keep in touch", pos: "phr.", meaning: "연락하고 지내다", example: "Let's keep in touch!", exampleKo: "연락하고 지내요!" }
    ],

    expressions: [
        { en: "Nice to meet you.", ko: "만나서 반가워요.", note: "처음 인사할 때. 대답은 'Nice to meet you too.' 또는 짧게 'You too.'", example: "Hi, I'm Minsu. Nice to meet you." },
        { en: "I'm from ~.", ko: "~에서 왔어요. / ~ 출신이에요.", note: "출신을 말할 때. 'originally'를 넣으면 '원래는'이라는 뉘앙스", example: "I'm originally from Busan." },
        { en: "What do you do?", ko: "무슨 일 하세요?", note: "직업을 묻는 가장 자연스러운 질문. 'What's your job?'은 조금 딱딱하다", example: "So, what do you do?" },
        { en: "I work at ~.", ko: "~에서 일해요.", note: "직장을 말할 때. 'work for ~'도 같은 뜻", example: "I work at a small IT company." },
        { en: "Can I get your number?", ko: "번호 알려 주실래요?", note: "연락처를 물을 때 부담 없는 표현", example: "Sounds good! Can I get your number?" },
        { en: "Let's keep in touch.", ko: "연락하고 지내요.", note: "헤어질 때 다시 만나고 싶다는 마음을 전하는 인사", example: "It was great meeting you. Let's keep in touch!" }
    ],

    dialogues: [
        {
            id: "s1",
            title: "모임에서 첫인사",
            setting: "금요일 저녁, 회사 동료 제이크가 연 하우스 파티",
            lines: [
                { speaker: "partner", name: "Emma", en: "Hi! I don't think we've met. I'm Emma.", ko: "안녕하세요! 처음 뵙는 것 같네요. 저는 엠마예요." },
                { speaker: "you", ko: "안녕하세요, 저는 민수예요.", hint: "I'm ~.",
                    answers: ["Hi, I'm Minsu.", "Hello, I'm Minsu.", "Hey, I'm Minsu.", "Hi, my name is Minsu.", "Hi Emma, I'm Minsu.", "Hi, I'm Minsu. Nice to meet you."] },
                { speaker: "partner", name: "Emma", en: "Nice to meet you, Minsu.", ko: "만나서 반가워요, 민수 씨." },
                { speaker: "you", ko: "저도 만나서 반가워요.", hint: "You too.",
                    answers: ["Nice to meet you too.", "You too.", "Nice to meet you too, Emma.", "Good to meet you too.", "Pleased to meet you too.", "Same here.", "Nice to meet you, too."] },
                { speaker: "partner", name: "Emma", en: "So, how do you know Jake?", ko: "그래서, 제이크랑은 어떻게 아는 사이예요?" },
                { speaker: "you", ko: "회사 동료예요.", hint: "We work ~.",
                    answers: ["We work together.", "We're coworkers.", "He's my coworker.", "Jake is my coworker.", "We work at the same company.", "We're colleagues.", "He's a coworker."] },
                { speaker: "partner", name: "Emma", en: "Oh, cool! Are you from around here?", ko: "아, 그렇구나! 이 근처 분이세요?" },
                { speaker: "you", ko: "아니요, 한국에서 왔어요.", hint: "I'm from ~.",
                    answers: ["No, I'm from Korea.", "No, I'm from South Korea.", "No, I come from Korea.", "No, I'm originally from Korea.", "I'm from Korea.", "No, I'm Korean.", "I'm Korean."] },
                { speaker: "partner", name: "Emma", en: "Oh, nice! Which city are you originally from?", ko: "오, 좋네요! 원래 어느 도시 출신이에요?" },
                { speaker: "you", ko: "부산이요.", hint: "I'm from ~.",
                    answers: ["I'm from Busan.", "Busan.", "I'm originally from Busan.", "I'm from Busan, Korea.", "I come from Busan.", "Originally from Busan.", "Busan, in Korea."] },
                { speaker: "partner", name: "Emma", en: "When did you move here?", ko: "여기는 언제 오셨어요?" },
                { speaker: "you", ko: "작년에 이사 왔어요.", hint: "I moved ~.",
                    answers: ["I moved here last year.", "Last year.", "I came here last year.", "I moved last year.", "I moved here a year ago.", "I came here a year ago."] }
            ]
        },
        {
            id: "s2",
            title: "직업과 사는 곳 이야기",
            setting: "음료를 하나씩 들고 소파에 앉아 이야기를 이어간다",
            lines: [
                { speaker: "partner", name: "Emma", en: "So, what do you do, Minsu?", ko: "그래서, 민수 씨는 무슨 일 하세요?" },
                { speaker: "you", ko: "저는 엔지니어예요.", hint: "I'm an ~.",
                    answers: ["I'm an engineer.", "I work as an engineer.", "I'm an engineer, actually.", "I'm a software engineer.", "I'm an engineer. How about you?"] },
                { speaker: "partner", name: "Emma", en: "Oh, nice. Where do you work?", ko: "오, 좋네요. 어디서 일하세요?" },
                { speaker: "you", ko: "작은 IT 회사에서 일해요.", hint: "I work at ~.",
                    answers: ["I work at a small IT company.", "I work for a small IT company.", "At a small IT company.", "A small IT company.", "I work at a small tech company.", "I work for a small tech company."] },
                { speaker: "partner", name: "Emma", en: "Cool. Do you have any hobbies?", ko: "멋지네요. 취미 있어요?" },
                { speaker: "you", ko: "네, 등산 좋아해요.", hint: "I like ~.",
                    answers: ["Yes, I like hiking.", "Yeah, I like hiking.", "Yes, I love hiking.", "I like hiking.", "Yes, I like to hike.", "Yes, I enjoy hiking.", "Yes, my hobby is hiking.", "I love hiking.", "I enjoy hiking."] },
                { speaker: "partner", name: "Emma", en: "Me too! I go hiking almost every weekend. Where do you live?", ko: "저도요! 거의 주말마다 등산 가요. 어디 사세요?" },
                { speaker: "you", ko: "다운타운 근처에 살아요.", hint: "I live ~.",
                    answers: ["I live near downtown.", "Near downtown.", "I live close to downtown.", "I live near the downtown area.", "I'm near downtown.", "I live near downtown. How about you?"] },
                { speaker: "partner", name: "Emma", en: "Oh, that's a nice neighborhood. Do you like it?", ko: "아, 거기 좋은 동네죠. 마음에 들어요?" },
                { speaker: "you", ko: "네, 정말 좋아요. 조용해요.", hint: "I love it.",
                    answers: ["Yes, I love it. It's quiet.", "Yeah, I love it. It's really quiet.", "Yes, I really like it. It's quiet.", "Yes, I like it a lot. It's quiet.", "I love it. It's very quiet.", "Yes, it's really nice and quiet.", "Yeah, I like it. It's quiet."] },
                { speaker: "partner", name: "Emma", en: "And how's work? Is it busy?", ko: "일은 어때요? 바빠요?" },
                { speaker: "you", ko: "좀 바빠요. 그래도 재밌어요.", hint: "~, but it's fun.",
                    answers: ["It's a little busy, but it's fun.", "It's a bit busy, but it's fun.", "Yes, it's a little busy, but it's fun.", "It's pretty busy, but it's fun.", "A little, but it's fun.", "It's kind of busy, but I like it.", "It's a little busy. But it's fun."] }
            ]
        },
        {
            id: "s3",
            title: "연락처 교환과 작별",
            setting: "파티가 끝나갈 무렵, 엠마가 외투를 챙긴다",
            lines: [
                { speaker: "partner", name: "Emma", en: "Oh, it's getting late. I should get going.", ko: "아, 벌써 늦었네요. 이제 가 봐야겠어요." },
                { speaker: "you", ko: "오늘 얘기 즐거웠어요.", hint: "It was nice ~.",
                    answers: ["It was nice talking to you.", "It was great talking to you.", "It was nice talking with you.", "Nice talking to you.", "It was fun talking to you.", "I enjoyed talking with you.", "I really enjoyed talking to you."] },
                { speaker: "partner", name: "Emma", en: "Me too! We should go hiking together sometime.", ko: "저도요! 언제 같이 등산 가요." },
                { speaker: "you", ko: "좋아요! 번호 알려 주실래요?", hint: "Can I get ~?",
                    answers: ["Sounds good! Can I get your number?", "Sure! Can I get your number?", "Sounds great! Can I have your number?", "Sounds good! Can I have your number?", "I'd love that! Can I get your number?", "Great! Can I get your number?", "Sounds good! What's your number?", "Sure! Let's exchange numbers."] },
                { speaker: "partner", name: "Emma", en: "Sure. Here's my number.", ko: "그럼요. 여기 제 번호예요." },
                { speaker: "you", ko: "고마워요. 제가 문자할게요.", hint: "I'll text ~.",
                    answers: ["Thanks. I'll text you.", "Thank you. I'll text you.", "Thanks, I'll send you a text.", "Thanks! I'll text you later.", "Thanks. I'll message you.", "Great, I'll text you.", "Thanks. I'll text you soon."] },
                { speaker: "partner", name: "Emma", en: "Great. Are you on Instagram too?", ko: "좋아요. 인스타그램도 해요?" },
                { speaker: "you", ko: "네, 근데 잘 안 해요.", hint: "Yes, but I don't ~.",
                    answers: ["Yes, but I don't use it much.", "Yeah, but I don't really use it.", "Yes, but I don't use it a lot.", "I am, but I don't use it much.", "Yes, but I rarely use it.", "Yeah, but I don't post much.", "Yes, but I'm not very active."] },
                { speaker: "partner", name: "Emma", en: "Ha, me neither. Okay, see you around, Minsu!", ko: "하하, 저도요. 그럼 또 봐요, 민수 씨!" },
                { speaker: "you", ko: "연락하고 지내요! 조심히 가요.", hint: "Keep in touch",
                    answers: ["Let's keep in touch! Get home safe.", "Let's keep in touch! Get home safely.", "Keep in touch! Get home safe.", "Let's stay in touch! Get home safe.", "Let's keep in touch. Take care!", "Keep in touch! Take care.", "See you! Let's keep in touch."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "만나서 반가워요.", answers: ["Nice to meet you.", "It's nice to meet you.", "Good to meet you.", "Pleased to meet you.", "Nice meeting you.", "Great to meet you."] },
        { type: "translate", ko: "무슨 일 하세요?", answers: ["What do you do?", "What do you do for work?", "What do you do for a living?", "What's your job?", "What kind of work do you do?"] },
        { type: "translate", ko: "저는 서울에 살아요.", answers: ["I live in Seoul.", "I'm living in Seoul.", "I live in Seoul now."] },
        { type: "translate", ko: "번호 알려 주실래요?", answers: ["Can I get your number?", "Can I have your number?", "Could I get your number?", "Could I have your number?", "Can you give me your number?", "What's your number?"] },
        { type: "blank", en: "Where are you ___ from?", ko: "원래 어디 출신이에요?", answers: ["originally"] },
        { type: "blank", en: "I ___ at a small company.", ko: "작은 회사에서 일해요.", answers: ["work"] },
        { type: "blank", en: "Let's keep in ___!", ko: "연락하고 지내요!", answers: ["touch"] },
        { type: "arrange", ko: "저는 원래 부산 출신이에요.", answers: ["I'm originally from Busan."] },
        { type: "arrange", ko: "취미 있어요?", answers: ["Do you have any hobbies?"] },
        { type: "arrange", ko: "얘기 즐거웠어요.", answers: ["It was nice talking to you."] }
    ]
});
