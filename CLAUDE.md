# EveryEnglish

@intend.md

매일 30분 상황별 영어회화 웹앱. 빌드 없는 정적 HTML/CSS/JS, 모바일 우선.

## 명령

```bash
npm start          # http://localhost:5173 (tools/serve.py — 기본 http.server는 동시 요청을 떨궈 앱이 반쯤 로딩될 수 있음)
npm run check      # 챕터 검증 + 단위 테스트 — 변경 후 항상 실행
node .claude/skills/ee-qa/scripts/probe-answers.js   # 정답 변형 누락 탐침
npm run audio      # 원어민 녹음 생성/갱신 (최초 1회 npm run audio:setup)
npm run build:avatar  # src/avatar 수정 후 3D 엔진 번들 재빌드 (최초 1회 npm install)
npm run stamp      # 배포 전: index.html 스크립트 주소에 ?v= 붙여 폰 캐시 무효화 → git push (GitHub Pages)
```

## 구조

| 경로 | 역할 |
|---|---|
| `js/data/chapters/NN-id.js` | 챕터 데이터 (스키마: `.claude/skills/chapter-authoring/references/schema.md`) |
| `js/core/` | 순수 로직(grader, srs, plan) + 저장(store) + 음성(speech) |
| `js/app/actions.js` | 채점 결과 → 저장소 배선. 화면은 저장소를 직접 바꾸지 않는다 |
| `js/core/sync.js`, `js/app/sync-gist.js` | 기기 간 기록 병합(순수) / GitHub 비공개 gist 전송 |
| `js/app/views-*.js`, `main.js` | 화면과 해시 라우터 |
| `tools/validate-chapters.js` | 챕터 스키마·index.html 누락·녹음 누락 검사 |
| `tools/collect-speech.js`, `build-audio.py` | 앱이 읽는 문장 수집 → Kokoro 뉴럴 TTS로 `audio/*.m4a` + `js/data/audio-manifest.js` 생성 |
| `src/avatar/engine.js` → `js/vendor/avatar.bundle.js` | 3D 대화 상대 엔진(three-vrm). `js/app/avatar.js`가 롤플레이에서 지연 로딩 |
| `assets/avatars/` | VRM 모델 + `avatars.js` 목록 + `LICENSES.md` 근거 |
| `assets/portraits/`, `js/app/portrait.js` | 2D 말하는 초상화(같은 구도 이미지 3장, 입·눈만 교차). 등록은 `node tools/portrait-add.mjs` |
| `js/core/lipsync.js` | 립싱크 분석 — 3D·2D 공용 |
| `js/data/cast.js` | 등장인물 성별 — 목소리·아바타 외형이 함께 따름 |
| `tests/core.test.js` | grader/srs/plan 단위 테스트 (node:test) |
| `_workspace/` | 하네스 중간 산출물, 모바일 프리뷰(`mobile.html`) |

## 하네스

에이전트: `.claude/agents/` (content-author, qa-inspector) · 스킬: `.claude/skills/`

| 작업 | 스킬 |
|---|---|
| 챕터 여러 개 추가, 기능 엔드투엔드 | everyenglish-orchestrator |
| 챕터 작성·수정 | chapter-authoring |
| 화면·채점·저장 | ee-frontend |
| 검수 | ee-qa |
| 3D 아바타 렌더링·립싱크 | ee-avatar |
| 아바타 모델 찾기·교체·라이선스 | avatar-assets |
| 말하는 초상화 이미지 가이드·등록 | portrait-assets |

## 규칙

- 새 챕터 파일은 `index.html` `<script>` 목록에 추가한다.
- 저장소 스키마는 Optional 필드로만 확장, `version`/`KEY`를 올리지 않는다.
- 채점 정규화를 바꾸면 `tests/core.test.js`에 사례 추가 + `npm run validate`로 모든 모범답안이 correct인지 확인.
