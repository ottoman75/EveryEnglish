---
name: portrait-assets
description: "EveryEnglish 2D '말하는 초상화' 대화 상대의 이미지 생성 가이드 작성, 사용자가 만든 이미지 등록(입·눈 영역 자동 측정, 구도 검사), 등장인물 연결, 교체·삭제를 한다. '초상화 추가', '캐릭터 이미지 넣었어', '이 이미지로 바리스타 바꿔줘', '프롬프트 만들어줘', '입이 이상하게 겹쳐 보여' 요청 시 반드시 이 스킬을 사용할 것. 3D VRM 모델은 avatar-assets, 렌더링·립싱크 코드는 ee-avatar 스킬이 담당한다."
---

# Portrait Assets

## 구조

| 파일 | 역할 |
|---|---|
| `assets/portraits/<id>/{base,talk,blink,talkO,smile}.jpg` | 같은 구도의 이미지들 (talkO·smile 선택) |
| `assets/portraits/portraits.js` | `characters`(이미지·입/눈 영역·비율) + `cast`("챕터:이름" → id) — 직접 고치지 말고 도구로 |
| `tools/portrait-add.mjs` | 등록 도구: 이미지 정리(JPEG, 긴 변 1024) → 얼굴 인식 → 구도 검사 → portraits.js 갱신 |
| `tools/portrait-detect.html` | 얼굴 인식 페이지 (MediaPipe Face Landmarker, Apache-2.0 — CDN에서 모델을 받으므로 인터넷 필요) |
| `js/app/portrait.js` | 렌더러: 입·눈 영역만 마스크로 교차, 고개·숨쉬기, 반응 |
| `_workspace/05_portrait-prompts.md` | 사용자용 이미지 생성 가이드(공통 스타일 + 인물별 묘사 + 편집 요청) |
| `tools/portrait-generate.py` | **맥에서 직접 생성** (SDXL, 라이선스 OpenRAIL++ — 생성물 상업 이용 가능). `base` → 후보 고르기 → `blink`(직접 그림) → `variants`(talk·talkBig 인페인팅) |

## 직접 생성 절차 (사용자가 이미지를 주지 않을 때)

준비: `~/.cache/everyenglish-imggen/venv` + SDXL 가중치(~7.4GB, `~/.cache/huggingface`). M1 16GB 기준 1장 ≈ 4~6분 — 한 번에 하나씩만(메모리).
1. `base <id> --character ".." --background ".." --seeds 33 44` → 후보를 눈으로 보고 고른다. 얼굴이 작으면 머리~가슴으로 잘라 832×1040으로 키워도 된다
2. 고른 이미지로 `portrait-add.mjs`(talk/blink에 같은 파일)를 한 번 돌려 `mouth`·`eyeL`·`eyeR`를 얻는다
3. `blink <id> --base .. --eyeL .. --eyeR ..` — **감은 눈은 생성 모델로 만들지 않는다**(SDXL은 4회 모두 눈을 뜬 채 다른 눈을 그렸다). 주변 피부로 복원 + 속눈썹 곡선
4. `variants <id> --base .. --mouth .. --eyes .. --seeds 8` → `talk`(살짝 벌림) + `talkBig`(크게). 등록 시 talkBig→`talk.png`, talk→`talkS.png` (2단계 입)
5. 실패 경험(스크립트에 반영됨): 다시 그릴 때 기본 스타일 문장(입 다문 미소)을 섞으면 입이 안 열린다 / 영역을 크게 잡으면 소리 지르는 입 / 얼굴 크게만 요청하면 회색 스튜디오 배경
6. 중간 산출물 `_workspace/portraits/`는 커밋하지 않는다(.gitignore)

## 입 영상 (상용 수준 — 이게 기본)

이미지 3장 전환은 소리 크기만 따라가 '열렸다 닫혔다'만 한다 → 사용자가 "상용화하기엔 너무 어색"하다고 했다.
대사마다 **SadTalker(Apache-2.0)** 로 입·턱 움직임 영상을 미리 만들어, 앱이 그 대사를 말할 때 입 상자에만 겹쳐 재생한다.

