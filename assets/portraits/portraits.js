/*
 * 2D 말하는 초상화 목록 (portrait-assets 스킬로 관리).
 * characters: 이미지 묶음 + 입·눈 영역(이미지 기준 비율, tools/portrait-detect 가 자동 측정)
 * cast: 등장인물("챕터:이름") → 캐릭터 id. 여기에 없는 인물은 3D 아바타로 나온다.
 */
(window.EE_PORTRAITS = {
    "characters": {
        "barista-f": {
            "base": "assets/portraits/barista-f/base.jpg",
            "talk": "assets/portraits/barista-f/talk.jpg",
            "talkS": "assets/portraits/barista-f/talkS.jpg",
            "blink": "assets/portraits/barista-f/blink.jpg",
            "mouth": {
                "x": 0.4894,
                "y": 0.5106,
                "rx": 0.1776,
                "ry": 0.0663
            },
            "eyes": {
                "x": 0.4848,
                "y": 0.3395,
                "rx": 0.2215,
                "ry": 0.1065
            },
            "eyeL": {
                "x": 0.3767,
                "y": 0.3419,
                "rx": 0.0457,
                "ry": 0.0205
            },
            "eyeR": {
                "x": 0.5895,
                "y": 0.3371,
                "rx": 0.0491,
                "ry": 0.0196
            },
            "aspect": 0.7998,
            "credit": ""
        },
        "host-m": {
            "base": "assets/portraits/host-m/base.jpg",
            "talk": "assets/portraits/host-m/talk.jpg",
            "talkS": "assets/portraits/host-m/talkS.jpg",
            "blink": "assets/portraits/host-m/blink.jpg",
            "mouth": {
                "x": 0.5227,
                "y": 0.4971,
                "rx": 0.1363,
                "ry": 0.0747
            },
            "eyes": {
                "x": 0.5227,
                "y": 0.332,
                "rx": 0.1757,
                "ry": 0.0951
            },
            "eyeL": {
                "x": 0.4417,
                "y": 0.3312,
                "rx": 0.0411,
                "ry": 0.0181
            },
            "eyeR": {
                "x": 0.6037,
                "y": 0.3329,
                "rx": 0.041,
                "ry": 0.0183
            },
            "aspect": 0.7998,
            "credit": ""
        }
    },
    "cast": {
        "cafe-order:Barista": "barista-f",
        "ui:barista": "barista-f",
        "restaurant:Host": "host-m"
    }
});
