---
name: avatar-assets
description: "EveryEnglish 3D 대화 상대(아바타)에 쓸 VRM/GLB 캐릭터 모델을 찾고, 라이선스·기술 요건을 검증하고, 모바일용으로 경량화해 assets/avatars/에 등록한다. '아바타 캐릭터 추가', '3D 모델 찾아줘', '캐릭터 바꿔줘', '모델 용량 줄여줘', '이 VRM 써도 돼?' 요청 시 반드시 이 스킬을 사용할 것. 아바타 렌더링·립싱크 코드 수정은 ee-avatar 스킬이 담당한다."
---

# Avatar Assets

## 1. 라이선스가 먼저다

공개 웹앱(GitHub Pages)에 파일을 그대로 올려 배포하므로, **재배포가 허용된** 모델만 쓴다.

| 판정 | 조건 |
|---|---|
| ✅ 사용 | CC0, CC‑BY(크레딧 표기), MIT 등 재배포 허용 + 상업/비상업 무관하게 웹앱 탑재 가능 |
| ⚠️ 보류 | VRM 라이선스 메타(avatarPermission, allowRedistribution 등)가 애매하거나 출처 페이지와 파일 메타가 다름 |
| ❌ 제외 | 재배포 금지, 출처 불명, 로그인 뒤에만 있고 라이선스 문서를 확인할 수 없음, 기존 캐릭터(애니·게임·실존 인물) 모작 |

- 출처 페이지의 라이선스 문구와 **파일 내부 메타데이터**(VRM 0.x `meta`, VRM 1.0 `VRMC_vrm.meta`)를 둘 다 확인한다. 둘이 다르면 보류.
- 확인한 근거(URL, 라이선스 원문 한 줄, 확인 날짜)를 `assets/avatars/LICENSES.md`에 남긴다. 나중에 "이거 써도 되나"를 다시 조사하지 않기 위해서다.

## 2. 기술 요건

| 항목 | 요건 | 이유 |
|---|---|---|
| 형식 | VRM 0.x 또는 1.0 (three-vrm이 둘 다 지원) | 표정 이름이 표준화되어 있어 코드 하나로 모든 모델을 움직인다 |
| 표정 | 입 모양 `aa ih ou ee oh`(0.x: `A I U E O`), `blink`, `happy` 필수. `sad`, `surprised`, `relaxed` 있으면 좋음 | 립싱크·깜빡임·피드백 표정에 쓴다 |
| 용량 | 경량화 후 **8MB 이하** 권장 | 폰 데이터·로딩 시간. 롤플레이 화면에서만 지연 로딩한다 |
| 화풍 | 밝은 일상 캐릭터. 남·여 각 1명 이상 | 상대 대사 녹음이 남·여 목소리로 나뉘어 있어 외형을 맞춘다 |

## 3. 경량화

`scripts/inspect-vrm.py <file>` — 버전·표정 목록·텍스처 크기·라이선스 메타를 출력한다.
`scripts/shrink-vrm.py <in> <out> --max 1024` — 텍스처를 최대 1024px로 줄여 다시 묶는다(VRM 확장은 그대로 둔다).

## 4. 등록

1. `assets/avatars/<id>.vrm` 로 저장
2. `assets/avatars/avatars.js` 의 목록에 `{ id, file, gender, credit, license, sourceUrl }` 추가
3. `assets/avatars/LICENSES.md` 에 근거 추가
4. 앱에서 롤플레이 장면 하나를 열어 입·눈·표정이 움직이는지 확인
