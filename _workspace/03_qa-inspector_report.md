# QA Inspector 보고서 — EveryEnglish

- 일자: 2026-11-20
- 범위: 챕터 01~14 전체, `js/core/*.js`, `js/app/*.js`
- 자동 검사: `npm run check` 통과 (검증기 챕터 14개 · 오류 0 · 경고 0 / 단위 테스트 25/25) — answers 수정 전·후 모두 green
- 정답 변형 탐침: 수정 전 wrong 후보 **95개** → 수정 후 **49개** (남은 49개는 전부 기각 판정, 아래 참조)

---

## 1. 확정 결함

### D1. 결과 화면의 "다시 하기" 버튼이 아무 동작도 하지 않는다
- 위치: `js/app/views-learn.js:400` (링크), `js/app/views-learn.js:420` (핸들러), `js/app/main.js:117` (라우팅은 `hashchange`에만 반응)
- 재현: 챕터 학습을 끝까지 진행 → 결과 화면에서 "다시 하기" 탭
- 기대: 같은 챕터 학습이 처음(시작 화면)부터 다시 열린다
- 실제: 링크의 href가 `#/learn/<id>`인데 현재 해시도 `#/learn/<id>`라서 `hashchange`가 발생하지 않는다. 핸들러는 `inProgress = null`만 하고 화면을 다시 그리지 않으므로 결과 화면에 그대로 머문다
- 고칠 방향(참고): 핸들러에서 `route()`를 직접 부르거나, 세션을 초기화하고 `render()`

### D2. "전체 연습"(early 모드)에서 오늘 복습일인 항목을 맞혀도 SRS가 진행되지 않는데, 집중케어 과제는 완료로 체크된다
- 위치: `js/app/actions.js:51-60` (`reviewWrong`), `js/app/views-care.js:92-96` (early 목록 구성), `js/app/views-care.js:106` (`completeTask("review")`)
- 계약 불일치: `actions.js:51` 주석은 "early=true면 **아직 복습일이 아닌 항목**의 자율 연습 — 맞혀도 간격을 올리지 않는다"인데, `CarePractice`의 early 목록은 오늘 복습일인 항목까지 전부 포함하고 `reviewWrong`은 항목의 due 여부를 보지 않는다
- 재현: 오늘 due인 오답 1개가 있는 상태 → 집중케어 → "전체 연습" → 맞게 답함
- 기대: due 항목은 정규 복습과 같이 box +1, 다음 복습일 갱신
- 실제: `lastPracticed`만 기록, box 0·due 오늘 그대로. 그런데 `finish()`가 `completeTask("review")`를 호출해 홈의 "집중케어" 과제가 ✓로 표시된다. 같은 화면 상단 "오늘 복습할 문장" 수는 줄지 않아 화면끼리 모순
- 고칠 방향(참고): `reviewWrong`에서 `early && pass && !Srs.isDue(item, today)`일 때만 일정 유지

### D3. (문서) 스키마 계약서의 렌더러 경로가 실제와 다르다
- 위치: `.claude/skills/chapter-authoring/references/schema.md:3`
- 내용: "렌더러(`js/app.js`)"라고 적혀 있으나 실제 렌더러는 `js/app/views-learn.js`, `views-care.js`, `views-home.js`로 나뉘어 있다. "필드를 바꾸려면 세 곳을 함께 바꾼다"는 규칙의 대상이 틀린 파일을 가리킨다

---

## 2. 검토 필요 (확신 없음 / 설계 판단)

### 채점기 — 틀린 답이 통과(close)하는 사례
단어 단위 유사도 0.8 기준이라 긴 문장에서 의미를 뒤집는 한 단어 차이가 통과한다. "맞는 답 오답 처리"보다 우선순위는 낮지만 학습자에게 틀린 표현을 맞았다고 알려준다.

| 입력 | 정답 | 판정 |
|---|---|---|
| `No, I have something to declare.` | `No, I have nothing to declare.` | close (0.83) |
| `Is it not safe to drive after taking it?` | `Is it safe to drive after taking it?` | close (0.89) |
| `I want to check out.` | `I want to check in.` | close (0.80) |
| `Can I get a small latte?` | `Can I get a large latte?` | close (0.83) |

