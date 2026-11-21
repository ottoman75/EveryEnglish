# 04 아바타 후보 조사 (2026-11-21, avatar-scout)

판정 기준: `.claude/skills/avatar-assets/skill.md` — 재배포 허용 라이선스 + 파일 메타 일치, 표정 aa/ih/ou/ee/oh·blink·happy(0.x: a/i/u/e/o·blink·joy), 일상 캐릭터, 기존 IP 아님.
표정은 이름만이 아니라 바인드(morph/texture)가 실제로 1개 이상 있는지도 확인했다.

## 요약

| 후보 | 성별/외형 | VRM | 필수 표정 | 원본 MB | 텍스처 최대 | 라이선스 | 판정 |
|---|---|---|---|---|---|---|---|
| VRM1_Constraint_Twist_Sample | 여 · 갈색 긴 머리, 흰 티·반바지 | 1.0 | 전부 있음 | 10.78 | 2048 | VRM Public License 1.0 (재배포·개변 허용, 크레딧 불필요) | ✅ 사용 |
| Seed-san | 소년형(중성) · SF 의상, 등에 로봇팔, 맨발 | 1.0 | 전부 있음 | 10.92 | 1024 | VRM Public License 1.0 (재배포·개변 허용, **크레딧 필수**) | ✅ 사용(임시 남성 대역) |
| AvatarSample_C (VRoid 공식) | 남 · 검은 머리, 스트리트웨어 | ? | 미확인 | ? | ? | pixiv 샘플 이용조건 (무료 재배포 허용, 크레딧 불필요) | ⏸ 보류 — 로그인 필요 |
| AvatarSample_A (VRoid 공식) | 여 · 단발, 카디건 | ? | 미확인 | ? | ? | 동일 | ⏸ 보류 — 로그인 필요 |
| 桜田 史利矢 (VRoid 공식, CC0) | 남 · 교복 | ? | 미확인 | ? | ? | CC0 | ⏸ 보류 — 로그인 필요 |
| 100Avatars (Jimmy/Kate/David/Olivia) | 로우폴리 카툰 | 0.x | **joy 없음** | 1.4–1.7 | 1024 | CC0 | ❌ 제외(현 요건) |
| NeonGlitch86 등 NFT 컬렉션 | 패러디·NFT 캐릭터 | – | – | – | – | 레지스트리상 CC0 | ❌ 제외 |
| AliciaSolid (UniVRM 테스트) | 니코니코 立体ちゃん | 0.x | – | 7.9 | – | 기존 IP, 별도 규약 | ❌ 제외(다운로드 안 함) |
| vrm-c 기능 테스트 모델 3종 | 테스트용 도형 | 1.0 | – | <0.1 | – | – | ❌ 제외(캐릭터 아님) |

---

## ✅ VRM1_Constraint_Twist_Sample — 사용 (여성)

- 파일: `assets/avatars/VRM1_Constraint_Twist_Sample.vrm` (sha256 `12c2b97e…31a2`)
- 출처: https://github.com/vrm-c/vrm-specification/tree/master/samples/VRM1_Constraint_Twist_Sample
  - 같은 파일(git blob `8ee8717d`)이 https://github.com/pixiv/three-vrm/tree/dev/packages/three-vrm/examples/models 에도 있음 (three-vrm 저장소 자체는 MIT지만 모델은 아래 README 라이선스를 따름)
- 출처 라이선스(README 원문): "[VRM Public License 1.0](https://vrm.dev/licenses/1.0/) (c) 2022 pixiv Inc."
- 파일 메타(VRMC_vrm.meta): `licenseUrl=https://vrm.dev/licenses/1.0/`, `avatarPermission=everyone`, `commercialUsage=corporation`, `allowRedistribution=true`, `modification=allowModificationRedistribution`, `creditNotation=unnecessary`, `allowAntisocialOrHateUsage=false`, copyright "(c) 2022 pixiv Inc." → **출처와 일치**
- VRM Public License 1.0 §2(a): 라이선스 설정에서 지정된 경우 "Redistribute the Licensed Work Data … create or reproduce Adapted Work Data; Redistribute any Adapted Work Data" 허용 → 웹 배포·텍스처 축소 후 재배포 모두 가능
- 표정: aa ih ou ee oh blink happy + angry sad surprised relaxed neutral, blinkL/R, look* (누락 없음, 각 1개 이상 morph 바인드)
- 텍스처 19장, 최대 2048px, 6.23MB → `shrink-vrm.py --max 1024` 후 8MB 이하 예상(미측정)
- 외형: 일상복 여성(VRoid 스타일 애니풍). 기존 작품 캐릭터 아님(pixiv 제작 샘플)

## ✅ Seed-san — 사용 (임시 남성 대역, 외형 조건부)

