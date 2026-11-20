---
name: ee-frontend
description: "EveryEnglish 웹앱의 화면·UI·채점·저장 로직(index.html, css/app.css, js/core/*, js/app/*)을 추가·수정한다. 새 화면/학습 단계 추가, 디자인 변경, 모바일 레이아웃 수정, 채점 기준(grader) 조정, 오답노트·단어장 간격 반복 규칙 변경, 음성 입력/출력 문제 수정을 요청받으면 반드시 이 스킬을 사용할 것. 챕터 대화문·단어 작성은 chapter-authoring 스킬이 담당한다."
---

# EveryEnglish Frontend

빌드 도구 없는 정적 웹앱. `index.html`을 더블클릭해도(file://) 돌아가야 한다 — 그래서 ES module 대신 클래식 스크립트와 `window.EE*` 전역을 쓴다.

## 계층과 규칙

| 계층 | 파일 | 규칙 | 이유 |
|---|---|---|---|
| 순수 도메인 | `js/core/grader.js`, `srs.js`, `plan.js` | DOM·localStorage 접근 금지. UMD로 node에서 require 가능 | `tests/core.test.js`가 그대로 실행한다 |
| 저장 | `js/core/store.js` | 필드는 Optional로만 추가, `version`·`KEY`를 올리지 않는다 | 올리면 사용자의 학습 기록이 사라진다 |
| 배선 | `js/app/actions.js` | 채점 결과 → 저장소 변환은 전부 여기 | 화면마다 오답 기록 기준이 갈라지는 것을 막는다 |
| 화면 | `js/app/views-*.js` | `function View(el, params)` → 정리 함수 반환(선택). 저장소는 actions를 통해서만 변경 | 라우터가 화면 전환 시 정리 함수를 호출한다 |
| 라우터 | `js/app/main.js` | 새 화면은 `ROUTES`에 등록. 학습 시간에 포함되면 `study: true`, 탭바를 숨기면 `immersive: true` | |

## 채점·오답 원칙

- 학습 세션에서는 **문항별 첫 시도만** 점수·오답노트에 반영한다. 다시 시도는 연습이다.
- `close`(유사도 ≥ 0.8)는 통과로 치되 차이를 보여주고, 사용자가 원하면 오답노트에 저장한다.
- 쉐도잉의 음성인식 일치율은 오답노트에 넣지 않는다. 인식 오류를 사용자 오류로 기록하게 된다.
- 정규화 규칙(축약형·숫자·서수·철자·pm·%)을 바꾸면 `tests/core.test.js`에 사례를 추가하고 `npm run validate`로 모든 챕터의 모범답안이 여전히 correct인지 확인한다.

## 음성 출력

- `EESpeech.speak(text)`는 `js/data/audio-manifest.js`에서 **정확히 같은 문장**의 녹음(audio/*.m4a, Kokoro 뉴럴 TTS)을 찾아 재생하고, 없으면 품질 점수가 가장 높은 브라우저 영어 음성으로 대체한다.
- 새 화면에서 챕터 데이터에 없는 문장을 읽게 하면 `tools/collect-speech.js`의 `UI_TEXTS`에 추가하고 `npm run audio`.
- 한국어 기본 음성이 영어를 읽게 두지 않는다(억양이 완전히 틀린다). 영어 음성이 없으면 무음.
- 속도 설정은 녹음 재생 속도(`playbackRate`, 음높이 유지)로 적용된다. 기본 0.95 = 원래 속도.

## 디자인 시스템 (`css/app.css`)

- 색은 `:root` 토큰만 사용. 다크모드는 `prefers-color-scheme` + `[data-theme]` 두 경로 모두 정의되어 있다.
- 챕터 고유색은 `--card-grad`(세션 화면 루트에 설정)와 `UI.gradient(ch)`로.
- 모바일 우선. 960px 이상에서 사이드바. 몰입 화면(`body.immersive`)은 탭바를 숨긴다.
- 입력창 폰트는 16px 이상 — iOS Safari가 확대하지 않게.
- 모션은 `prefers-reduced-motion`을 존중한다(이미 전역 처리됨).

## 변경 후 확인

1. `npm run check` (챕터 검증 + 단위 테스트)
2. `npm start` 후 `http://localhost:5173` — 390px 폭에서 가로 스크롤이 없는지 (`document.documentElement.scrollWidth === innerWidth`)
3. 음성 인식은 https 또는 localhost에서만 동작한다. file://에서는 마이크 버튼이 사라지고 키보드 입력만 남는 것이 정상
