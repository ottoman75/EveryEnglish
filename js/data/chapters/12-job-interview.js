(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "job-interview",
    order: 12,
    title: "영어 면접",
    titleEn: "Job Interview",
    emoji: "💼",
    level: "B1",
    gradient: ["#30CFD0", "#330867"],
    goal: "경력과 강점을 소개하고, 면접관에게 질문하고, 예의 있게 마무리한다",

    vocab: [
        { word: "background", pos: "n.", meaning: "경력, 이력", example: "Tell me a little about your background.", exampleKo: "경력에 대해 간단히 말씀해 주세요." },
        { word: "experience", pos: "n.", meaning: "경험, 경력", example: "I have five years of experience in marketing.", exampleKo: "마케팅 경력이 5년 있습니다." },
        { word: "position", pos: "n.", meaning: "자리, 직책", example: "Why are you interested in this position?", exampleKo: "이 자리에 왜 관심이 있으신가요?" },
        { word: "responsible for", pos: "phr.", meaning: "~을 담당하는", example: "I was responsible for the launch campaign.", exampleKo: "출시 캠페인을 담당했습니다." },
        { word: "strength", pos: "n.", meaning: "강점, 장점", example: "What's your greatest strength?", exampleKo: "가장 큰 강점이 뭔가요?" },
        { word: "weakness", pos: "n.", meaning: "약점, 단점", example: "What about weaknesses?", exampleKo: "약점은요?" },
        { word: "team player", pos: "n.", meaning: "협업을 잘하는 사람", example: "I'm a good team player.", exampleKo: "저는 협업을 잘하는 편이에요." },
        { word: "deadline", pos: "n.", meaning: "마감 기한", example: "How do you handle tight deadlines?", exampleKo: "촉박한 마감은 어떻게 대처하세요?" },
        { word: "opportunity", pos: "n.", meaning: "기회", example: "I really appreciate the opportunity.", exampleKo: "기회 주셔서 정말 감사합니다." },
        { word: "hear back", pos: "phr. v.", meaning: "(결과) 연락을 받다", example: "When can I expect to hear back?", exampleKo: "언제쯤 연락받을 수 있을까요?" }
    ],

    expressions: [
        { en: "Thank you for having me.", ko: "불러 주셔서 감사합니다.", note: "면접·행사에 초대받았을 때 첫인사. 'Thank you for inviting me'보다 더 흔하다", example: "Thank you for having me today." },
        { en: "I've been working as ~ for ~.", ko: "~로 ~째 일하고 있습니다.", note: "현재완료진행형. 지금도 그 일을 계속하고 있다는 뜻이 담긴다", example: "I've been working as a designer for three years." },
        { en: "I was responsible for ~.", ko: "~을 담당했습니다.", note: "'I did ~'보다 역할과 책임이 드러난다. 'I was in charge of ~'도 같은 뜻", example: "I was responsible for our social media." },
        { en: "One of my strengths is ~.", ko: "제 강점 중 하나는 ~입니다.", note: "'My strength is ~'보다 겸손하게 들린다. 뒤에 명사, -ing, that절이 온다", example: "One of my strengths is working well with others." },
        { en: "I'm working on ~.", ko: "~을 고치려고 노력 중이에요.", note: "약점 질문의 정석 마무리. 개선 중이라는 걸 보여 준다", example: "I'm working on delegating more." },
        { en: "When can I expect to hear back?", ko: "언제쯤 결과를 들을 수 있을까요?", note: "면접 끝에 결과 시점을 묻는 공손한 표현", example: "Thank you. When can I expect to hear back?" }
    ],

    dialogues: [
        {
            id: "s1",
            title: "인사와 자기소개",
            setting: "오전 10시, 외국계 회사 회의실에서 시작되는 대면 면접",
            lines: [
                { speaker: "partner", name: "Interviewer", en: "Hi, you must be Minsu. Thanks for coming in today.", ko: "안녕하세요, 민수 씨죠? 오늘 와 주셔서 감사해요." },
                { speaker: "you", ko: "불러 주셔서 감사합니다.", hint: "Thank you for ~",
                    answers: ["Thank you for having me.", "Thanks for having me.", "Thank you for having me today.", "Thank you for inviting me.", "Thanks for inviting me.", "Thank you for the opportunity.", "Nice to meet you. Thank you for having me."] },
                { speaker: "partner", name: "Interviewer", en: "Did you find the office okay?", ko: "사무실은 쉽게 찾으셨어요?" },
                { speaker: "you", ko: "네, 찾기 쉬웠어요.", hint: "It was easy ~",
                    answers: ["Yes, it was easy to find.", "Yeah, it was easy to find.", "Yes, it was pretty easy to find.", "Yes, it wasn't hard to find.", "Yes, thanks. It was easy to find.", "Yes, no problem at all."] },
                { speaker: "partner", name: "Interviewer", en: "Great. So, tell me a little about your background.", ko: "다행이네요. 그럼 경력에 대해 간단히 말씀해 주세요." },
                { speaker: "you", ko: "5년째 마케터로 일하고 있습니다.", hint: "I've been working as ~",
                    answers: ["I've been working as a marketer for five years.", "I've been a marketer for five years.", "I've worked as a marketer for five years.", "I've been working in marketing for five years.", "I've worked in marketing for five years.", "I have five years of experience in marketing.", "I have five years of marketing experience."] },
                { speaker: "partner", name: "Interviewer", en: "And what's your current role?", ko: "지금은 어떤 역할을 맡고 계세요?" },
                { speaker: "you", ko: "지금은 디지털 마케팅 팀을 이끌고 있어요.", hint: "I lead ~",
                    answers: ["I'm currently leading the digital marketing team.", "I'm currently leading a digital marketing team.", "I currently lead the digital marketing team.", "I currently lead a digital marketing team.", "Right now, I lead the digital marketing team.", "Right now, I'm leading the digital marketing team.", "I lead the digital marketing team.", "I'm the digital marketing team lead."] },
                { speaker: "partner", name: "Interviewer", en: "Why are you interested in this position?", ko: "이 자리에 관심을 갖게 된 이유가 뭔가요?" },
                { speaker: "you", ko: "더 큰 시장에서 일해 보고 싶어서요.", hint: "I'd like to ~",
                    answers: ["I'd like to work in a bigger market.", "I'd like to work in a larger market.", "I'd love to work in a bigger market.", "I want to work in a bigger market.", "I want to work in a larger market.", "Because I want to work in a bigger market.", "Because I'd like to work in a bigger market."] }
            ]
        },
        {
            id: "s2",
            title: "경력과 강점·약점",
            setting: "면접 중반, 구체적인 경험과 성향을 묻는 질문이 이어진다",
            lines: [
                { speaker: "partner", name: "Interviewer", en: "Can you tell me about a project you're proud of?", ko: "자랑스러웠던 프로젝트 하나 소개해 주시겠어요?" },
                { speaker: "you", ko: "작년에 신제품 출시 캠페인을 담당했어요.", hint: "I was responsible for ~",
                    answers: ["I was responsible for a new product launch campaign last year.", "I was responsible for a product launch campaign last year.", "Last year, I was responsible for a product launch campaign.", "Last year I was in charge of a product launch campaign.", "I was in charge of a product launch campaign last year.", "Last year, I led a new product launch campaign.", "I led a product launch campaign last year."] },
                { speaker: "partner", name: "Interviewer", en: "How did it go?", ko: "결과는 어땠나요?" },
                { speaker: "you", ko: "매출이 30% 올랐어요.", hint: "Sales went up ~",
                    answers: ["Sales went up by 30 percent.", "Sales went up 30 percent.", "Sales went up by 30%.", "Sales increased by 30 percent.", "Sales increased by 30%.", "Sales increased 30 percent.", "Sales grew by 30 percent.", "We increased sales by 30 percent.", "It increased sales by 30 percent."] },
                { speaker: "partner", name: "Interviewer", en: "Impressive. What would you say is your greatest strength?", ko: "대단하네요. 가장 큰 강점은 뭐라고 생각하세요?" },
                { speaker: "you", ko: "제 강점 중 하나는 협업을 잘한다는 거예요.", hint: "One of my strengths ~",
                    answers: ["One of my strengths is working well with others.", "One of my strengths is working well with my team.", "One of my strengths is that I work well with others.", "One of my strengths is teamwork.", "One of my strengths is that I'm a team player.", "My greatest strength is working well with others.", "I'm a good team player.", "I work well with others."] },
                { speaker: "partner", name: "Interviewer", en: "And what about weaknesses?", ko: "약점은요?" },
                { speaker: "you", ko: "가끔 일을 너무 많이 떠안아요.", hint: "I sometimes ~",
                    answers: ["I sometimes take on too much work.", "I sometimes take on too much.", "Sometimes I take on too much work.", "Sometimes I take on too much.", "I tend to take on too much work.", "I sometimes try to do too much on my own.", "Sometimes I try to do everything myself."] },
                { speaker: "partner", name: "Interviewer", en: "How are you dealing with that?", ko: "그건 어떻게 극복하고 계세요?" },
                { speaker: "you", ko: "요즘은 일을 더 나눠 맡기려고 노력 중이에요.", hint: "I'm working on ~",
                    answers: ["I'm working on delegating more.", "I'm working on delegating more these days.", "These days, I'm working on delegating more.", "I'm working on delegating tasks.", "I'm trying to delegate more these days.", "These days, I'm trying to delegate more.", "I'm learning to delegate more.", "I'm trying to share tasks with my team."] },
                { speaker: "partner", name: "Interviewer", en: "Good. How do you handle tight deadlines?", ko: "좋네요. 촉박한 마감은 어떻게 대처하세요?" },
                { speaker: "you", ko: "우선순위를 정하고 일정을 짜요.", hint: "I prioritize ~",
                    answers: ["I prioritize my tasks and make a schedule.", "I prioritize tasks and make a schedule.", "I prioritize my work and make a schedule.", "I set priorities and make a schedule.", "I set priorities and plan my schedule.", "I make a schedule and prioritize my tasks.", "First, I prioritize, and then I make a schedule."] }
            ]
        },
        {
            id: "s3",
            title: "질문하고 마무리",
            setting: "면접 막바지, 지원자에게 질문할 기회가 주어졌다",
            lines: [
                { speaker: "partner", name: "Interviewer", en: "That's all from me. Do you have any questions for us?", ko: "제 질문은 여기까지예요. 저희에게 궁금한 점 있으세요?" },
                { speaker: "you", ko: "네, 이 팀의 평소 하루는 어떤가요?", hint: "What does ~ look like?",
                    answers: ["Yes. What does a typical day look like on this team?", "Yes. What does a typical day on this team look like?", "Yes, what does a typical day look like?", "What does a typical day look like here?", "Yes, what's a typical day like on this team?", "What's a typical day like for this team?", "What is a typical day like here?"] },
                { speaker: "partner", name: "Interviewer", en: "It's pretty fast-paced. We have a short meeting every morning, then lots of teamwork.", ko: "꽤 바빠요. 매일 아침 짧은 회의를 하고, 그다음엔 협업이 많아요." },
                { speaker: "you", ko: "좋네요. 성과는 어떻게 평가하시나요?", hint: "How do you ~?",
                    answers: ["That sounds great. How do you measure performance?", "Sounds great. How do you measure performance?", "Great. How do you measure performance?", "That sounds great. How do you evaluate performance?", "Sounds good. How is performance evaluated?", "Sounds great. How do you measure success?", "How do you measure performance?", "How do you evaluate performance?"] },
                { speaker: "partner", name: "Interviewer", en: "We set quarterly goals together and review them as a team.", ko: "분기별 목표를 같이 세우고 팀 단위로 점검해요." },
                { speaker: "you", ko: "언제쯤 결과를 들을 수 있을까요?", hint: "When can I expect ~?",
                    answers: ["When can I expect to hear back?", "When can I expect to hear back from you?", "When can I expect to hear from you?", "When will I hear back?", "When will I hear back from you?", "When can I expect the results?", "When will I know the results?", "When will I find out the results?"] },
                { speaker: "partner", name: "Interviewer", en: "We'll let you know by the end of next week.", ko: "다음 주 말까지 알려 드릴게요." },
                { speaker: "you", ko: "알겠습니다. 오늘 시간 내 주셔서 감사합니다.", hint: "Thank you for your ~",
                    answers: ["Great. Thank you for your time today.", "Okay. Thank you for your time today.", "Got it. Thank you for your time today.", "Sounds good. Thank you for your time today.", "Thank you for your time today.", "Thanks for your time today.", "Thank you for your time."] },
                { speaker: "partner", name: "Interviewer", en: "Thank you, Minsu. It was great talking with you.", ko: "감사해요, 민수 씨. 이야기 나눠서 즐거웠어요." },
                { speaker: "you", ko: "저도요. 기회 주셔서 감사합니다.", hint: "I appreciate ~",
                    answers: ["Same here. I really appreciate the opportunity.", "Same here. I appreciate the opportunity.", "You too. I appreciate the opportunity.", "You too. I really appreciate this opportunity.", "Same here. Thank you for the opportunity.", "Likewise. Thank you for the opportunity.", "Me too. Thank you for the opportunity."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "불러 주셔서 감사합니다.", answers: ["Thank you for having me.", "Thanks for having me.", "Thank you for inviting me.", "Thanks for inviting me."] },
        { type: "translate", ko: "3년째 디자이너로 일하고 있습니다.", answers: ["I've been working as a designer for three years.", "I've been a designer for three years.", "I've worked as a designer for three years.", "I have three years of experience as a designer.", "I've been working as a designer for the past three years."] },
        { type: "translate", ko: "제 강점 중 하나는 꼼꼼하다는 거예요.", answers: ["One of my strengths is that I'm detail-oriented.", "One of my strengths is being detail-oriented.", "One of my strengths is attention to detail.", "One of my strengths is my attention to detail.", "One of my strengths is that I'm thorough.", "One of my strengths is being thorough.", "One of my strengths is that I'm careful."] },
        { type: "translate", ko: "언제쯤 결과를 들을 수 있을까요?", answers: ["When can I expect to hear back?", "When can I expect to hear back from you?", "When can I expect to hear from you?", "When will I hear back?", "When will I hear back from you?", "When can I expect the results?", "When will I know the results?"] },
        { type: "blank", en: "I was ___ for the marketing budget.", ko: "마케팅 예산을 담당했습니다.", answers: ["responsible"] },
        { type: "blank", en: "I'm ___ on my public speaking skills.", ko: "발표 실력을 키우려고 노력 중이에요.", answers: ["working"] },
        { type: "blank", en: "When can I expect to ___ back?", ko: "언제쯤 연락받을 수 있을까요?", answers: ["hear"] },
        { type: "arrange", ko: "오늘 시간 내 주셔서 감사합니다.", answers: ["Thank you for your time today."] },
        { type: "arrange", ko: "저는 협업을 잘하는 사람이에요.", answers: ["I'm a good team player.", "I'm a team player."] },
        { type: "arrange", ko: "이 자리에 정말 관심이 많습니다.", answers: ["I'm really interested in this position.", "I'm very interested in this position."] }
    ]
});
