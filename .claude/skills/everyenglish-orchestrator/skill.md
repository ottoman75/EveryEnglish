---
name: everyenglish-orchestrator
description: "EveryEnglish 영어회화 웹앱 개발 하네스를 조율한다. 챕터 여러 개를 한꺼번에 추가할 때, 새 학습 기능(화면+데이터+채점)을 엔드투엔드로 만들 때, 배포 전 전체 점검을 할 때 반드시 이 스킬을 사용할 것. 챕터 1개 수정은 chapter-authoring, 화면 1개 수정은 ee-frontend, 점검만은 ee-qa 스킬로 충분하다."
---

# EveryEnglish Orchestrator

## 실행 모드: 서브 에이전트

이 환경에는 팀 도구(TeamCreate/SendMessage 팀 채널)가 없고, 작업 간 실시간 토론보다 **고정된 계약(스키마)에 맞춘 병렬 생산 → 검수**가 맞는 구조라 서브 에이전트 모드를 쓴다.
패턴: **팬아웃(콘텐츠 병렬 작성) + 생성-검증(QA)**. 프론트엔드는 오케스트레이터(메인)가 직접 맡는다 — 화면·채점·저장이 한 파일 묶음 안에서 긴밀히 얽혀 있어 나누면 경계 버그가 생긴다.

## 에이전트 구성

| 에이전트 | 정의 | subagent_type | 스킬 | 출력 |
|---|---|---|---|---|
| content-author ×N | `.claude/agents/content-author.md` | general-purpose | chapter-authoring | `js/data/chapters/NN-id.js` |
| qa-inspector | `.claude/agents/qa-inspector.md` | general-purpose | ee-qa | `_workspace/03_qa-inspector_report.md` |
| avatar-scout | `.claude/agents/avatar-scout.md` | general-purpose | avatar-assets | `_workspace/04_avatar-scout_candidates.md`, `assets/avatars/` |
| (메인) | — | — | ee-frontend, ee-avatar | `index.html`, `css/`, `js/core`, `js/app`, `src/avatar` |

모든 Agent 호출은 `model: "opus"`, `run_in_background: true`.

## 워크플로우

### Phase 1: 계약 확정 (메인)
1. 요청을 분석해 필요한 챕터 목록(순번·id·주제·레벨·그라디언트)을 정한다. 기존 순번 뒤에 이어 붙인다.
2. 스키마 변경이 필요하면 **여기서** `schema.md` → `validate-chapters.js` → 렌더러를 함께 바꾼다. 작가가 작업 중에 스키마가 바뀌면 전부 재작업이다.
3. `_workspace/01_plan.md`에 챕터 배정표를 적는다.

### Phase 2: 병렬 생산
- content-author를 챕터 4~5개 단위로 나눠 동시에 띄운다. 각자 `node tools/validate-chapters.js <자기 순번들>`로 자기 파일만 검증한다(다른 작가 파일의 순번 공백 오류를 피하려고).
- 메인은 그동안 화면/채점 작업. 작가 보고에 "채점기가 X를 다르게 본다" 같은 지적이 오면 grader를 고치고 `tests/core.test.js`에 사례를 추가한다 — 정답 목록에 땜질하는 것보다 근본 수정이 낫다.
- 새 챕터 파일은 `index.html`의 `<script>` 목록에도 추가한다(검증기가 누락을 잡는다).

### Phase 3: 통합 검증
1. `npm run check` 통과.
2. `npm run audio` — 새 문장 원어민 녹음 생성(증분). 끝나면 `npm run validate`에 "녹음 없는 문장" 경고가 없어야 한다.
3. `node .claude/skills/ee-qa/scripts/probe-answers.js` → wrong 후보가 많으면, 공통 패턴은 grader 정규화로, 개별 사례는 QA에게.
4. qa-inspector 실행. 보고서의 확정 결함을 메인이 수정.
5. 브라우저 확인: `npm start` 후 390px 폭(`_workspace/mobile.html` 프리뷰 사용 가능)에서 학습 세션 1회를 끝까지 진행 → 오답이 오답노트에 쌓이고, due를 오늘로 바꾸면 집중케어에서 다시 나오는지.

### 대화 상대 작업
- 2D 말하는 초상화가 우선(인물별 이미지가 있으면), 없으면 3D. 이미지 생성은 사용자 몫 — `_workspace/05_portrait-prompts.md`를 주고, 받은 이미지는 portrait-assets 스킬로 등록.

### 아바타 작업 (3D 대화 상대)
- 모델 조사·라이선스 검증은 avatar-scout를 백그라운드로 띄우고, 메인은 그동안 `src/avatar` 엔진을 만진다(서로 다른 파일).
- 새 등장인물을 추가하면 `js/data/cast.js` 성별 → `npm run audio`(목소리) → 아바타 외형이 자동으로 따라온다.
- 엔진 수정 후 `npm run build:avatar && npm run stamp`.

## 데이터 전달

| 경로 | 내용 |
|---|---|
| `js/data/chapters/` | 최종 산출물(작가) |
| `_workspace/01_plan.md` | 챕터 배정 |
| `_workspace/02_content-author_*.md` | 작가의 애매한 판단 메모 (선택) |
| `_workspace/03_qa-inspector_report.md` | QA 보고서 |

## 에러 핸들링

| 상황 | 대응 |
|---|---|
| 작가가 검증 실패를 못 고침 | 1회 재지시(SendMessage). 재실패 시 해당 챕터 제외하고 진행, index.html에서도 빼고 보고에 명시 |
| 작가가 스키마 문제 제기 | 스키마를 바꿀지 메인이 결정. 바꾸면 이미 끝난 챕터도 재검증 |
| QA와 작가 판단 충돌 (정답 인정 여부) | 삭제하지 말고 "검토 필요"로 남겨 사용자에게 묻는다 |

## 테스트 시나리오

**정상 흐름** — "여행 챕터 3개 추가해줘"
1. Phase 1: 15~17번 배정, 스키마 변경 없음
2. Phase 2: content-author 1명(3개)
3. Phase 3: `npm run check` 통과 → probe 후보 검토 → QA 보고 → 브라우저에서 15번 세션 완주
4. 기대: 챕터 목록에 3개 추가, 홈의 '오늘의 챕터'는 미완료 첫 챕터 유지

**에러 흐름** — 작가가 `you` 줄을 4개만 쓴 장면을 제출
1. 작가 자체 검증에서 `you 줄 4개 (5~7 필요)` 오류
2. 작가가 못 고치고 종료 → 메인이 SendMessage로 해당 장면만 재지시
3. 재실패 → 챕터 제외, index.html에서 제거, 최종 보고에 "16번 제외(장면 구성 미달)" 명시
