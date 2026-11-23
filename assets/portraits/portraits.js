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
        },
        "sales-f": {
            "base": "assets/portraits/sales-f/base.jpg",
            "talk": "assets/portraits/sales-f/talk.jpg",
            "blink": "assets/portraits/sales-f/blink.jpg",
            "mouth": {
                "x": 0.4603,
                "y": 0.4962,
                "rx": 0.1649,
                "ry": 0.067
            },
            "eyes": {
                "x": 0.5028,
                "y": 0.341,
                "rx": 0.18,
                "ry": 0.0759
            },
            "eyeL": {
                "x": 0.4239,
                "y": 0.3221,
                "rx": 0.0435,
                "ry": 0.0146
            },
            "eyeR": {
                "x": 0.5887,
                "y": 0.36,
                "rx": 0.0365,
                "ry": 0.0135
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "7bbdbb50f8ca9dfc.m4a": "assets/portraits/sales-f/v/7bbdbb50f8ca9dfc.mp4",
                "3bfe2e8f61187961.m4a": "assets/portraits/sales-f/v/3bfe2e8f61187961.mp4",
                "e802c0435c73caad.m4a": "assets/portraits/sales-f/v/e802c0435c73caad.mp4",
                "81914448d8a2bb59.m4a": "assets/portraits/sales-f/v/81914448d8a2bb59.mp4",
                "264c567640d4c414.m4a": "assets/portraits/sales-f/v/264c567640d4c414.mp4"
            },
            "videoBox": {
                "x0": 0.2624,
                "y0": 0.3622,
                "x1": 0.6582,
                "y1": 0.6838
            },
            "talkS": "assets/portraits/sales-f/talkS.jpg"
        },
        "emma-f": {
            "base": "assets/portraits/emma-f/base.jpg",
            "talk": "assets/portraits/emma-f/talk.jpg",
            "blink": "assets/portraits/emma-f/blink.jpg",
            "mouth": {
                "x": 0.5604,
                "y": 0.5446,
                "rx": 0.2045,
                "ry": 0.0927
            },
            "eyes": {
                "x": 0.5649,
                "y": 0.3616,
                "rx": 0.1939,
                "ry": 0.0517
            },
            "eyeL": {
                "x": 0.4758,
                "y": 0.3654,
                "rx": 0.0454,
                "ry": 0.0096
            },
            "eyeR": {
                "x": 0.6623,
                "y": 0.3577,
                "rx": 0.0371,
                "ry": 0.0099
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "7aa5c3ed127c77a9.m4a": "assets/portraits/emma-f/v/7aa5c3ed127c77a9.mp4",
                "d63821d20a564464.m4a": "assets/portraits/emma-f/v/d63821d20a564464.mp4",
                "09beeb614194ad5d.m4a": "assets/portraits/emma-f/v/09beeb614194ad5d.mp4",
                "c4abbea673649263.m4a": "assets/portraits/emma-f/v/c4abbea673649263.mp4",
                "989538bccc2475d4.m4a": "assets/portraits/emma-f/v/989538bccc2475d4.mp4",
                "ab2d74c80e97f5b3.m4a": "assets/portraits/emma-f/v/ab2d74c80e97f5b3.mp4",
                "eb57cc457c14969e.m4a": "assets/portraits/emma-f/v/eb57cc457c14969e.mp4",
                "d0fd4b09f9f267fc.m4a": "assets/portraits/emma-f/v/d0fd4b09f9f267fc.mp4",
                "2529980b0f6e8ae6.m4a": "assets/portraits/emma-f/v/2529980b0f6e8ae6.mp4",
                "50038b511bf7125e.m4a": "assets/portraits/emma-f/v/50038b511bf7125e.mp4",
                "a6e03934aad91585.m4a": "assets/portraits/emma-f/v/a6e03934aad91585.mp4",
                "88ccde6c579859cd.m4a": "assets/portraits/emma-f/v/88ccde6c579859cd.mp4",
                "a30bdeb55b2a460f.m4a": "assets/portraits/emma-f/v/a30bdeb55b2a460f.mp4",
                "bfb1da7e36fb139e.m4a": "assets/portraits/emma-f/v/bfb1da7e36fb139e.mp4",
                "1f2f373c2dbbfb55.m4a": "assets/portraits/emma-f/v/1f2f373c2dbbfb55.mp4",
                "156f185fb46cedac.m4a": "assets/portraits/emma-f/v/156f185fb46cedac.mp4",
                "ca4cffb0ece7ea5a.m4a": "assets/portraits/emma-f/v/ca4cffb0ece7ea5a.mp4"
            },
            "videoBox": {
                "x0": 0.315,
                "y0": 0.3592,
                "x1": 0.8058,
                "y1": 0.8042
            },
            "talkS": "assets/portraits/emma-f/talkS.jpg"
        },
        "server-f": {
            "base": "assets/portraits/server-f/base.jpg",
            "talk": "assets/portraits/server-f/talk.jpg",
            "blink": "assets/portraits/server-f/blink.jpg",
            "mouth": {
                "x": 0.5064,
                "y": 0.4958,
                "rx": 0.178,
                "ry": 0.0662
            },
            "eyes": {
                "x": 0.5026,
                "y": 0.3414,
                "rx": 0.1858,
                "ry": 0.0717
            },
            "eyeL": {
                "x": 0.4137,
                "y": 0.3411,
                "rx": 0.0401,
                "ry": 0.0138
            },
            "eyeR": {
                "x": 0.5902,
                "y": 0.3418,
                "rx": 0.0414,
                "ry": 0.0131
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "37fa399e87897c8a.m4a": "assets/portraits/server-f/v/37fa399e87897c8a.mp4",
                "972e437b19ba8c7e.m4a": "assets/portraits/server-f/v/972e437b19ba8c7e.mp4",
                "cd0b2686de7eb9cc.m4a": "assets/portraits/server-f/v/cd0b2686de7eb9cc.mp4",
                "0a9461294e090f62.m4a": "assets/portraits/server-f/v/0a9461294e090f62.mp4",
                "af23c2a999792065.m4a": "assets/portraits/server-f/v/af23c2a999792065.mp4",
                "b10794af47d7bb6d.m4a": "assets/portraits/server-f/v/b10794af47d7bb6d.mp4",
                "bcf47fec47d2b93b.m4a": "assets/portraits/server-f/v/bcf47fec47d2b93b.mp4",
                "d8671e40cf95734a.m4a": "assets/portraits/server-f/v/d8671e40cf95734a.mp4",
                "dd96a37b83a8806c.m4a": "assets/portraits/server-f/v/dd96a37b83a8806c.mp4",
                "476b3cecd7ac8359.m4a": "assets/portraits/server-f/v/476b3cecd7ac8359.mp4",
                "5467f51bcb79ab5c.m4a": "assets/portraits/server-f/v/5467f51bcb79ab5c.mp4"
            },
            "videoBox": {
                "x0": 0.2928,
                "y0": 0.3634,
                "x1": 0.72,
                "y1": 0.6812
            },
            "talkS": "assets/portraits/server-f/talkS.jpg"
        },
        "passerby-f": {
            "base": "assets/portraits/passerby-f/base.jpg",
            "talk": "assets/portraits/passerby-f/talk.jpg",
            "blink": "assets/portraits/passerby-f/blink.jpg",
            "mouth": {
                "x": 0.5057,
                "y": 0.4946,
                "rx": 0.1812,
                "ry": 0.0729
            },
            "eyes": {
                "x": 0.501,
                "y": 0.3401,
                "rx": 0.1742,
                "ry": 0.0408
            },
            "eyeL": {
                "x": 0.4182,
                "y": 0.3432,
                "rx": 0.0381,
                "ry": 0.0071
            },
            "eyeR": {
                "x": 0.5856,
                "y": 0.3369,
                "rx": 0.0363,
                "ry": 0.0078
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "04127b40191e629f.m4a": "assets/portraits/passerby-f/v/04127b40191e629f.mp4",
                "1cf367ecef79baf1.m4a": "assets/portraits/passerby-f/v/1cf367ecef79baf1.mp4",
                "32949b74f8aa5a72.m4a": "assets/portraits/passerby-f/v/32949b74f8aa5a72.mp4",
                "a42ecf023308db78.m4a": "assets/portraits/passerby-f/v/a42ecf023308db78.mp4",
                "aaa780f2fed8b70e.m4a": "assets/portraits/passerby-f/v/aaa780f2fed8b70e.mp4"
            },
            "videoBox": {
                "x0": 0.2883,
                "y0": 0.3488,
                "x1": 0.7231,
                "y1": 0.6987
            },
            "talkS": "assets/portraits/passerby-f/talkS.jpg"
        },
        "station-m": {
            "base": "assets/portraits/station-m/base.jpg",
            "talk": "assets/portraits/station-m/talk.jpg",
            "blink": "assets/portraits/station-m/blink.jpg",
            "mouth": {
                "x": 0.5057,
                "y": 0.495,
                "rx": 0.166,
                "ry": 0.0679
            },
            "eyes": {
                "x": 0.5021,
                "y": 0.3409,
                "rx": 0.1667,
                "ry": 0.0647
            },
            "eyeL": {
                "x": 0.4223,
                "y": 0.344,
                "rx": 0.0359,
                "ry": 0.0125
            },
            "eyeR": {
                "x": 0.5788,
                "y": 0.3379,
                "rx": 0.039,
                "ry": 0.0124
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "f2fdc2972ecf2480.m4a": "assets/portraits/station-m/v/f2fdc2972ecf2480.mp4",
                "91e4495b8c71e276.m4a": "assets/portraits/station-m/v/91e4495b8c71e276.mp4",
                "723a69461193e06f.m4a": "assets/portraits/station-m/v/723a69461193e06f.mp4",
                "389e4d1bbeda5477.m4a": "assets/portraits/station-m/v/389e4d1bbeda5477.mp4",
                "cfa3b3166df7cb05.m4a": "assets/portraits/station-m/v/cfa3b3166df7cb05.mp4",
                "50553b473e54dfe2.m4a": "assets/portraits/station-m/v/50553b473e54dfe2.mp4"
            },
            "videoBox": {
                "x0": 0.3065,
                "y0": 0.3592,
                "x1": 0.7049,
                "y1": 0.6851
            },
            "talkS": "assets/portraits/station-m/talkS.jpg"
        },
        "driver-m": {
            "base": "assets/portraits/driver-m/base.jpg",
            "talk": "assets/portraits/driver-m/talk.jpg",
            "blink": "assets/portraits/driver-m/blink.jpg",
            "mouth": {
                "x": 0.372,
                "y": 0.4122,
                "rx": 0.1552,
                "ry": 0.0665
            },
            "eyes": {
                "x": 0.3888,
                "y": 0.258,
                "rx": 0.1623,
                "ry": 0.0648
            },
            "eyeL": {
                "x": 0.3147,
                "y": 0.2473,
                "rx": 0.0377,
                "ry": 0.0125
            },
            "eyeR": {
                "x": 0.4652,
                "y": 0.2687,
                "rx": 0.0354,
                "ry": 0.0114
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "a7fdab19dbb6696d.m4a": "assets/portraits/driver-m/v/a7fdab19dbb6696d.mp4",
                "c4bea0571d1778d3.m4a": "assets/portraits/driver-m/v/c4bea0571d1778d3.mp4",
                "a5ed28b1410dbb05.m4a": "assets/portraits/driver-m/v/a5ed28b1410dbb05.mp4",
                "27806cb1028705e7.m4a": "assets/portraits/driver-m/v/27806cb1028705e7.mp4",
                "df770323e32a6744.m4a": "assets/portraits/driver-m/v/df770323e32a6744.mp4",
                "e41fa3f1bfec4002.m4a": "assets/portraits/driver-m/v/e41fa3f1bfec4002.mp4"
            },
            "videoBox": {
                "x0": 0.1858,
                "y0": 0.2792,
                "x1": 0.5582,
                "y1": 0.5984
            },
            "talkS": "assets/portraits/driver-m/talkS.jpg"
        },
        "cashier-m": {
            "base": "assets/portraits/cashier-m/base.jpg",
            "talk": "assets/portraits/cashier-m/talk.jpg",
            "blink": "assets/portraits/cashier-m/blink.jpg",
            "mouth": {
                "x": 0.5066,
                "y": 0.4949,
                "rx": 0.1721,
                "ry": 0.0683
            },
            "eyes": {
                "x": 0.5027,
                "y": 0.3424,
                "rx": 0.1656,
                "ry": 0.0788
            },
            "eyeL": {
                "x": 0.4271,
                "y": 0.3443,
                "rx": 0.0393,
                "ry": 0.0152
            },
            "eyeR": {
                "x": 0.5817,
                "y": 0.3405,
                "rx": 0.036,
                "ry": 0.015
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "4621fe468db1f78f.m4a": "assets/portraits/cashier-m/v/4621fe468db1f78f.mp4",
                "be64fc750dfc78ee.m4a": "assets/portraits/cashier-m/v/be64fc750dfc78ee.mp4",
                "1f757a64666a2a6f.m4a": "assets/portraits/cashier-m/v/1f757a64666a2a6f.mp4",
                "b7e85f3fa42bd03e.m4a": "assets/portraits/cashier-m/v/b7e85f3fa42bd03e.mp4",
                "4364c9e6b6e9daac.m4a": "assets/portraits/cashier-m/v/4364c9e6b6e9daac.mp4",
                "05b3902663620255.m4a": "assets/portraits/cashier-m/v/05b3902663620255.mp4"
            },
            "videoBox": {
                "x0": 0.3001,
                "y0": 0.3583,
                "x1": 0.7131,
                "y1": 0.6861
            },
            "talkS": "assets/portraits/cashier-m/talkS.jpg"
        },
        "service-f": {
            "base": "assets/portraits/service-f/base.jpg",
            "talk": "assets/portraits/service-f/talk.jpg",
            "blink": "assets/portraits/service-f/blink.jpg",
            "mouth": {
                "x": 0.5058,
                "y": 0.4955,
                "rx": 0.165,
                "ry": 0.0655
            },
            "eyes": {
                "x": 0.5018,
                "y": 0.3419,
                "rx": 0.1805,
                "ry": 0.0685
            },
            "eyeL": {
                "x": 0.4151,
                "y": 0.3427,
                "rx": 0.0387,
                "ry": 0.0132
            },
            "eyeR": {
                "x": 0.5898,
                "y": 0.3411,
                "rx": 0.0373,
                "ry": 0.0119
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "69d33fda1d9020d4.m4a": "assets/portraits/service-f/v/69d33fda1d9020d4.mp4",
                "bf562b904b496130.m4a": "assets/portraits/service-f/v/bf562b904b496130.mp4",
                "d768d438e34040ae.m4a": "assets/portraits/service-f/v/d768d438e34040ae.mp4",
                "9dccb4244f2084af.m4a": "assets/portraits/service-f/v/9dccb4244f2084af.mp4",
                "368021e4b3af9d05.m4a": "assets/portraits/service-f/v/368021e4b3af9d05.mp4",
                "fe81299e0a01db32.m4a": "assets/portraits/service-f/v/fe81299e0a01db32.mp4"
            },
            "videoBox": {
                "x0": 0.3078,
                "y0": 0.3645,
                "x1": 0.7038,
                "y1": 0.6789
            },
            "talkS": "assets/portraits/service-f/talkS.jpg"
        },
        "reception-f": {
            "base": "assets/portraits/reception-f/base.jpg",
            "talk": "assets/portraits/reception-f/talk.jpg",
            "blink": "assets/portraits/reception-f/blink.jpg",
            "mouth": {
                "x": 0.5091,
                "y": 0.4934,
                "rx": 0.1529,
                "ry": 0.069
            },
            "eyes": {
                "x": 0.5012,
                "y": 0.3402,
                "rx": 0.1665,
                "ry": 0.0618
            },
            "eyeL": {
                "x": 0.4221,
                "y": 0.344,
                "rx": 0.0364,
                "ry": 0.0114
            },
            "eyeR": {
                "x": 0.5765,
                "y": 0.3364,
                "rx": 0.0402,
                "ry": 0.0119
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "838e9e094c17d5f0.m4a": "assets/portraits/reception-f/v/838e9e094c17d5f0.mp4",
                "0b428e7527fac0ea.m4a": "assets/portraits/reception-f/v/0b428e7527fac0ea.mp4",
                "329236f2083dd7d3.m4a": "assets/portraits/reception-f/v/329236f2083dd7d3.mp4",
                "a30d633dbbc3d244.m4a": "assets/portraits/reception-f/v/a30d633dbbc3d244.mp4",
                "1bb19891d2d340b3.m4a": "assets/portraits/reception-f/v/1bb19891d2d340b3.mp4",
                "01ffa3a361c45586.m4a": "assets/portraits/reception-f/v/01ffa3a361c45586.mp4",
                "d59d1ecce258a8ca.m4a": "assets/portraits/reception-f/v/d59d1ecce258a8ca.mp4",
                "836f042798cd109d.m4a": "assets/portraits/reception-f/v/836f042798cd109d.mp4",
                "3458e1475bb89693.m4a": "assets/portraits/reception-f/v/3458e1475bb89693.mp4",
                "9d7ef3071a303443.m4a": "assets/portraits/reception-f/v/9d7ef3071a303443.mp4",
                "9a12f042f94400fd.m4a": "assets/portraits/reception-f/v/9a12f042f94400fd.mp4",
                "23188d200c78f08f.m4a": "assets/portraits/reception-f/v/23188d200c78f08f.mp4"
            },
            "videoBox": {
                "x0": 0.3256,
                "y0": 0.3554,
                "x1": 0.6926,
                "y1": 0.6866
            },
            "talkS": "assets/portraits/reception-f/talkS.jpg"
        },
        "frontdesk-m": {
            "base": "assets/portraits/frontdesk-m/base.jpg",
            "talk": "assets/portraits/frontdesk-m/talk.jpg",
            "blink": "assets/portraits/frontdesk-m/blink.jpg",
            "mouth": {
                "x": 0.4894,
                "y": 0.4903,
                "rx": 0.1683,
                "ry": 0.0685
            },
            "eyes": {
                "x": 0.4953,
                "y": 0.343,
                "rx": 0.1593,
                "ry": 0.0706
            },
            "eyeL": {
                "x": 0.4226,
                "y": 0.3394,
                "rx": 0.0378,
                "ry": 0.0136
            },
            "eyeR": {
                "x": 0.5729,
                "y": 0.3465,
                "rx": 0.0329,
                "ry": 0.0121
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "66cf9f93838a003c.m4a": "assets/portraits/frontdesk-m/v/66cf9f93838a003c.mp4",
                "45976af07a06ade5.m4a": "assets/portraits/frontdesk-m/v/45976af07a06ade5.mp4",
                "9405be04a529dda8.m4a": "assets/portraits/frontdesk-m/v/9405be04a529dda8.mp4",
                "2ef8425a44a6426a.m4a": "assets/portraits/frontdesk-m/v/2ef8425a44a6426a.mp4",
                "5bf37e0152d328f7.m4a": "assets/portraits/frontdesk-m/v/5bf37e0152d328f7.mp4",
                "3b6de37499f28d23.m4a": "assets/portraits/frontdesk-m/v/3b6de37499f28d23.mp4",
                "5f5c0ae84fdc1063.m4a": "assets/portraits/frontdesk-m/v/5f5c0ae84fdc1063.mp4",
                "5fd89eb91fc6f8b9.m4a": "assets/portraits/frontdesk-m/v/5fd89eb91fc6f8b9.mp4",
                "ea381b72bd21f8d2.m4a": "assets/portraits/frontdesk-m/v/ea381b72bd21f8d2.mp4",
                "170cd144147014da.m4a": "assets/portraits/frontdesk-m/v/170cd144147014da.mp4",
                "a41dac8a09f46391.m4a": "assets/portraits/frontdesk-m/v/a41dac8a09f46391.mp4"
            },
            "videoBox": {
                "x0": 0.2874,
                "y0": 0.3533,
                "x1": 0.6914,
                "y1": 0.6821
            },
            "talkS": "assets/portraits/frontdesk-m/talkS.jpg"
        },
        "agent-f": {
            "base": "assets/portraits/agent-f/base.jpg",
            "talk": "assets/portraits/agent-f/talk.jpg",
            "blink": "assets/portraits/agent-f/blink.jpg",
            "mouth": {
                "x": 0.5001,
                "y": 0.494,
                "rx": 0.1545,
                "ry": 0.0633
            },
            "eyes": {
                "x": 0.4998,
                "y": 0.3413,
                "rx": 0.1671,
                "ry": 0.074
            },
            "eyeL": {
                "x": 0.4163,
                "y": 0.3403,
                "rx": 0.0325,
                "ry": 0.0133
            },
            "eyeR": {
                "x": 0.5759,
                "y": 0.3424,
                "rx": 0.04,
                "ry": 0.0142
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "5f6cae4176c45e72.m4a": "assets/portraits/agent-f/v/5f6cae4176c45e72.mp4",
                "00f80878db0e3e9f.m4a": "assets/portraits/agent-f/v/00f80878db0e3e9f.mp4",
                "152a974ba1ed75a4.m4a": "assets/portraits/agent-f/v/152a974ba1ed75a4.mp4",
                "ee1b1559014b88f0.m4a": "assets/portraits/agent-f/v/ee1b1559014b88f0.mp4",
                "da153c0872a755e6.m4a": "assets/portraits/agent-f/v/da153c0872a755e6.mp4",
                "fa0908874a4fae95.m4a": "assets/portraits/agent-f/v/fa0908874a4fae95.mp4",
                "9cff496fab93d5a0.m4a": "assets/portraits/agent-f/v/9cff496fab93d5a0.mp4",
                "94abbcd66df761fd.m4a": "assets/portraits/agent-f/v/94abbcd66df761fd.mp4",
                "1b28b1ff5d4989ac.m4a": "assets/portraits/agent-f/v/1b28b1ff5d4989ac.mp4",
                "4c785e01af99c0eb.m4a": "assets/portraits/agent-f/v/4c785e01af99c0eb.mp4"
            },
            "videoBox": {
                "x0": 0.3147,
                "y0": 0.3674,
                "x1": 0.6855,
                "y1": 0.6712
            },
            "talkS": "assets/portraits/agent-f/talkS.jpg"
        },
        "officer-m": {
            "base": "assets/portraits/officer-m/base.jpg",
            "talk": "assets/portraits/officer-m/talk.jpg",
            "blink": "assets/portraits/officer-m/blink.jpg",
            "mouth": {
                "x": 0.4421,
                "y": 0.5461,
                "rx": 0.1851,
                "ry": 0.0808
            },
            "eyes": {
                "x": 0.4321,
                "y": 0.3629,
                "rx": 0.1755,
                "ry": 0.0746
            },
            "eyeL": {
                "x": 0.3472,
                "y": 0.3668,
                "rx": 0.0368,
                "ry": 0.0131
            },
            "eyeR": {
                "x": 0.5086,
                "y": 0.3591,
                "rx": 0.0452,
                "ry": 0.0143
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "bc1cebc037a3c12d.m4a": "assets/portraits/officer-m/v/bc1cebc037a3c12d.mp4",
                "7dfc9ea0b453798d.m4a": "assets/portraits/officer-m/v/7dfc9ea0b453798d.mp4",
                "d00727bae09ce29d.m4a": "assets/portraits/officer-m/v/d00727bae09ce29d.mp4",
                "337bfb9c376ab033.m4a": "assets/portraits/officer-m/v/337bfb9c376ab033.mp4",
                "3ece658bb32a671a.m4a": "assets/portraits/officer-m/v/3ece658bb32a671a.mp4",
                "818be39bf34f99fe.m4a": "assets/portraits/officer-m/v/818be39bf34f99fe.mp4"
            },
            "videoBox": {
                "x0": 0.22,
                "y0": 0.3845,
                "x1": 0.6642,
                "y1": 0.7723
            },
            "talkS": "assets/portraits/officer-m/talkS.jpg"
        },
        "jessica-f": {
            "base": "assets/portraits/jessica-f/base.jpg",
            "talk": "assets/portraits/jessica-f/talk.jpg",
            "blink": "assets/portraits/jessica-f/blink.jpg",
            "mouth": {
                "x": 0.5297,
                "y": 0.4962,
                "rx": 0.1715,
                "ry": 0.064
            },
            "eyes": {
                "x": 0.504,
                "y": 0.3413,
                "rx": 0.1829,
                "ry": 0.0625
            },
            "eyeL": {
                "x": 0.4144,
                "y": 0.3528,
                "rx": 0.0364,
                "ry": 0.0118
            },
            "eyeR": {
                "x": 0.5868,
                "y": 0.3297,
                "rx": 0.0433,
                "ry": 0.012
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "2ef8daaeb797eace.m4a": "assets/portraits/jessica-f/v/2ef8daaeb797eace.mp4",
                "ac87434a922957f4.m4a": "assets/portraits/jessica-f/v/ac87434a922957f4.mp4",
                "c6f20b35446b33c2.m4a": "assets/portraits/jessica-f/v/c6f20b35446b33c2.mp4",
                "5329f81231d195ba.m4a": "assets/portraits/jessica-f/v/5329f81231d195ba.mp4",
                "5c2c12bf9e93fbb0.m4a": "assets/portraits/jessica-f/v/5c2c12bf9e93fbb0.mp4",
                "1a39632000231b5c.m4a": "assets/portraits/jessica-f/v/1a39632000231b5c.mp4",
                "5d447c131e1b2557.m4a": "assets/portraits/jessica-f/v/5d447c131e1b2557.mp4",
                "7987fe6baf57687a.m4a": "assets/portraits/jessica-f/v/7987fe6baf57687a.mp4",
                "d55c6aaab1cbb261.m4a": "assets/portraits/jessica-f/v/d55c6aaab1cbb261.mp4",
                "a0ce96da897137b8.m4a": "assets/portraits/jessica-f/v/a0ce96da897137b8.mp4",
                "79cb19dc3557e818.m4a": "assets/portraits/jessica-f/v/79cb19dc3557e818.mp4"
            },
            "videoBox": {
                "x0": 0.3239,
                "y0": 0.3682,
                "x1": 0.7355,
                "y1": 0.6754
            },
            "talkS": "assets/portraits/jessica-f/talkS.jpg"
        },
        "mark-m": {
            "base": "assets/portraits/mark-m/base.jpg",
            "talk": "assets/portraits/mark-m/talk.jpg",
            "blink": "assets/portraits/mark-m/blink.jpg",
            "mouth": {
                "x": 0.5755,
                "y": 0.5133,
                "rx": 0.1931,
                "ry": 0.093
            },
            "eyes": {
                "x": 0.5909,
                "y": 0.3308,
                "rx": 0.1811,
                "ry": 0.0509
            },
            "eyeL": {
                "x": 0.5089,
                "y": 0.3201,
                "rx": 0.0429,
                "ry": 0.0098
            },
            "eyeR": {
                "x": 0.6779,
                "y": 0.3415,
                "rx": 0.0379,
                "ry": 0.0085
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "76abeb94b6d0b2ae.m4a": "assets/portraits/mark-m/v/76abeb94b6d0b2ae.mp4",
                "3f0c5859dbd32c98.m4a": "assets/portraits/mark-m/v/3f0c5859dbd32c98.mp4",
                "9617d3174ce1d98c.m4a": "assets/portraits/mark-m/v/9617d3174ce1d98c.mp4",
                "57493d0aad41debe.m4a": "assets/portraits/mark-m/v/57493d0aad41debe.mp4",
                "30c3a9271eb9ba33.m4a": "assets/portraits/mark-m/v/30c3a9271eb9ba33.mp4"
            },
            "videoBox": {
                "x0": 0.3438,
                "y0": 0.3273,
                "x1": 0.8072,
                "y1": 0.7737
            },
            "talkS": "assets/portraits/mark-m/talkS.jpg"
        },
        "clinic-f": {
            "base": "assets/portraits/clinic-f/base.jpg",
            "talk": "assets/portraits/clinic-f/talk.jpg",
            "blink": "assets/portraits/clinic-f/blink.jpg",
            "mouth": {
                "x": 0.529,
                "y": 0.4958,
                "rx": 0.1449,
                "ry": 0.0643
            },
            "eyes": {
                "x": 0.5041,
                "y": 0.3412,
                "rx": 0.1777,
                "ry": 0.096
            },
            "eyeL": {
                "x": 0.4228,
                "y": 0.3519,
                "rx": 0.0412,
                "ry": 0.0179
            },
            "eyeR": {
                "x": 0.5875,
                "y": 0.3305,
                "rx": 0.0391,
                "ry": 0.0185
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "ec43f5f74dfe7f9c.m4a": "assets/portraits/clinic-f/v/ec43f5f74dfe7f9c.mp4",
                "fdb84a374cb50685.m4a": "assets/portraits/clinic-f/v/fdb84a374cb50685.mp4",
                "f033c4e01f599062.m4a": "assets/portraits/clinic-f/v/f033c4e01f599062.mp4",
                "fd6eff744515fc51.m4a": "assets/portraits/clinic-f/v/fd6eff744515fc51.mp4",
                "cca9ed3291055ca9.m4a": "assets/portraits/clinic-f/v/cca9ed3291055ca9.mp4"
            },
            "videoBox": {
                "x0": 0.3551,
                "y0": 0.3672,
                "x1": 0.7029,
                "y1": 0.6758
            },
            "talkS": "assets/portraits/clinic-f/talkS.jpg"
        },
        "doctor-m": {
            "base": "assets/portraits/doctor-m/base.jpg",
            "talk": "assets/portraits/doctor-m/talk.jpg",
            "blink": "assets/portraits/doctor-m/blink.jpg",
            "mouth": {
                "x": 0.5242,
                "y": 0.5322,
                "rx": 0.1682,
                "ry": 0.077
            },
            "eyes": {
                "x": 0.5309,
                "y": 0.3542,
                "rx": 0.1752,
                "ry": 0.0557
            },
            "eyeL": {
                "x": 0.4486,
                "y": 0.3537,
                "rx": 0.0393,
                "ry": 0.0104
            },
            "eyeR": {
                "x": 0.6157,
                "y": 0.3546,
                "rx": 0.0368,
                "ry": 0.0107
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "3b94abbdc3b7adae.m4a": "assets/portraits/doctor-m/v/3b94abbdc3b7adae.mp4",
                "0bf7fdefe45daf03.m4a": "assets/portraits/doctor-m/v/0bf7fdefe45daf03.mp4",
                "dd1c2526117642c9.m4a": "assets/portraits/doctor-m/v/dd1c2526117642c9.mp4",
                "ea3feb0c3b6bcbfc.m4a": "assets/portraits/doctor-m/v/ea3feb0c3b6bcbfc.mp4",
                "75d40480a91f8e79.m4a": "assets/portraits/doctor-m/v/75d40480a91f8e79.mp4",
                "f7384fcaba637370.m4a": "assets/portraits/doctor-m/v/f7384fcaba637370.mp4"
            },
            "videoBox": {
                "x0": 0.3224,
                "y0": 0.3782,
                "x1": 0.726,
                "y1": 0.7478
            },
            "talkS": "assets/portraits/doctor-m/talkS.jpg"
        },
        "pharmacist-f": {
            "base": "assets/portraits/pharmacist-f/base.jpg",
            "talk": "assets/portraits/pharmacist-f/talk.jpg",
            "blink": "assets/portraits/pharmacist-f/blink.jpg",
            "mouth": {
                "x": 0.5078,
                "y": 0.4947,
                "rx": 0.1653,
                "ry": 0.0673
            },
            "eyes": {
                "x": 0.5019,
                "y": 0.3421,
                "rx": 0.1972,
                "ry": 0.0822
            },
            "eyeL": {
                "x": 0.4085,
                "y": 0.3425,
                "rx": 0.0436,
                "ry": 0.0158
            },
            "eyeR": {
                "x": 0.5921,
                "y": 0.3416,
                "rx": 0.0468,
                "ry": 0.0156
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "52902f685c0a37a4.m4a": "assets/portraits/pharmacist-f/v/52902f685c0a37a4.mp4",
                "5a344f12bb74630d.m4a": "assets/portraits/pharmacist-f/v/5a344f12bb74630d.mp4",
                "42c1e4f463b5a97e.m4a": "assets/portraits/pharmacist-f/v/42c1e4f463b5a97e.mp4",
                "89e962d21cd98ad4.m4a": "assets/portraits/pharmacist-f/v/89e962d21cd98ad4.mp4",
                "d2ad2428f083e393.m4a": "assets/portraits/pharmacist-f/v/d2ad2428f083e393.mp4",
                "4d6fa8d38efba175.m4a": "assets/portraits/pharmacist-f/v/4d6fa8d38efba175.mp4"
            },
            "videoBox": {
                "x0": 0.3094,
                "y0": 0.3601,
                "x1": 0.7062,
                "y1": 0.6831
            },
            "talkS": "assets/portraits/pharmacist-f/talkS.jpg"
        },
        "salon-f": {
            "base": "assets/portraits/salon-f/base.jpg",
            "talk": "assets/portraits/salon-f/talk.jpg",
            "blink": "assets/portraits/salon-f/blink.jpg",
            "mouth": {
                "x": 0.5311,
                "y": 0.4941,
                "rx": 0.1393,
                "ry": 0.0666
            },
            "eyes": {
                "x": 0.5017,
                "y": 0.3406,
                "rx": 0.1578,
                "ry": 0.0666
            },
            "eyeL": {
                "x": 0.425,
                "y": 0.3484,
                "rx": 0.0323,
                "ry": 0.0128
            },
            "eyeR": {
                "x": 0.5708,
                "y": 0.3328,
                "rx": 0.04,
                "ry": 0.0128
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "80d71e2bdb6867d5.m4a": "assets/portraits/salon-f/v/80d71e2bdb6867d5.mp4",
                "be8b14dbdf9a9afd.m4a": "assets/portraits/salon-f/v/be8b14dbdf9a9afd.mp4",
                "2f4ae348694207d8.m4a": "assets/portraits/salon-f/v/2f4ae348694207d8.mp4",
                "a972f4bf2fe27c33.m4a": "assets/portraits/salon-f/v/a972f4bf2fe27c33.mp4",
                "7edc52576c20429a.m4a": "assets/portraits/salon-f/v/7edc52576c20429a.mp4",
                "17e3812faed26be1.m4a": "assets/portraits/salon-f/v/17e3812faed26be1.mp4"
            },
            "videoBox": {
                "x0": 0.3639,
                "y0": 0.3609,
                "x1": 0.6983,
                "y1": 0.6806
            },
            "talkS": "assets/portraits/salon-f/talkS.jpg"
        },
        "amy-f": {
            "base": "assets/portraits/amy-f/base.jpg",
            "talk": "assets/portraits/amy-f/talk.jpg",
            "blink": "assets/portraits/amy-f/blink.jpg",
            "mouth": {
                "x": 0.5077,
                "y": 0.4957,
                "rx": 0.179,
                "ry": 0.0684
            },
            "eyes": {
                "x": 0.5013,
                "y": 0.3416,
                "rx": 0.1819,
                "ry": 0.0679
            },
            "eyeL": {
                "x": 0.4117,
                "y": 0.3454,
                "rx": 0.0366,
                "ry": 0.0131
            },
            "eyeR": {
                "x": 0.5844,
                "y": 0.3378,
                "rx": 0.0431,
                "ry": 0.0126
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "4dee8db0570ed57c.m4a": "assets/portraits/amy-f/v/4dee8db0570ed57c.mp4",
                "39fa32590c6500d5.m4a": "assets/portraits/amy-f/v/39fa32590c6500d5.mp4",
                "4257642355411605.m4a": "assets/portraits/amy-f/v/4257642355411605.mp4",
                "bf9b540add27d77f.m4a": "assets/portraits/amy-f/v/bf9b540add27d77f.mp4",
                "e9bedb78dcd71154.m4a": "assets/portraits/amy-f/v/e9bedb78dcd71154.mp4",
                "66f77b09274395cf.m4a": "assets/portraits/amy-f/v/66f77b09274395cf.mp4"
            },
            "videoBox": {
                "x0": 0.2929,
                "y0": 0.3589,
                "x1": 0.7225,
                "y1": 0.6872
            },
            "talkS": "assets/portraits/amy-f/talkS.jpg"
        },
        "jake-m": {
            "base": "assets/portraits/jake-m/base.jpg",
            "talk": "assets/portraits/jake-m/talk.jpg",
            "blink": "assets/portraits/jake-m/blink.jpg",
            "mouth": {
                "x": 0.488,
                "y": 0.4963,
                "rx": 0.152,
                "ry": 0.0754
            },
            "eyes": {
                "x": 0.5008,
                "y": 0.3425,
                "rx": 0.1623,
                "ry": 0.0608
            },
            "eyeL": {
                "x": 0.4277,
                "y": 0.3331,
                "rx": 0.039,
                "ry": 0.0113
            },
            "eyeR": {
                "x": 0.5768,
                "y": 0.3519,
                "rx": 0.0361,
                "ry": 0.0117
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "9dcd357329500816.m4a": "assets/portraits/jake-m/v/9dcd357329500816.mp4",
                "9594215014184d3a.m4a": "assets/portraits/jake-m/v/9594215014184d3a.mp4",
                "28b7227da5d446d7.m4a": "assets/portraits/jake-m/v/28b7227da5d446d7.mp4",
                "9d857ab082eea5d5.m4a": "assets/portraits/jake-m/v/9d857ab082eea5d5.mp4",
                "3bb3d240a9fa13f0.m4a": "assets/portraits/jake-m/v/3bb3d240a9fa13f0.mp4",
                "106cf907a769623f.m4a": "assets/portraits/jake-m/v/106cf907a769623f.mp4",
                "ef6c7ee267f7f008.m4a": "assets/portraits/jake-m/v/ef6c7ee267f7f008.mp4",
                "bdb4b47285b41eb0.m4a": "assets/portraits/jake-m/v/bdb4b47285b41eb0.mp4",
                "59cdfb442b63f6b7.m4a": "assets/portraits/jake-m/v/59cdfb442b63f6b7.mp4",
                "63d4fc074b1a3dcb.m4a": "assets/portraits/jake-m/v/63d4fc074b1a3dcb.mp4",
                "b7fbddbf4e89d97a.m4a": "assets/portraits/jake-m/v/b7fbddbf4e89d97a.mp4",
                "50079ce1a4646330.m4a": "assets/portraits/jake-m/v/50079ce1a4646330.mp4",
                "cfb04e43a4087b43.m4a": "assets/portraits/jake-m/v/cfb04e43a4087b43.mp4",
                "b91cfaf33162a449.m4a": "assets/portraits/jake-m/v/b91cfaf33162a449.mp4",
                "86d33a7e1ac191c1.m4a": "assets/portraits/jake-m/v/86d33a7e1ac191c1.mp4",
                "4b3ee61deefa4687.m4a": "assets/portraits/jake-m/v/4b3ee61deefa4687.mp4",
                "d3442fad286b835b.m4a": "assets/portraits/jake-m/v/d3442fad286b835b.mp4"
            },
            "videoBox": {
                "x0": 0.3056,
                "y0": 0.3455,
                "x1": 0.6704,
                "y1": 0.7074
            },
            "talkS": "assets/portraits/jake-m/talkS.jpg"
        },
        "interviewer-f": {
            "base": "assets/portraits/interviewer-f/base.jpg",
            "talk": "assets/portraits/interviewer-f/talk.jpg",
            "blink": "assets/portraits/interviewer-f/blink.jpg",
            "mouth": {
                "x": 0.4968,
                "y": 0.4951,
                "rx": 0.1567,
                "ry": 0.0785
            },
            "eyes": {
                "x": 0.5015,
                "y": 0.3402,
                "rx": 0.1689,
                "ry": 0.0476
            },
            "eyeL": {
                "x": 0.4201,
                "y": 0.3388,
                "rx": 0.0359,
                "ry": 0.0091
            },
            "eyeR": {
                "x": 0.5837,
                "y": 0.3416,
                "rx": 0.0351,
                "ry": 0.009
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "8144a5375e084d34.m4a": "assets/portraits/interviewer-f/v/8144a5375e084d34.mp4",
                "fa1c184a31b3e891.m4a": "assets/portraits/interviewer-f/v/fa1c184a31b3e891.mp4",
                "df46205933315515.m4a": "assets/portraits/interviewer-f/v/df46205933315515.mp4",
                "fb964ec33fbf164e.m4a": "assets/portraits/interviewer-f/v/fb964ec33fbf164e.mp4",
                "03a7e8eaa941912f.m4a": "assets/portraits/interviewer-f/v/03a7e8eaa941912f.mp4",
                "b7fc9595fa6289e1.m4a": "assets/portraits/interviewer-f/v/b7fc9595fa6289e1.mp4",
                "bb5fcba04037f1c5.m4a": "assets/portraits/interviewer-f/v/bb5fcba04037f1c5.mp4",
                "bb011a11af9af2c6.m4a": "assets/portraits/interviewer-f/v/bb011a11af9af2c6.mp4",
                "040b4c5dc2f346e9.m4a": "assets/portraits/interviewer-f/v/040b4c5dc2f346e9.mp4",
                "167ac547c7a5fa39.m4a": "assets/portraits/interviewer-f/v/167ac547c7a5fa39.mp4",
                "aae81c284b62ab9c.m4a": "assets/portraits/interviewer-f/v/aae81c284b62ab9c.mp4",
                "14bf198439b16101.m4a": "assets/portraits/interviewer-f/v/14bf198439b16101.mp4",
                "8353444ebdc21a6b.m4a": "assets/portraits/interviewer-f/v/8353444ebdc21a6b.mp4",
                "c6d2bb89913e843a.m4a": "assets/portraits/interviewer-f/v/c6d2bb89913e843a.mp4",
                "0428ec388ba1cc9b.m4a": "assets/portraits/interviewer-f/v/0428ec388ba1cc9b.mp4",
                "2b7a2526aa6028c2.m4a": "assets/portraits/interviewer-f/v/2b7a2526aa6028c2.mp4"
            },
            "videoBox": {
                "x0": 0.3088,
                "y0": 0.3381,
                "x1": 0.6848,
                "y1": 0.7149
            },
            "talkS": "assets/portraits/interviewer-f/talkS.jpg"
        },
        "rachel-f": {
            "base": "assets/portraits/rachel-f/base.jpg",
            "talk": "assets/portraits/rachel-f/talk.jpg",
            "blink": "assets/portraits/rachel-f/blink.jpg",
            "mouth": {
                "x": 0.4982,
                "y": 0.4944,
                "rx": 0.1564,
                "ry": 0.072
            },
            "eyes": {
                "x": 0.5041,
                "y": 0.3394,
                "rx": 0.1694,
                "ry": 0.0514
            },
            "eyeL": {
                "x": 0.4253,
                "y": 0.339,
                "rx": 0.0388,
                "ry": 0.0099
            },
            "eyeR": {
                "x": 0.5851,
                "y": 0.3399,
                "rx": 0.0367,
                "ry": 0.0095
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "30aee5344e1fb12e.m4a": "assets/portraits/rachel-f/v/30aee5344e1fb12e.mp4",
                "08d32768b91159cc.m4a": "assets/portraits/rachel-f/v/08d32768b91159cc.mp4",
                "673c0771ec0e55b3.m4a": "assets/portraits/rachel-f/v/673c0771ec0e55b3.mp4",
                "f1bb031563ef6f6e.m4a": "assets/portraits/rachel-f/v/f1bb031563ef6f6e.mp4",
                "d1d363cff2f72f7c.m4a": "assets/portraits/rachel-f/v/d1d363cff2f72f7c.mp4",
                "1314f6bd5570afcf.m4a": "assets/portraits/rachel-f/v/1314f6bd5570afcf.mp4",
                "9affebd94dabf92b.m4a": "assets/portraits/rachel-f/v/9affebd94dabf92b.mp4",
                "946492d2b1bf6e69.m4a": "assets/portraits/rachel-f/v/946492d2b1bf6e69.mp4",
                "dd24a4c1923e6762.m4a": "assets/portraits/rachel-f/v/dd24a4c1923e6762.mp4",
                "e75172d5c6fb8f05.m4a": "assets/portraits/rachel-f/v/e75172d5c6fb8f05.mp4",
                "9f4115387e74d320.m4a": "assets/portraits/rachel-f/v/9f4115387e74d320.mp4"
            },
            "videoBox": {
                "x0": 0.3105,
                "y0": 0.3504,
                "x1": 0.6859,
                "y1": 0.696
            },
            "talkS": "assets/portraits/rachel-f/talkS.jpg"
        },
        "david-m": {
            "base": "assets/portraits/david-m/base.jpg",
            "talk": "assets/portraits/david-m/talk.jpg",
            "blink": "assets/portraits/david-m/blink.jpg",
            "mouth": {
                "x": 0.498,
                "y": 0.4949,
                "rx": 0.1277,
                "ry": 0.0674
            },
            "eyes": {
                "x": 0.5005,
                "y": 0.3407,
                "rx": 0.1567,
                "ry": 0.0416
            },
            "eyeL": {
                "x": 0.4239,
                "y": 0.3395,
                "rx": 0.0322,
                "ry": 0.008
            },
            "eyeR": {
                "x": 0.5759,
                "y": 0.3419,
                "rx": 0.0335,
                "ry": 0.0079
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "091b161fa55d63ea.m4a": "assets/portraits/david-m/v/091b161fa55d63ea.mp4",
                "0fe904d72fbd790f.m4a": "assets/portraits/david-m/v/0fe904d72fbd790f.mp4",
                "9716bd6e0392862f.m4a": "assets/portraits/david-m/v/9716bd6e0392862f.mp4",
                "e0cc666cfa46f5eb.m4a": "assets/portraits/david-m/v/e0cc666cfa46f5eb.mp4",
                "3325cb80f3a5e5e7.m4a": "assets/portraits/david-m/v/3325cb80f3a5e5e7.mp4"
            },
            "videoBox": {
                "x0": 0.3448,
                "y0": 0.3601,
                "x1": 0.6512,
                "y1": 0.6836
            },
            "talkS": "assets/portraits/david-m/talkS.jpg"
        },
        "restaurant-m": {
            "base": "assets/portraits/restaurant-m/base.jpg",
            "talk": "assets/portraits/restaurant-m/talk.jpg",
            "blink": "assets/portraits/restaurant-m/blink.jpg",
            "mouth": {
                "x": 0.507,
                "y": 0.4939,
                "rx": 0.1957,
                "ry": 0.072
            },
            "eyes": {
                "x": 0.4999,
                "y": 0.3422,
                "rx": 0.166,
                "ry": 0.0685
            },
            "eyeL": {
                "x": 0.4228,
                "y": 0.347,
                "rx": 0.038,
                "ry": 0.0131
            },
            "eyeR": {
                "x": 0.5794,
                "y": 0.3375,
                "rx": 0.0357,
                "ry": 0.0132
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "d9b304d684dab1c5.m4a": "assets/portraits/restaurant-m/v/d9b304d684dab1c5.mp4",
                "0f3af78107ed4131.m4a": "assets/portraits/restaurant-m/v/0f3af78107ed4131.mp4",
                "c1c452aebefd7462.m4a": "assets/portraits/restaurant-m/v/c1c452aebefd7462.mp4",
                "29f342f6627ac579.m4a": "assets/portraits/restaurant-m/v/29f342f6627ac579.mp4",
                "d15133d540166f07.m4a": "assets/portraits/restaurant-m/v/d15133d540166f07.mp4"
            },
            "videoBox": {
                "x0": 0.2722,
                "y0": 0.3499,
                "x1": 0.7418,
                "y1": 0.6955
            },
            "talkS": "assets/portraits/restaurant-m/talkS.jpg"
        },
        "airbnb-f": {
            "base": "assets/portraits/airbnb-f/base.jpg",
            "talk": "assets/portraits/airbnb-f/talk.jpg",
            "blink": "assets/portraits/airbnb-f/blink.jpg",
            "mouth": {
                "x": 0.4924,
                "y": 0.4942,
                "rx": 0.1576,
                "ry": 0.0686
            },
            "eyes": {
                "x": 0.5151,
                "y": 0.3407,
                "rx": 0.1532,
                "ry": 0.0393
            },
            "eyeL": {
                "x": 0.4415,
                "y": 0.3338,
                "rx": 0.0324,
                "ry": 0.0076
            },
            "eyeR": {
                "x": 0.5893,
                "y": 0.3475,
                "rx": 0.0317,
                "ry": 0.0071
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "3465cefcdd3d3e94.m4a": "assets/portraits/airbnb-f/v/3465cefcdd3d3e94.mp4",
                "de1af24985bae5ab.m4a": "assets/portraits/airbnb-f/v/de1af24985bae5ab.mp4",
                "abd9b933fd5ed82d.m4a": "assets/portraits/airbnb-f/v/abd9b933fd5ed82d.mp4",
                "8eda55f3bcc8ba22.m4a": "assets/portraits/airbnb-f/v/8eda55f3bcc8ba22.mp4",
                "4b46331695fd31bd.m4a": "assets/portraits/airbnb-f/v/4b46331695fd31bd.mp4",
                "e8f60143142b02de.m4a": "assets/portraits/airbnb-f/v/e8f60143142b02de.mp4"
            },
            "videoBox": {
                "x0": 0.3033,
                "y0": 0.357,
                "x1": 0.6815,
                "y1": 0.6863
            },
            "talkS": "assets/portraits/airbnb-f/talkS.jpg"
        },
        "server2-m": {
            "base": "assets/portraits/server2-m/base.jpg",
            "talk": "assets/portraits/server2-m/talk.jpg",
            "blink": "assets/portraits/server2-m/blink.jpg",
            "mouth": {
                "x": 0.4984,
                "y": 0.4932,
                "rx": 0.197,
                "ry": 0.076
            },
            "eyes": {
                "x": 0.5008,
                "y": 0.3411,
                "rx": 0.1765,
                "ry": 0.0744
            },
            "eyeL": {
                "x": 0.4192,
                "y": 0.3415,
                "rx": 0.041,
                "ry": 0.0139
            },
            "eyeR": {
                "x": 0.5804,
                "y": 0.3407,
                "rx": 0.0429,
                "ry": 0.0143
            },
            "aspect": 0.7998,
            "credit": "",
            "videos": {
                "be6841d26a84e6b0.m4a": "assets/portraits/server2-m/v/be6841d26a84e6b0.mp4",
                "9f0f7c26ea23c29b.m4a": "assets/portraits/server2-m/v/9f0f7c26ea23c29b.mp4",
                "0847662ff39cb024.m4a": "assets/portraits/server2-m/v/0847662ff39cb024.mp4",
                "d960290c0414e344.m4a": "assets/portraits/server2-m/v/d960290c0414e344.mp4",
                "f2886f24201a82cc.m4a": "assets/portraits/server2-m/v/f2886f24201a82cc.mp4"
            },
            "videoBox": {
                "x0": 0.262,
                "y0": 0.3412,
                "x1": 0.7348,
                "y1": 0.706
            },
            "talkS": "assets/portraits/server2-m/talkS.jpg"
        }
    },
    "cast": {
        "cafe-order:Barista": "barista-f",
        "ui:barista": "barista-f",
        "restaurant:Host": "host-m",
        "shopping:Sales Associate": "sales-f",
        "self-intro:Emma": "emma-f",
        "restaurant:Server": "server-f",
        "directions:Passerby": "passerby-f",
        "directions:Station Staff": "station-m",
        "directions:Bus Driver": "driver-m",
        "shopping:Cashier": "cashier-m",
        "shopping:Customer Service": "service-f",
        "hotel:Receptionist": "reception-f",
        "hotel:Front Desk": "frontdesk-m",
        "phone-call:Front Desk": "frontdesk-m",
        "airport:Agent": "agent-f",
        "airport:Officer": "officer-m",
        "small-talk:Jessica": "jessica-f",
        "small-talk:Mark": "mark-m",
        "doctor:Receptionist": "clinic-f",
        "doctor:Doctor": "doctor-m",
        "doctor:Pharmacist": "pharmacist-f",
        "phone-call:Receptionist": "salon-f",
        "phone-call:Amy": "amy-f",
        "making-plans:Jake": "jake-m",
        "job-interview:Interviewer": "interviewer-f",
        "meeting:Rachel": "rachel-f",
        "meeting:David": "david-m",
        "solving-problems:Restaurant": "restaurant-m",
        "solving-problems:Host": "airbnb-f",
        "solving-problems:Server": "server2-m"
    }
});
