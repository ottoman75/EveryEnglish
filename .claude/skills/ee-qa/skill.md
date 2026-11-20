---
name: ee-qa
description: "EveryEnglish의 경계면 정합성 검수. 챕터 데이터 ↔ 채점기 ↔ 화면 렌더러 ↔ 저장소가 서로 같은 계약을 쓰는지 교차 확인하고, 정답 변형(answers) 누락으로 맞는 답이 오답 처리되는 사례를 찾는다. 'QA 해줘', '검수해줘', '배포 전 점검', '챕터 품질 확인', 새 챕터·새 화면 추가 직후에 반드시 이 스킬을 사용할 것. 단순 코드 스타일 리뷰는 대상이 아니다."
---

# EveryEnglish QA

존재 확인이 아니라 **경계면 교차 비교**가 핵심이다. 각 계층은 자기 테스트를 통과해도 서로 다른 가정을 할 수 있다.

## 1. 자동 검사 (먼저)

```bash
npm run check          # 챕터 스키마 + index.html 누락 + 단위 테스트
```

## 2. 경계면 교차 검사

| 경계 | 무엇을 비교하나 | 방법 |
|---|---|---|
| 챕터 데이터 ↔ 채점기 | 각 `you` 줄의 answers가 원어민의 자연스러운 변형을 충분히 덮는가 | `node .claude/skills/ee-qa/scripts/probe-answers.js` — 흔한 변형(please 추가/제거, Can↔Could, I'd like↔I'll have 등)을 자동 생성해 채점하고 wrong이 나오는 사례를 출력한다. 출력된 사례를 사람 눈으로 보고 "맞는 답인데 wrong"인 것만 보고한다 |
| 챕터 데이터 ↔ 렌더러 | 렌더러가 읽는 필드(`views-learn.js`, `views-care.js`)가 스키마와 일치하는가 | 두 파일에서 `ch.`, `line.`, `d.`, `v.`, `x.` 접근 필드를 grep 해 schema.md와 대조 |
| 렌더러 ↔ 저장소 | `actions.recordAttempt`에 넘기는 item 필드를 `views-care.js`(집중케어)가 전부 다시 읽을 수 있는가 | blank 문항은 `blankEn`, 대화 문항은 `context`가 있어야 복습 화면이 문맥을 보여준다 |
| 저장소 ↔ 과거 데이터 | 새 필드 추가 시 기존 localStorage에 없을 때 기본값으로 동작하는가 | `store.js load()`의 defaults 병합 확인 |
| 한국어 ↔ 영어 | ko 프롬프트와 answers[0]의 의미가 일치하는가, 번역투가 없는가 | 샘플링해서 읽는다 |

## 3. 판정 원칙

- "맞는 답이 오답 처리됨"은 최우선 결함. 반대(틀린 답이 통과)는 그다음.
- 의견이 갈리는 표현은 결함으로 보고하지 말고 "검토 필요"로 분리한다.
- 보고에는 파일:줄, 재현 입력, 기대/실제 판정을 넣는다.

## 산출물

`_workspace/03_qa-inspector_report.md` — 결함(확정) / 검토 필요 / 통과 항목 세 구획.
