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
            "credit": "",
            "videos": {
                "54d81a716515f3b5.m4a": "assets/portraits/barista-f/v/54d81a716515f3b5.mp4",
                "072ed8908bfda158.m4a": "assets/portraits/barista-f/v/072ed8908bfda158.mp4",
                "fbdd85b43beda160.m4a": "assets/portraits/barista-f/v/fbdd85b43beda160.mp4",
                "8115a7f9975b7e9c.m4a": "assets/portraits/barista-f/v/8115a7f9975b7e9c.mp4",
                "b6cd4dcfca1d0642.m4a": "assets/portraits/barista-f/v/b6cd4dcfca1d0642.mp4",
                "0d3a1e16acefd721.m4a": "assets/portraits/barista-f/v/0d3a1e16acefd721.mp4",
                "fa89b6baefa0fb72.m4a": "assets/portraits/barista-f/v/fa89b6baefa0fb72.mp4",
                "8ee6113c1223298a.m4a": "assets/portraits/barista-f/v/8ee6113c1223298a.mp4",
                "655ab99a91e2ec95.m4a": "assets/portraits/barista-f/v/655ab99a91e2ec95.mp4",
                "ff77c0d3e3eb6859.m4a": "assets/portraits/barista-f/v/ff77c0d3e3eb6859.mp4",
                "a58db1053a8a3a4d.m4a": "assets/portraits/barista-f/v/a58db1053a8a3a4d.mp4",
                "d6947af26f2dc555.m4a": "assets/portraits/barista-f/v/d6947af26f2dc555.mp4",
                "798338a830625f65.m4a": "assets/portraits/barista-f/v/798338a830625f65.mp4",
                "a2bace045166da89.m4a": "assets/portraits/barista-f/v/a2bace045166da89.mp4",
                "c7dcd71051f0eeaf.m4a": "assets/portraits/barista-f/v/c7dcd71051f0eeaf.mp4",
                "6f4e3e700cd2f263.m4a": "assets/portraits/barista-f/v/6f4e3e700cd2f263.mp4",
                "e63f6801a125c989.m4a": "assets/portraits/barista-f/v/e63f6801a125c989.mp4"
            },
            "videoBox": {
                "x0": 0.2763,
                "y0": 0.378,
                "x1": 0.7025,
                "y1": 0.6962
            }
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
            "credit": "",
            "videos": {
                "07be33d8842f1271.m4a": "assets/portraits/host-m/v/07be33d8842f1271.mp4",
                "0e66225ea4b8b691.m4a": "assets/portraits/host-m/v/0e66225ea4b8b691.mp4",
                "394a6c88b65e0f9a.m4a": "assets/portraits/host-m/v/394a6c88b65e0f9a.mp4",
                "4975edf2283f9897.m4a": "assets/portraits/host-m/v/4975edf2283f9897.mp4",
                "f47183acb28f6b9e.m4a": "assets/portraits/host-m/v/f47183acb28f6b9e.mp4",
                "8b70e265ece5ce4f.m4a": "assets/portraits/host-m/v/8b70e265ece5ce4f.mp4"
            },
            "videoBox": {
                "x0": 0.3591,
                "y0": 0.3477,
                "x1": 0.6863,
                "y1": 0.7063
            }
        }
    },
    "cast": {
        "cafe-order:Barista": "barista-f",
        "ui:barista": "barista-f",
        "restaurant:Host": "host-m"
    }
});
