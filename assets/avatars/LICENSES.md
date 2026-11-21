# Avatar Licenses

확인 날짜: 2026-11-21. 출처 페이지 문구와 파일 내부 VRM 메타를 둘 다 확인했다.
경량화(텍스처 축소)한 파일도 아래 라이선스의 "Adapted Work Data 재배포 허용" 범위에 든다.

## VRM1_Constraint_Twist_Sample.vrm (여성)

- 출처: https://github.com/vrm-c/vrm-specification/tree/master/samples/VRM1_Constraint_Twist_Sample
  (동일 파일: https://github.com/pixiv/three-vrm/tree/dev/packages/three-vrm/examples/models)
- 라이선스: VRM Public License 1.0 — https://vrm.dev/licenses/1.0/
- 출처 문구: "VRM Public License 1.0 … (c) 2022 pixiv Inc."
- 파일 메타: avatarPermission=everyone, commercialUsage=corporation, allowRedistribution=true,
  modification=allowModificationRedistribution, creditNotation=unnecessary, allowAntisocialOrHateUsage=false
- 원본 sha256: 12c2b97e95e700783a6a550dc0eee2d7880aeedccef9ae67bc4c5a2f0f2631a2
- 크레딧(필수 아님, 표기 권장): `3D model: VRM1_Constraint_Twist_Sample © 2022 pixiv Inc. (VRM Public License 1.0)`

## Seed-san.vrm (소년형·중성, 임시 남성 대역)

- 출처: https://github.com/vrm-c/vrm-specification/tree/master/samples/Seed-san
- 라이선스: VRM Public License 1.0 — https://vrm.dev/licenses/1.0/
- 출처 문구: "VRM Public License 1.0 — Seed-san model by VirtualCast, Inc."
- 파일 메타: avatarPermission=everyone, commercialUsage=corporation, allowRedistribution=true,
  modification=allowModificationRedistribution, **creditNotation=required**, copyright "VirtualCast, Inc."
- 원본 sha256: 624d0d554bc205bbdc33e22a68a2c3c20edebb3e573011ead8878a65e5329b23
- 크레딧(**필수**, 앱 화면에 표시): `3D model: Seed-san by VirtualCast, Inc. (VRM Public License 1.0)`

## 앱에 포함된 파일 (경량화본)

| 파일 | 원본 | 처리 |
|---|---|---|
| `casual-f.vrm` | VRM1_Constraint_Twist_Sample.vrm | 텍스처 최대 1024px, 불투명 텍스처 JPEG 변환 (`shrink-vrm.py`) — VRM 메타·표정 유지 |
| `seed-m.vrm` | Seed-san.vrm | 동일. 크레딧은 롤플레이 화면 아바타 우하단에 표시. 실행 시 등의 로봇 팔(`robo_arm` 노드)을 숨김 — 라이선스 modification=allowModificationRedistribution 범위 |
