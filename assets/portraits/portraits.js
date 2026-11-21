/*
 * 2D 말하는 초상화 목록 (portrait-assets 스킬로 관리).
 * characters: 이미지 묶음 + 입·눈 영역(이미지 기준 비율, tools/portrait-detect 가 자동 측정)
 * cast: 등장인물("챕터:이름") → 캐릭터 id. 여기에 없는 인물은 3D 아바타로 나온다.
 */
(window.EE_PORTRAITS = {
    "characters": {},
    "cast": {}
});
