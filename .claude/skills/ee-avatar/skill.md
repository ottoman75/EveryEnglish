---
name: ee-avatar
description: "EveryEnglish 3D 대화 상대(VRM 아바타)의 렌더링·립싱크·표정·카메라·성능을 수정한다. 아바타 입 모양이 음성과 안 맞을 때, 표정/자세/카메라 구도 조정, 로딩 속도·발열 문제, 롤플레이 화면의 아바타 배치 변경, 새 반응 표정 추가 요청 시 반드시 이 스킬을 사용할 것. 캐릭터 모델 자체를 찾거나 교체·경량화하는 일은 avatar-assets 스킬이 담당한다."
---

# EE Avatar

## 구조

| 파일 | 역할 |
|---|---|
| `src/avatar/engine.js` | three.js + three-vrm 엔진 (ESM 소스). **직접 고치면 `npm run build:avatar` 필수** |
| `js/vendor/avatar.bundle.js` | 빌드 산출물 (IIFE, `window.EEAvatarEngine`). 롤플레이 진입 시에만 지연 로딩 |
| `js/app/avatar.js` | 화면 연결: 엔진 로딩, 인물→모델 선택, 음성 이벤트 구독, 실패 시 조용히 빠지기 |
| `assets/avatars/avatars.js` | 모델 목록 `{ id, file, gender, mb, credit }` |
| `js/data/cast.js` | 인물 성별 — 녹음 목소리와 모델 외형이 함께 따른다 |

## 동작 원리와 지켜야 할 것

- **로컬 테스트 서버**: `npm start`(= `tools/serve.py`). `python3 -m http.server`는 연결 대기열이 5개라 스크립트 30여 개를 동시에 받다 일부가 거절돼, 앱이 반쯤 로딩된 채 멈추는 '가끔 실패'가 생긴다.
- **립싱크**: `EESpeech`가 `start` 이벤트로 `<audio>`를 넘기면 Web Audio `AnalyserNode`로 주파수 대역(250–900 / 900–2000 / 2000–4200Hz) 에너지를 보고 `aa ih ou ee oh` 가중치를 만든다. 정확한 음소 정렬이 아니라 '그럴듯한' 입 모양이다.
- **잠긴 AudioContext로 음성을 돌리지 않는다.** suspended 상태에서 `createMediaElementSource`로 연결하면 소리가 사라진다. 엔진은 사용자 터치 후 running일 때만 분석 경로를 쓰고, 아니면 리듬만 흉내 낸다(`speakSynthetic`).
- **누가 말하는지 구분**: 상대 대사는 `Speech.speak(text, { who: "partner" })`. 모범답안·단어 발음에는 `who`를 넣지 않는다 — 아바타가 학습자 답을 대신 말하는 것처럼 보이면 어색하다.
- **실패는 조용히**: 엔진·모델 로딩 실패, WebGL 없음이면 무대를 비우고 채팅만 남긴다. 아바타는 보조 기능이다.
- **성능**: 화면 밖이거나 탭이 숨으면 렌더링을 멈춘다(IntersectionObserver, `document.hidden`). 픽셀 비율 최대 2.
- **설정**: `settings.avatar === false`면 끈다(기기별 설정, 동기화 안 됨).

## 자주 하는 조정

| 증상 | 손댈 곳 |
|---|---|
| 입이 너무 작게/크게 움직임 | `updateMouth`의 `smoothstep(0.18, 0.75, rms / peak)` — 파형 RMS를 문장별 최고치로 나눈 값. 주파수(dB) 데이터로 벌림을 정하지 말 것: 조용한 구간도 커 보여 입이 계속 열린다 |
| 입 모양이 한 가지뿐 | 대역 비중 임계값 `ee: 0.19~0.3`, `ou: 0.47~0.57` (2026-11-21 Kokoro 녹음 실측 기준) |
| 팔이 몸을 뚫거나 T자 | `relaxPose`의 팔 회전값 (VRM 0.x/1.0 모두 three-vrm 정규화 본 기준) |
| 얼굴이 잘리거나 너무 멀다 | `FRAME_DISTANCE`, `frame()`의 세로 화면 배율 |
| 반응 표정 세기 | `REACTIONS` |

## 수치 점검 (립싱크를 바꿨다면 필수)

`sh .claude/skills/ee-avatar/scripts/measure-lipsync.sh` — 헤드리스 크롬에서 상대 대사 4개를 재생하며 입 값을 기록한다.
기대값: `mode`에 audio, `meanOpen` 0.3~0.5, `maxOpen` ≤ 0.95, `closedShare` 0.4~0.6, `shapes`에 aa·ee·ou, `ownAnswerMaxOpen` 0.
화면 확인은 `_workspace/avatar-test.html?ch=<챕터>&step=17` 을 헤드리스 스크린샷(`--use-angle=swiftshader`)으로.
(일반 크롬 탭은 백그라운드일 때 렌더링이 멈춰 스크린샷이 비어 보인다)

## 변경 후 확인

1. `npm run build:avatar` → `npm run stamp`
2. 브라우저에서 롤플레이 장면 진입 → 모델 표시, 상대 대사 재생 시 입 움직임, 정답/오답 시 표정
3. 390px 폭에서 아바타 무대 + 채팅 + 입력창이 함께 보이는지