→ 부정어(not/nothing/never)·반의어 치환은 close로 올리지 않는 규칙을 고려할 것. (`js/core/grader.js:190`)

### 채점기 — 짧은 대답에서 Yes/No 접두어 하나 차이로 wrong
4토큰 이하 답에서 `Yes,`/`No,`가 빠지면 0.67~0.75로 wrong이 된다(예: "Yes, an extra shot, please." vs "An extra shot, please."). 이번에 해당 줄들에 변형을 직접 추가해 막았지만, 새 챕터에서 계속 재발할 구조다. 문맥상 질문에 대한 대답일 때 선행 `yes/no/sure/yeah`를 FILLER처럼 다루는 방안을 검토(단, "No"가 내용 전체인 답이 있으므로 단독일 때는 유지).

### 탐침 스크립트 노이즈
`.claude/skills/ee-qa/scripts/probe-answers.js:16`의 `I'd like → I'll have` 치환이 `I'd like to ~`에도 적용돼 "I'll have to book…"(의무, 뜻이 다름) 같은 후보를 27개 만든다. 남은 49개 중 대부분이 이것. `/\bI'd like (a|an|the)\b/`처럼 명사구 앞에서만 바꾸도록 좁히면 탐침 신호가 깨끗해진다.

### 기타 코드
- `views-learn.js:273` 롤플레이에서 첫 시도 wrong(이미 오답노트 등록) → 다시 말하기 → close가 나오면 "📌 오답노트에 저장" 버튼이 다시 뜬다. 누르면 `recordAttempt`가 한 번 더 돌아 `wrongCount`가 2로 부풀고 history가 추가된다. 이미 담긴 항목이면 버튼을 숨기는 편이 맞아 보임
- `views-learn.js:341-346` 빈칸 드릴에서 빈 입력으로 Enter/확인을 누르면 wrong으로 오답노트에 기록된다(실수 입력이 오답으로 남음). 집중케어 빈칸(`views-care.js:159`)도 동일
- `views-learn.js:40,389` 이어하기 세션은 `startedAt`을 그대로 쓰므로 며칠 뒤 이어 하면 결과 화면 "학습 시간"이 수천 분으로 표시된다
- `views-care.js:42,51` "오늘 복습할 문장" 수와 "오늘" 탭은 `REVIEW_LIMIT`(12)로 잘린 값이라 실제 due가 12개를 넘으면 실제보다 적게 보인다(의도일 수 있음)
- `views-home.js:125` 챕터 필터에 B2가 없다. 스키마·검증기는 B2를 허용하므로 B2 챕터를 추가하면 "전체"에서만 보인다(현재 B2 챕터 0개라 실제 영향 없음)
- `store.js:76` `importJSON`은 최상위만 `Object.assign`해서, 옛 백업에 `settings` 일부 키가 없으면 `load()`와 달리 중첩 기본값이 채워지지 않는다. 다음 새로고침 때 `load()`가 다시 병합하므로 영향은 한 세션 한정
- 13-meeting s3.lines[11]: 상대가 "Thanks, everyone. Good meeting."이라고 마무리한 직후 사용자 모범답안이 "Thanks, everyone."으로 거의 메아리. ko "다들 수고하셨어요"의 의도는 맞지만 장면 흐름상 "Thanks, Rachel."류를 answers[0]로 두는 편이 자연스러울 수 있음 (content-author 판단)

### 정답 변형 — 추가하지 않고 남긴 것 중 의견이 갈릴 수 있는 것
- 07-airport s1.lines[7], drills[0] `I'll have an aisle seat(, please).` — 이해는 되지만 체크인 카운터에서는 "I'll take an aisle seat"가 더 자연스러워 보류
- 03-restaurant s3.lines[9] `Thanks. The check, please.` — "Thanks" 단독은 디저트 거절 의미가 약해 보류
- `Please.` 단독(01 s2.lines[3/7/9], 03 s3.lines[7], 10 s3.lines[3]) — 무례하진 않지만 "Yes, please."를 가르치는 줄이라 보류

---

## 3. 통과 항목