- 생성: `python3 tools/portrait-talk.py <id>` — cast에 연결된 상대 대사 전부, 증분. 대사 1개 ≈ 3분(M1, MPS), ≈ 25KB
- 준비(최초 1회): `~/.cache/everyenglish-talker/SadTalker` + Python 3.10 venv + 체크포인트. 이 맥에서 고친 것:
  basicsr `functional_tensor` import, `setuptools<70`(pkg_resources), MPS 패치(`inference.py` EE_MPS, facerender `.type()` → `_as_type`)
- **GFPGAN 얼굴 보정은 쓰지 않는다**(일부 구성요소 라이선스가 다름, 픽사풍엔 불필요)
- 앱: `portrait.js` `startVideo` — `videos[녹음파일명]`이 있으면 영상, 없으면 아래의 이미지 전환으로 대신. 영상은 무음 인라인이라 iPhone 자동재생 OK, 녹음 재생 시각과 0.08초 넘게 어긋나면 맞춘다
- 확인: 영상이 입 상자에 제자리로 겹치는지 — 페이지 안에서 canvas로 base + video 합성해 본다(스크린샷은 느려서 입 닫힌 순간만 찍힌다)

## 입 모양 기준 (사용자가 '입이 부자연스럽다'고 한 뒤 정한 것)

- **입은 섞지 않고 한 장씩 바꾼다** (`portrait.js` `pickMouth`: 닫힘/살짝/벌림, 히스테리시스 + 70ms 유지). 반투명으로 섞으면 입술이 이중으로 보이고, 검은 입이 옅게 깔려 '콧수염 얼룩'처럼 보였다
- **`talk`는 '적당히' 벌린 입**(윗니, 혀 X) — `variants --only talkMid`. 크게 벌린 '아~'(talkBig)는 말하는 시간의 1/3 동안 소리 지르는 얼굴이 된다
- **`talkS`(살짝)는 `talk`를 눌러서 만든다**: `scripts/derive-mouth.py squash` — 따로 생성하면 거의 안 열리거나 다른 사람 입처럼 보인다
- **수염·질감이 있는 얼굴**: 생성 결과를 그대로 쓰지 말고 `derive-mouth.py keep`으로 '크게 달라진 부분'만 붙인다. 안 그러면 입이 열릴 때마다 턱에 매끈한 사각형이 생긴다
- **확인은 `scripts/simulate-mouth.py`** — 앱과 같은 계산으로 대사 한 줄의 입 프레임 시트를 그린다. 기대: 겹침 없음, 전환 초당 4~7회, talk 비중 40% 이하

## 원칙과 이유

- **변형 이미지는 반드시 기본 이미지를 '편집'해서 만든다.** 새로 생성하면 얼굴이 달라진다. 마스크가 입·눈 밖을 가려 주지만, 영역 안의 피부·턱선까지 달라지면 교차할 때 번져 보인다. 등록 도구의 구도 차이(`align`)가 0.06을 넘으면 다시 만들게 한다.
- **구도**: 세로 4:5, 얼굴은 위쪽 절반, 가슴까지. 자막이 무대 아래쪽에 뜨므로 입이 너무 아래에 있으면 가린다.
- 이미지는 사용자가 외부 도구(ChatGPT·Gemini 편집)로 만들어 주거나, `tools/portrait-generate.py`로 맥에서 직접 만든다.
- **남의 캐릭터 금지**: 광고·작품 속 캐릭터를 그대로 쓰지 않는다(테스트로만, 커밋 금지).
- 초상화가 없는 인물은 3D 아바타로 나온다 — 부분 등록이 정상 상태다.

## 등록 절차

1. 사용자가 폴더 경로를 준다 → `node tools/portrait-add.mjs <id> <폴더> --cast "<챕터:이름>" [--cast ...]`
2. 출력의 `align` 확인. 경고가 있으면 어떤 이미지를 다시 편집할지 사용자에게 알린다
3. 입·눈 영역 눈 확인이 필요하면 영역을 그려 본다 (영역은 이미지 기준 비율 x,y,rx,ry)
4. `npm run stamp` → 모바일 점검(`ee-avatar` 스킬의 cdp-mobile)으로 해당 챕터 롤플레이에서 입이 녹음에 맞춰 움직이는지, 자막이 입을 가리지 않는지 확인
5. 이미지 용량: 장당 100~250KB 목표. 인물 1명 ≈ 0.5~1MB