- 파일: `assets/avatars/Seed-san.vrm` (sha256 `624d0d55…9b23`)
- 출처: https://github.com/vrm-c/vrm-specification/tree/master/samples/Seed-san
- 출처 라이선스(README 원문): "[VRM Public License 1.0](https://vrm.dev/en/licenses/1.0/index) Seed-san model by VirtualCast, Inc."
- 파일 메타: `avatarPermission=everyone`, `commercialUsage=corporation`, `allowRedistribution=true`, `modification=allowModificationRedistribution`, **`creditNotation=required`**, copyright "VirtualCast, Inc." → **출처와 일치**
- 표정: 필수 전부 + angry sad surprised relaxed (happy는 morph+UV 바인드)
- 텍스처 15장, 최대 1024px, 6.95MB. 메시만 ~4MB라 텍스처를 512로 줄여야 8MB 근처 — 경량화 후 측정 필요
- 외형 문제: SF풍 흰 의상, 등에 큰 로봇팔, 맨발. 성별 표기가 공식적으로 없음(외형은 소년형). "밝은 일상 캐릭터" 요건에 완전히 맞지 않음 → 남성 대사용 **임시** 대역. AvatarSample_C 확보 시 교체 권장. 로봇팔 메시를 숨기는 개변은 라이선스상 허용.
- VirtualCast의 VRM 공식 샘플 캐릭터로, 애니·게임 IP가 아니고 메타에서 누구나 아바타 사용 허용.

## ⏸ VRoid 공식 샘플 — 사용자 수동 다운로드 필요

라이선스 조사 결과 **"AvatarSample_A/B/C는 CC0가 아니다"** (리드 정정). CC0는 구 베타판 샘플뿐이다.

- AvatarSample A〜Z 이용조건: https://vroid.pixiv.help/hc/ja/articles/4402394424089
  - 원문: 「どなたでも、無料で、営利・非営利を問わず、商業活動を含むさまざまな用途で利用できます」「クレジット表記は不要です」「本サンプルモデルのライセンスはCC0ではありません」
  - 금지 중 관련 항목: VRM 라이선스를 CC0로 바꿔 배포, 「正当な理由なく有償で再配布する行為」, pixiv 보증처럼 보이게 사용. → 무료 웹앱 탑재는 허용 범위.
  - VRoid Hub API의 모델 라이선스 설정(2026-11-21 조회): A·B·C 모두 `redistribution=allow, modification=allow, credit=unnecessary, corporate_commercial_use=allow`, `is_downloadable=true`
- CC0 모델 목록: https://vroid.pixiv.help/hc/ja/articles/4402614652569 — β Ver AvatarSample_1〜4, HairSample_Male/Female. 千駄ヶ谷 篠, 桜田 史利矢도 각 문서에서 CC0 명시 ("To the extent possible under law, pixiv Inc. has waived all copyright…")
- VRM 파일은 VRoid Hub에만 있고 **다운로드에 pixiv 로그인 + VRoid Hub 이용약관 동의 필요** (API 다운로드 요청 비로그인 404). 재업로드본(OpenGameArt 등)은 공식 출처가 아니라 사용하지 않음.

| 모델 | 성별/외형 | 페이지 (로그인 후 다운로드) |
|---|---|---|
| AvatarSample_C | 남 · 검은 머리, 트랙재킷 | https://hub.vroid.com/characters/1248981995540129234/models/8640547963669442173 |
| AvatarSample_A | 여 · 갈색 단발, 카디건 | https://hub.vroid.com/characters/2843975675147313744/models/5644550979324015604 |
| 桜田 史利矢 (CC0) | 남 · 교복(2018 구버전 모델) | https://hub.vroid.com/characters/6912965120285194650/models/2261505926203110716 |
| AvatarSample_B | 여 · 보라 트윈테일, 화려한 의상 | https://hub.vroid.com/characters/7939147878897061040/models/2292219474373673889 (일상 캐릭터로는 비추천) |

받은 뒤 `assets/avatars/`에 두면 inspect-vrm.py로 표정·용량을 확인하고 LICENSES.md에 추가한다.

## ❌ 제외

- **100Avatars** (https://github.com/PolygonalMind/100Avatars) — 파일 메타 `licenseName=CC0`, 레지스트리(https://github.com/ToxSam/open-source-avatars `projects.json`)도 CC0. 단 저장소 README에 "not to sell this avatars without any major modification" 요청 문구가 있음(무료 앱이라 저촉은 아님). 4개 인간형(003 Jimmy, 038 Kate, 047 David, 056 Olivia) 확인: a/i/u/e/o·blink 있음, **joy 없음** → 필수 요건 미달. 로우폴리 카툰 화풍이라 VRoid풍 여성 모델과 섞이면 어색. 1.4–1.7MB로 매우 가벼워, happy 요건을 완화하면 재검토 가치 있음. 내려받은 4개 파일은 삭제.
- **open-source-avatars 레지스트리의 NFT 컬렉션**(NeonGlitch86, Grifters, ToxSam, VIPE 등) — 다수가 패러디(Pepe 등)·브랜드 연상 캐릭터, 파일이 IPFS/Arweave. 일상 캐릭터 요건·IP 위험으로 제외(다운로드 안 함).
- **AliciaSolid** (vrm-c/UniVRM Tests/Models) — 니코니코 立体ちゃん, 기존 IP·별도 이용규약. 다운로드 안 함.
- **vrm-c 기능 테스트 모델**(isBinary_Overrides/Overridden, MToon_UV_Animation_Test) — 캐릭터가 아님.
- three-vrm 저장소의 예제 모델은 현재 VRM1_Constraint_Twist_Sample 하나뿐(위에서 채택).
