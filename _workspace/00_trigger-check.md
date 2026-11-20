# 스킬 트리거 점검 (설명문 기준 수동 판정)

| 쿼리 | 기대 스킬 | 근거 |
|---|---|---|
| "공항 챕터에 수하물 분실 장면 하나 더 넣어줘" | chapter-authoring | 챕터 대화 수정 |
| "병원 챕터 정답 너무 빡빡해, 변형 좀 늘려줘" | chapter-authoring | answers 보강 |
| "여행 챕터 5개 새로 만들어줘" | everyenglish-orchestrator | 다수 챕터 → 병렬 작성+QA |
| "듣기 받아쓰기 모드 추가해줘" | everyenglish-orchestrator | 화면+데이터+채점 엔드투엔드 |
| "다크모드에서 버튼 색이 안 보여" | ee-frontend | CSS |
| "'gonna'도 맞게 처리해줘" | ee-frontend | grader 정규화 |
| "집중케어 복습 간격 바꿔줘" | ee-frontend | srs |
| "배포 전에 전체 점검해줘" | ee-qa (또는 orchestrator Phase 3) | 검수 |
| "맞게 말했는데 틀렸대" | ee-qa → chapter-authoring/ee-frontend | 원인 분리 후 수정 |

## Should-NOT (근접 오답)

| 쿼리 | 트리거되면 안 되는 스킬 | 실제로 맞는 것 |
|---|---|---|
| "앱스토어에 올릴 설명 문구 써줘" | chapter-authoring | marketing-copy (웹앱이라 스토어 출시 자체가 범위 밖일 수 있음) |
| "영어 단어 뜻 알려줘" | chapter-authoring | 일반 대화 |
| "이 코드 스타일 리뷰해줘" | ee-qa | code-review |
| "iOS 앱으로 만들어줘" | ee-frontend | 범위 밖 — intend.md 확인 후 사용자와 논의 |
