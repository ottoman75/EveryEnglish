(window.EE_CHAPTERS = window.EE_CHAPTERS || []).push({
    id: "doctor",
    order: 9,
    title: "병원·약국에서 증상 말하기",
    titleEn: "Seeing a Doctor",
    emoji: "🩺",
    level: "B1",
    gradient: ["#43E97B", "#38F9D7"],
    goal: "접수부터 증상 설명, 약국에서 복용법 확인까지 아픈 상황을 영어로 해결한다",

    vocab: [
        { word: "appointment", pos: "n.", meaning: "(병원) 예약", example: "I don't have an appointment.", exampleKo: "예약은 안 했어요." },
        { word: "fill out", pos: "phr. v.", meaning: "(서류를) 작성하다", example: "Please fill out this form.", exampleKo: "이 양식 작성해 주세요." },
        { word: "insurance", pos: "n.", meaning: "보험", example: "Do you have insurance?", exampleKo: "보험 있으세요?" },
        { word: "sore throat", pos: "n.", meaning: "인후통, 목 아픔", example: "I've had a sore throat for two days.", exampleKo: "이틀째 목이 아파요." },
        { word: "fever", pos: "n.", meaning: "열", example: "How high is your fever?", exampleKo: "열이 몇 도예요?" },
        { word: "symptom", pos: "n.", meaning: "증상", example: "Any other symptoms?", exampleKo: "다른 증상은 없으세요?" },
        { word: "allergic", pos: "adj.", meaning: "알레르기가 있는", example: "I'm allergic to penicillin.", exampleKo: "페니실린 알레르기가 있어요." },
        { word: "prescription", pos: "n.", meaning: "처방전, 처방약", example: "I'm here to pick up a prescription.", exampleKo: "처방약 찾으러 왔어요." },
        { word: "drowsy", pos: "adj.", meaning: "졸린, 나른한", example: "It might make you a little drowsy.", exampleKo: "조금 졸릴 수 있어요." },
        { word: "rest", pos: "v./n.", meaning: "쉬다; 휴식", example: "You should rest at home for a day or two.", exampleKo: "하루 이틀은 집에서 쉬세요." }
    ],

    expressions: [
        { en: "I've had ~ for ~.", ko: "~째 ~해요.", note: "증상이 언제부터 계속됐는지 말할 때. 'I have ~ for'는 틀린 문장이 된다", example: "I've had a headache for three days." },
        { en: "I have a ~.", ko: "~가 있어요. (증상)", note: "증상 이름 앞에 a를 붙인다: a cough, a fever, a runny nose", example: "I have a runny nose." },
        { en: "My ~ hurts.", ko: "~가 아파요.", note: "아픈 부위를 주어로", example: "My stomach hurts." },
        { en: "I'm allergic to ~.", ko: "~ 알레르기가 있어요.", note: "약 처방 전에 꼭 말해야 하는 정보", example: "I'm allergic to penicillin." },
        { en: "How often should I ~?", ko: "얼마나 자주 ~해야 하나요?", note: "복용 횟수를 물을 때", example: "How often should I take this?" },
        { en: "Do you have anything for ~?", ko: "~에 먹을 만한 거 있나요?", note: "약 이름을 몰라도 증상으로 약을 찾는 표현", example: "Do you have anything for a headache?" }
    ],

    dialogues: [
        {
            id: "s1",
            title: "병원 접수",
            setting: "여행 중 갑자기 아파서 찾아간 동네 병원(walk-in clinic) 접수처",
            lines: [
                { speaker: "partner", name: "Receptionist", en: "Hi, how can I help you?", ko: "안녕하세요, 어떻게 오셨어요?" },
                { speaker: "you", ko: "예약은 안 했는데, 진료 받을 수 있을까요?", hint: "Can I see ~?",
                    answers: ["I don't have an appointment, but can I see a doctor?", "I don't have an appointment. Can I still see a doctor?", "I don't have an appointment, but could I see a doctor?", "I didn't make an appointment, but can I see a doctor?", "Can I see a doctor without an appointment?", "Could I see a doctor without an appointment?", "Hi, can I see a doctor without an appointment?"] },
                { speaker: "partner", name: "Receptionist", en: "We can fit you in, but there's about a 30-minute wait. Is that okay?", ko: "진료는 가능한데, 30분 정도 기다리셔야 해요. 괜찮으세요?" },
                { speaker: "you", ko: "네, 괜찮아요. 기다릴게요.", hint: "That's fine. I'll ~.",
                    answers: ["Yes, that's fine. I'll wait.", "That's fine. I'll wait.", "That's fine. I can wait.", "That's okay. I'll wait.", "Sure, I'll wait.", "No problem, I'll wait.", "Yes, that's okay. I can wait.", "I'll wait."] },
                { speaker: "partner", name: "Receptionist", en: "Great. Have you been here before?", ko: "네. 전에 오신 적 있으세요?" },
                { speaker: "you", ko: "아니요, 처음이에요.", hint: "It's my first ~.",
                    answers: ["No, this is my first time.", "No, it's my first time.", "No, first time.", "No, this is my first visit.", "No, it's my first visit.", "No, I haven't.", "No, I've never been here before.", "First time.", "I haven't."] },
                { speaker: "partner", name: "Receptionist", en: "Okay, please fill out this form. Do you have insurance?", ko: "그럼 이 양식 작성해 주세요. 보험 있으세요?" },
                { speaker: "you", ko: "네, 여행자 보험이 있어요.", hint: "I have ~ insurance.",
                    answers: ["Yes, I have travel insurance.", "Yes, I've got travel insurance.", "Yeah, I have travel insurance.", "I have travel insurance.", "Yes, I have travel insurance here.", "Yes, I'm covered by travel insurance."] },
                { speaker: "partner", name: "Receptionist", en: "Perfect. Just have a seat, and we'll call your name.", ko: "좋아요. 앉아 계시면 이름 불러 드릴게요." },
                { speaker: "you", ko: "양식 다 쓰면 어디에 내요?", hint: "Where should I ~?",
                    answers: ["Where should I turn in the form?", "Where should I turn in this form?", "Where do I turn in the form?", "Where do I hand in the form?", "Where should I put the form when I'm done?", "Where do I bring the form when I'm done?", "Who do I give this form to?", "Where should I hand this in?"] }
            ]
        },
        {
            id: "s2",
            title: "진찰실에서",
            setting: "진찰실. 의사가 증상을 묻는다",
            lines: [
                { speaker: "partner", name: "Doctor", en: "Hi, Minsu. I'm Dr. Kim. What brings you in today?", ko: "안녕하세요, 민수 씨. 저는 김 선생입니다. 오늘 어디가 불편해서 오셨어요?" },
                { speaker: "you", ko: "이틀째 목이 아프고 열이 나요.", hint: "I've had ~ for ~.",
                    answers: ["I've had a sore throat and a fever for two days.", "I've had a sore throat and fever for two days.", "My throat hurts, and I've had a fever for two days.", "I've had a sore throat and a fever since yesterday.", "For two days, I've had a sore throat and a fever.", "I've had a fever and a sore throat for two days."] },
                { speaker: "partner", name: "Doctor", en: "I see. How high is your fever?", ko: "그렇군요. 열은 몇 도까지 올랐어요?" },
                { speaker: "you", ko: "재 보진 않았는데, 몸이 많이 뜨거웠어요.", hint: "I'm not sure, but ~.",
                    answers: ["I'm not sure, but I felt really hot.", "I'm not sure, but I felt very hot.", "I didn't check, but I felt really hot.", "I didn't measure it, but I felt really hot.", "I don't know exactly, but I felt really hot.", "I'm not sure, but I've been feeling really hot.", "I didn't take my temperature, but I felt really hot."] },
                { speaker: "partner", name: "Doctor", en: "Okay. Any other symptoms? A cough, or a runny nose?", ko: "네. 다른 증상은요? 기침이나 콧물은요?" },
                { speaker: "you", ko: "기침이 조금 나고 온몸이 쑤셔요.", hint: "I have ~, and ~.",
                    answers: ["I have a little cough, and my body aches.", "I have a slight cough, and my body aches.", "I have a little cough, and my whole body aches.", "I have a slight cough and body aches.", "I have a bit of a cough, and my body aches.", "I'm coughing a little, and my body aches.", "A little cough, and my body aches.", "I have a cough, and my whole body hurts."] },
                { speaker: "partner", name: "Doctor", en: "Let me take a look... It looks like a throat infection. Are you allergic to any medication?", ko: "좀 볼게요… 인후염 같네요. 약 알레르기 있으세요?" },
                { speaker: "you", ko: "페니실린 알레르기가 있어요.", hint: "I'm allergic to ~.",
                    answers: ["I'm allergic to penicillin.", "Yes, I'm allergic to penicillin.", "Yes, penicillin.", "Penicillin.", "I have a penicillin allergy.", "Yes, I have a penicillin allergy."] },
                { speaker: "partner", name: "Doctor", en: "Good to know. I'll prescribe something else, then.", ko: "알려 주셔서 다행이에요. 그럼 다른 약으로 처방할게요." },
                { speaker: "you", ko: "약은 하루에 몇 번 먹어야 해요?", hint: "How often should I ~?",
                    answers: ["How often should I take it?", "How many times a day should I take it?", "How often do I take it?", "How many times a day do I take it?", "How often should I take the medicine?", "How many times a day should I take the medicine?", "How often should I take the medication?"] },
                { speaker: "partner", name: "Doctor", en: "Twice a day, after meals, for five days.", ko: "하루 두 번, 식후에, 5일 동안 드세요." },
                { speaker: "you", ko: "출근해도 괜찮을까요?", hint: "Is it okay to ~?",
                    answers: ["Is it okay to go to work?", "Is it okay if I go to work?", "Is it all right to go to work?", "Can I go to work?", "Can I still go to work?", "Is it okay to go to work tomorrow?", "Should I stay home from work?"] }
            ]
        },
        {
            id: "s3",
            title: "약국에서",
            setting: "병원 근처 약국 처방약 카운터",
            lines: [
                { speaker: "partner", name: "Pharmacist", en: "Hi there. Dropping off or picking up?", ko: "안녕하세요. 처방전 맡기시는 거예요, 약 찾으시는 거예요?" },
                { speaker: "you", ko: "처방약 찾으러 왔어요.", hint: "Here to pick up ~.",
                    answers: ["I'm here to pick up a prescription.", "I'm here to pick up my prescription.", "I'm picking up a prescription.", "Picking up a prescription.", "I'd like to pick up my prescription.", "Picking up, please.", "Picking up."] },
                { speaker: "partner", name: "Pharmacist", en: "Sure. What's your name and date of birth?", ko: "네. 성함이랑 생년월일이요?" },
                { speaker: "you", ko: "김민수이고, 1995년 3월 14일생이에요.", hint: "Name, then birth date",
                    answers: ["Minsu Kim, March 14th, 1995.", "Minsu Kim, March 14, 1995.", "It's Minsu Kim, March 14th, 1995.", "Minsu Kim. My birthday is March 14th, 1995.", "My name is Minsu Kim, and it's March 14th, 1995.", "Minsu Kim, born March 14th, 1995.", "Minsu Kim, March fourteenth, 1995.", "Minsu Kim, 3/14/1995."] },
                { speaker: "partner", name: "Pharmacist", en: "Got it. Here you go. Have you taken this medication before?", ko: "확인됐어요. 여기 있습니다. 이 약 전에 드셔 보신 적 있으세요?" },
                { speaker: "you", ko: "아니요, 먹어 본 적 없어요.", hint: "I've never ~.",
                    answers: ["No, I've never taken it before.", "No, I've never taken it.", "No, I haven't.", "No, never.", "No, this is my first time.", "No, it's my first time taking it.", "No, I've never had it before.", "I haven't.", "Never."] },
                { speaker: "partner", name: "Pharmacist", en: "Okay. Take one pill twice a day with food. It might make you a little drowsy.", ko: "네. 하루 두 번 한 알씩, 식사와 함께 드세요. 조금 졸릴 수 있어요." },
                { speaker: "you", ko: "먹고 운전해도 괜찮아요?", hint: "Is it safe to ~?",
                    answers: ["Is it safe to drive after taking it?", "Is it safe to drive?", "Is it okay to drive?", "Is it okay to drive after taking it?", "Can I drive after taking it?", "Is it safe to drive after I take it?", "Can I still drive?", "Could I still drive?"] },
                { speaker: "partner", name: "Pharmacist", en: "I'd avoid driving until you know how it affects you.", ko: "몸에 어떻게 반응하는지 알기 전까지는 운전은 피하세요." },
                { speaker: "you", ko: "알겠어요. 목 아픈 데 먹을 만한 거 있을까요?", hint: "Anything for ~?",
                    answers: ["Got it. Do you have anything for a sore throat?", "Okay. Do you have anything for a sore throat?", "I see. Do you have anything for a sore throat?", "Okay. Is there anything for a sore throat?", "Got it. Can you recommend something for a sore throat?", "Okay. What do you recommend for a sore throat?", "Okay. Anything for a sore throat?"] },
                { speaker: "partner", name: "Pharmacist", en: "These throat lozenges work well. They're right over there.", ko: "이 목캔디가 잘 들어요. 바로 저쪽에 있어요." },
                { speaker: "you", ko: "감사해요. 그것도 살게요.", hint: "I'll take ~ too.",
                    answers: ["Thanks. I'll take those too.", "Thank you. I'll take those too.", "Thanks. I'll get those too.", "Great, I'll take some too.", "Thanks. I'll buy those too.", "Thanks, I'll grab some too."] }
            ]
        }
    ],

    drills: [
        { type: "translate", ko: "머리가 아파요.", answers: ["I have a headache.", "I've got a headache.", "My head hurts.", "My head is killing me."] },
        { type: "translate", ko: "어제부터 열이 나요.", answers: ["I've had a fever since yesterday.", "I've been running a fever since yesterday.", "I've had a temperature since yesterday.", "I've been feverish since yesterday.", "I've had a fever since yesterday morning."] },
        { type: "translate", ko: "땅콩 알레르기가 있어요.", answers: ["I'm allergic to peanuts.", "I have a peanut allergy.", "I've got a peanut allergy."] },
        { type: "translate", ko: "진통제 있나요?", answers: ["Do you have any painkillers?", "Do you have painkillers?", "Do you have any pain relievers?", "Do you have any pain medicine?", "Do you have any pain medication?", "Do you have anything for pain?", "Do you sell painkillers?"] },
        { type: "blank", en: "I've had a sore throat ___ two days.", ko: "이틀째 목이 아파요.", answers: ["for"] },
        { type: "blank", en: "Are you ___ to any medication?", ko: "약 알레르기 있으세요?", answers: ["allergic"] },
        { type: "blank", en: "Please ___ out this form.", ko: "이 양식 작성해 주세요.", answers: ["fill"] },
        { type: "arrange", ko: "이 약 먹으면 졸릴 수 있어요.", answers: ["This might make you drowsy."] },
        { type: "arrange", ko: "하루에 두 번 드세요.", answers: ["Take it twice a day."] },
        { type: "arrange", ko: "예약은 안 했어요.", answers: ["I don't have an appointment."] }
    ]
});
