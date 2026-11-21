# 말하는 초상화 — 이미지 생성 가이드

인물 1명당 **같은 구도의 이미지 3장**(+ 선택 2장)을 만든다. 핵심은 **기본 이미지를 먼저 만들고, 나머지는 그 이미지를 '편집'해서 만드는 것** — 새로 생성하면 얼굴이 달라져 교차할 때 번져 보인다.

추천 도구: **ChatGPT(이미지 편집)** 또는 **Google Gemini(이미지 편집)** — 같은 이미지에서 입·눈만 바꾸는 편집이 잘 된다.

## 1) 기본 이미지 (base) — 공통 스타일 + 인물별 묘사

```
3D animated character portrait in a polished Pixar-like style, soft subsurface skin, big expressive eyes,
front-facing, looking straight at the camera, friendly relaxed closed-mouth smile.
Framing: vertical 4:5, head in the upper half, face centered, shoulders and upper chest visible,
hands not visible. Mouth must be clearly visible, nothing covering the face.
Lighting: warm soft key light, gentle background blur (shallow depth of field). No text, no logos.

Character: {인물 묘사}
Background: {배경}
```

## 2) 편집 이미지 — 1)에서 만든 이미지를 그대로 올리고 편집 요청

| 파일 | 편집 요청 (영어 그대로 복사) |
|---|---|
| `talk` (필수) | `Edit this exact image. Keep everything identical — same face, hair, clothes, background, framing and lighting. Only change the mouth: open it naturally mid-speech as if saying "ah", upper teeth slightly visible.` |
| `blink` (필수) | `Edit this exact image. Keep everything identical. Only change the eyes: both eyes gently closed in a natural blink. Mouth stays exactly as it is.` |
| `talkO` (선택) | `Edit this exact image. Keep everything identical. Only change the mouth: rounded as if saying "oo".` |
| `smile` (선택) | `Edit this exact image. Keep everything identical. Only change the expression: a big warm happy smile, as if praising someone.` |

## 3) 저장과 등록

폴더 하나에 `base.png`, `talk.png`, `blink.png` (+ `talkO.png`, `smile.png`)로 저장하고, 폴더 경로를 알려주면 등록한다.
직접 등록: `node tools/portrait-add.mjs <id> <폴더> --cast "<챕터:이름>"`
→ 입·눈 위치를 얼굴 인식으로 자동 측정하고, 편집 이미지가 기본과 구도가 다르면 경고한다.

---

## 인물별 묘사 (배역표 js/data/cast.js 기준 30명)

★ = 시범으로 먼저 만들 2명

| id | 등장인물 | 인물 묘사 (Character) | 배경 (Background) |
|---|---|---|---|
| ★ `barista-f` | cafe-order:Barista | friendly woman barista in her mid-20s, hair tied back, light-brown canvas apron over a cream t-shirt | cozy neighborhood café counter in the morning, espresso machine and pastry case behind her |
| ★ `host-m` | restaurant:Host | warm man in his 30s, neat short hair, black vest over a white shirt, restaurant host | entrance of a small Italian restaurant at evening, warm string lights, wine shelves |
| `emma-f` | self-intro:Emma | cheerful woman in her late 20s, casual blouse, holding no objects | lively house party living room at night, fairy lights, people blurred behind |
| `server-f` | restaurant:Server | smiling woman server in her 20s, black apron, white shirt | Italian restaurant dining room by the window at night |
| `passerby-f` | directions:Passerby | helpful woman in her 40s, light trench coat | city street sidewalk, shops and crosswalk, daytime |
| `station-m` | directions:Station Staff | subway station staff man in his 30s, navy uniform jacket and cap | subway station ticket machines and signboards |
| `driver-m` | directions:Bus Driver | friendly bus driver man in his 50s, uniform shirt | inside a city bus, driver's seat area, windows with street view |
| `sales-f` | shopping:Sales Associate | stylish sales associate woman in her 20s, name tag | clothing store with racks of shirts, bright retail lighting |
| `cashier-m` | shopping:Cashier | young male cashier in his 20s, store polo shirt | clothing store checkout counter |
| `service-f` | shopping:Customer Service | calm customer-service woman in her 30s, blazer | store customer service desk |
| `reception-f` | hotel:Receptionist | hotel receptionist woman in her 30s, dark uniform blazer, hair in a bun | elegant hotel front desk at night |
| `frontdesk-m` | hotel:Front Desk / phone-call:Front Desk | hotel front-desk man in his 30s, uniform blazer, headset optional | hotel back office / front desk phone |
| `agent-f` | airport:Agent | airline check-in agent woman, airline uniform scarf | airport check-in counter, departure boards |
| `officer-m` | airport:Officer | immigration officer man in his 40s, uniform shirt, calm serious but kind | airport immigration booth |
| `jessica-f` | small-talk:Jessica | coworker woman in her late 20s, office casual cardigan | office kitchenette, coffee machine, Monday morning light |
| `mark-m` | small-talk:Mark | neighbor man in his 30s, rain jacket, slightly wet hair | apartment elevator, rainy evening |
| `clinic-f` | doctor:Receptionist | clinic receptionist woman, scrubs top | walk-in clinic reception desk |
| `doctor-m` | doctor:Doctor | kind doctor man in his 40s, white coat, stethoscope | examination room |
| `pharmacist-f` | doctor:Pharmacist | pharmacist woman in her 30s, white coat | pharmacy prescription counter with shelves |
| `salon-f` | phone-call:Receptionist / phone-call:Amy | hair salon receptionist woman, stylish | hair salon front desk with mirrors |
| `jake-m` | making-plans:Jake / (self-intro 파티 주최) | friend man in his late 20s, hoodie, holding a phone | casual apartment living room, daytime |
| `interviewer-f` | job-interview:Interviewer | professional interviewer woman in her 40s, navy suit | modern office meeting room with glass walls |
| `rachel-f` | meeting:Rachel | team lead woman in her 30s, smart casual | office meeting room with a screen showing a timeline |
| `david-m` | meeting:David | colleague man in his 30s, shirt with rolled sleeves | same office meeting room |
| `restaurant-m` | solving-problems:Restaurant | restaurant staff man answering a phone, apron | restaurant kitchen pass / counter |
| `airbnb-f` | solving-problems:Host | Airbnb host woman in her 40s, cozy sweater | bright home interior |
| `server2-m` | solving-problems:Server | male server in his 20s, black shirt | restaurant at night |

등록할 때 `--cast`는 같은 id를 여러 인물에 줄 수 있다 (예: `frontdesk-m`을 hotel:Front Desk와 phone-call:Front Desk 둘 다).
초상화가 없는 인물은 기존 3D 아바타로 나온다 — 한 명씩 늘려 가도 된다.