### 챕터 데이터 ↔ 렌더러
렌더러가 읽는 필드를 전수 대조 — 스키마·검증기와 일치.
- 챕터: `id, order, title, titleEn, emoji, level, gradient[2], goal` (views-home, views-learn, ui.gradient)
- vocab: `word, pos, meaning, example, exampleKo` / expressions: `en, ko, note, example`
- dialogues: `id, title, setting, lines[].{speaker, name, en, ko, hint, answers}` — 검증기가 you 줄 `hint` 필수, partner 줄 `name/en/ko` 필수로 강제
- drills: `type, ko, en(blank), answers` — 검증기가 blank의 `___` 정확히 1개 강제

### 렌더러 ↔ 저장소 (recordAttempt → CarePractice)
| 필드 | 저장 (`actions.js:30-38`) | 읽기 (`views-care.js`) | 결과 |
|---|---|---|---|
| kind | dialogue / translate / blank / arrange | KIND_LABEL, `isBlank`, strict 예외(arrange) | 일치 |
| context / contextKo | 롤플레이: 직전 partner `en/ko` / 드릴: "" | 129-130 (context 있을 때만 말풍선) | 일치 |
| hint | 롤플레이만 | 132 (있을 때만) | 일치 |
| blankEn | blank: `d.en` / 그 외 "" | 71-72, 125, 134, 153 | 일치 |
| strict | 드릴 blank·arrange true | 141 (arrange는 자유입력이라 strict 해제) | 일치 |
| answers / ko / chapterId / history | 저장 | 표시·채점 | 일치 |

### 저장소 ↔ 과거 데이터
`store.js load()`가 최상위 키와 1단계 중첩 객체(settings 등)를 기본값과 병합. `inProgress`는 기본값에 없지만 모든 읽기가 `undefined`를 허용(`views-learn.js:39`, `views-home.js:158`).

### 한국어 ↔ 영어 (챕터당 6줄 + 드릴 2개 샘플링)
의미 불일치·번역투 없음. 사용자가 할 법한 다른 표현(예: "I didn't check, but I felt really hot.", "Do you have anything this Saturday afternoon?", "Sales increased by 30%.", "About ten minutes.")도 correct로 확인.

### 기타 확인
- `srs.js` markWrong/review: 정복 항목을 다시 틀리면 mastered 해제·box 0 — 정상
- `plan.js` pickTodayChapter / streak / dueItems — 로직 정상
- `grader.js` 정규화(축약형, 숫자·서수, o'clock, a.m./p.m., %, 철자 불러주기) — 샘플 입력에서 기대대로 동작
- 첫 시도만 기록(`views-learn.js:83`), XP 계산(close 후 저장 시 +2−2 상쇄) — 정상

---

## 4. 정답 변형 추가 내역 (answers[0]은 변경하지 않음)

| 챕터 | 추가 수 | 내용 |
|---|---|---|
| 01 cafe-order | 10 | I'll have an iced latte/americano, please · A croissant, please · One croissant, please · Warm it up, please · Decaf, please · Make it decaf, please · An extra shot, please · I'm good · I'm okay |
| 02 self-intro | 2 | I'm Korean · I enjoy hiking |
| 05 shopping | 3 | Just this shirt, please · Here you go · Here you are |
| 06 hotel | 3 | Here it is · Two would be good · Could I check in? |
| 07 airport | 8 | Just one bag · One bag · Just this one · Only this one · Just this bag · Second time · I don't · Nothing |
| 09 doctor | 6 | I'll wait · First time · I haven't (s1, s3) · Never · Could I still drive? |
| 10 phone-call | 1 | That's fine |
| 11 making-plans | 10 | Invite Sarah too · Invite her too · Invite her · Ask her too · Ask Sarah too · Something came up · Let's reschedule · Can we reschedule? · Go ahead · Pad thai, please |
| 13 meeting | 2 | I agree · Thanks, everyone. Good meeting |
| 03 / 04 / 08 / 12 / 14 | 0 | 후보는 전부 의미 변경("I'll have to ~") 또는 부자연스러운 표현이라 기각 |
| **합계** | **45** | |

남은 탐침 후보 49개 판정: "I'll have to ~"(의무로 뜻이 바뀜) 27개, 상황에 안 맞는 "I'll have a/an ~"(refund·reservation·table·new order·large·aisle seat) 12개, "Please." 단독 5개, 기타 5개("Thanks."·"Thank you." 단독은 거절 의미가 약함, "Please get a table." 등).
