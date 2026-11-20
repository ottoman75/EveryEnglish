/*
 * EveryEnglish 채점기 — 순수 함수만. DOM·저장소 접근 금지 (node 테스트에서 그대로 실행된다).
 *
 * 판정:
 *   correct — 정규화 후 answers 중 하나와 완전 일치
 *   close   — 단어 단위 유사도 >= CLOSE_THRESHOLD. 통과로 치되 차이를 보여준다
 *   wrong   — 그 외. 오답노트로 간다
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) module.exports = factory();
    else root.EEGrader = factory();
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";

    var CLOSE_THRESHOLD = 0.8;

    // 이 단어가 틀리거나 빠지면 문장 뜻이 뒤집힌다 → 유사도가 높아도 close로 통과시키지 않는다
    // (QA: "I have something to declare" vs "nothing", "check out" vs "check in")
    var MEANING_CRITICAL = {
        not: 1, no: 1, never: 1, nothing: 1, something: 1, anything: 1, yes: 1,
        in: 1, out: 1, on: 1, off: 1, up: 1, down: 1, before: 1, after: 1, more: 1, less: 1
    };
    var SOFT_INTERJECTION = { yes: 1, no: 1 };

    var CONTRACTIONS = [
        [/\bcan't\b/g, "can not"], [/\bcannot\b/g, "can not"], [/\bwon't\b/g, "will not"],
        [/\bshan't\b/g, "shall not"], [/\blet's\b/g, "let us"], [/\bi'm\b/g, "i am"],
        [/\b(\w+)n't\b/g, "$1 not"], [/\b(\w+)'re\b/g, "$1 are"], [/\b(\w+)'ll\b/g, "$1 will"],
        [/\b(\w+)'ve\b/g, "$1 have"], [/\b(\w+)'d\b/g, "$1 would"],
        [/\b(it|that|what|there|here|who|where|how|he|she)'s\b/g, "$1 is"]
    ];

    // 음성인식은 숫자를 아라비아 숫자로 받아쓰는 경우가 많아 숫자로 통일한다
    var NUMBER_WORDS = {
        zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
        eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
        eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60
    };

    var ORDINAL_WORDS = {
        first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10,
        eleventh: 11, twelfth: 12, thirteenth: 13, fourteenth: 14, fifteenth: 15, sixteenth: 16, seventeenth: 17,
        eighteenth: 18, nineteenth: 19, twentieth: 20, thirtieth: 30
    };

    var SYNONYMS = { ok: "okay", alright: "all right", "o'clock": "oclock", oclock: "oclock", mr: "mister", ms: "miss" };

    function normalize(text) {
        var s = String(text || "").toLowerCase()
            .replace(/[‘’ʼ`]/g, "'")
            .replace(/[“”]/g, '"')
            .replace(/(\d):(\d\d)/g, "$1 $2")
            .replace(/(\d),(\d{3})/g, "$1$2")
            .replace(/\$(\d+)/g, "$1 dollars");
        CONTRACTIONS.forEach(function (rule) { s = s.replace(rule[0], rule[1]); });
        // 남은 's는 is 축약(shower's not)인지 소유격(Tom's)인지 구분할 수 없다.
        // 양쪽에 똑같이 적용되는 한 일치 판정에는 지장이 없으므로 모두 " is"로 펼친다.
        s = s.replace(/'s\b/g, " is")
            .replace(/\b([ap])\.\s?m\b\.?/g, "$1m")      // p.m. / p. m. → pm
            .replace(/(\d)\s?(am|pm)\b/g, "$1 $2")        // 3pm → 3 pm
            .replace(/%/g, " percent")
            .replace(/[^a-z0-9' ]+/g, " ")
            .replace(/'/g, "");
        var tokens = s.split(/\s+/).filter(Boolean).map(function (w) {
            if (has(NUMBER_WORDS, w)) return String(NUMBER_WORDS[w]);
            if (has(ORDINAL_WORDS, w)) return ORDINAL_WORDS[w] + suffix(ORDINAL_WORDS[w]);
            if (has(SYNONYMS, w)) return SYNONYMS[w].replace(/'/g, "");
            return w;
        }).join(" ").split(" ").filter(Boolean);
        return dropFillers(collapsePhrases(joinLetters(mergeCompoundNumbers(tokens))));
    }

    // 회화에서 서로 바꿔 써도 뜻이 같은 표현. 양쪽에 똑같이 적용되므로 정답 목록에 일일이 넣지 않아도 된다
    var PHRASES = [
        [["thank", "you"], ["thanks"]],
        [["all", "right"], ["okay"]],
        [["good", "morning"], ["morning"]]
    ];
    var WORD_EQUIV = { yeah: "yes", yep: "yes", yup: "yes", hello: "hi", hey: "hi", nope: "no" };
    // 빠져도 의미가 바뀌지 않는 공손·감탄 표현
    var FILLERS = { please: 1, oh: 1, um: 1, uh: 1, well: 1, so: 0 };

    function collapsePhrases(tokens) {
        var out = [];
        for (var i = 0; i < tokens.length; i++) {
            var matched = false;
            for (var p = 0; p < PHRASES.length && !matched; p++) {
                var from = PHRASES[p][0];
                if (from.every(function (w, k) { return tokens[i + k] === w; })) {
                    out.push.apply(out, PHRASES[p][1]);
                    i += from.length - 1;
                    matched = true;
                }
            }
            if (!matched) out.push(has(WORD_EQUIV, tokens[i]) ? WORD_EQUIV[tokens[i]] : tokens[i]);
        }
        return out;
    }

    function dropFillers(tokens) {
        var kept = tokens.filter(function (t) { return !FILLERS[t]; });
        return kept.length ? kept : tokens; // "Please." 한 단어짜리 답은 그대로
    }

    function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }

    function suffix(n) {
        if (n % 100 >= 11 && n % 100 <= 13) return "th";
        return { 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th";
    }

    // "20 5" → "25", "20 1st" → "21st" (twenty-five, twenty-first)
    function mergeCompoundNumbers(tokens) {
        var out = [];
        tokens.forEach(function (t) {
            var prev = out[out.length - 1];
            var m = /^([1-9])(st|nd|rd|th)?$/.exec(t);
            if (m && prev && /^[2-9]0$/.test(prev)) {
                var n = parseInt(prev, 10) + parseInt(m[1], 10);
                out[out.length - 1] = String(n) + (m[2] ? suffix(n) : "");
            } else {
                out.push(t);
            }
        });
        return out;
    }

    // 철자 불러주기: "m i n s u" (M-I-N-S-U, M, I, N…) → "minsu". 3글자 이상 연속일 때만
    function joinLetters(tokens) {
        var out = [], run = [];
        function flush() {
            if (run.length >= 3) out.push(run.join(""));
            else out.push.apply(out, run);
            run = [];
        }
        tokens.forEach(function (t) {
            if (/^[a-z]$/.test(t)) run.push(t);
            else { flush(); out.push(t); }
        });
        flush();
        return out;
    }

    // 단어 단위 편집 거리 + 정렬 경로
    function align(answerTokens, userTokens) {
        var n = answerTokens.length, m = userTokens.length, i, j;
        var d = [];
        for (i = 0; i <= n; i++) { d.push(new Array(m + 1).fill(0)); d[i][0] = i; }
        for (j = 0; j <= m; j++) d[0][j] = j;
        for (i = 1; i <= n; i++) {
            for (j = 1; j <= m; j++) {
                var cost = answerTokens[i - 1] === userTokens[j - 1] ? 0 : 1;
                d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        var ops = [];
        i = n; j = m;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (answerTokens[i - 1] === userTokens[j - 1] ? 0 : 1)) {
                ops.unshift({
                    op: answerTokens[i - 1] === userTokens[j - 1] ? "eq" : "sub",
                    answer: answerTokens[i - 1], user: userTokens[j - 1]
                });
                i--; j--;
            } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
                ops.unshift({ op: "miss", answer: answerTokens[i - 1] });
                i--;
            } else {
                ops.unshift({ op: "extra", user: userTokens[j - 1] });
                j--;
            }
        }
        return { distance: d[n][m], ops: ops };
    }

    /**
     * @param {string} userText
     * @param {string[]} answers  answers[0]이 모범답안
     * @param {{strict?: boolean}} [options]  strict: 빈칸 채우기처럼 부분점수가 없는 경우
     */
    function grade(userText, answers, options) {
        var strict = !!(options && options.strict);
        var userTokens = normalize(userText);
        var best = null;
        (answers || []).forEach(function (answer) {
            var answerTokens = normalize(answer);
            var result = align(answerTokens, userTokens);
            var len = Math.max(answerTokens.length, userTokens.length, 1);
            var score = 1 - result.distance / len;
            if (!best || score > best.score) {
                best = { answer: answer, score: score, ops: result.ops };
            }
        });
        if (!best || userTokens.length === 0) {
            return { verdict: "wrong", score: 0, answer: answers && answers[0], ops: [], empty: userTokens.length === 0 };
        }
        var flipsMeaning = best.ops.some(function (o) {
            if (o.op === "eq") return false;
            var w = o.op === "miss" ? o.answer : o.op === "extra" ? o.user : null;
            // 맞장구 yes/no는 빠지거나 붙어도 뜻이 같다("No, I'm good" = "I'm good"). 서로 바뀌면(sub) 뒤집힌다
            if (w) return !!MEANING_CRITICAL[w] && !SOFT_INTERJECTION[w];
            return !!(MEANING_CRITICAL[o.answer] || MEANING_CRITICAL[o.user]);
        });
        var verdict = best.score === 1 ? "correct"
            : (!strict && !flipsMeaning && best.score >= CLOSE_THRESHOLD ? "close" : "wrong");
        return { verdict: verdict, score: best.score, answer: best.answer, ops: best.ops, empty: false };
    }

    function isPass(result) {
        return result.verdict === "correct" || result.verdict === "close";
    }

    // 단어 배열 문제용: 모범답안을 화면 표시용 원형 토큰으로 쪼갠다 (구두점은 마지막 단어에 붙여 둔다)
    function tokenizeForArrange(sentence) {
        return String(sentence).trim().split(/\s+/);
    }

    return {
        CLOSE_THRESHOLD: CLOSE_THRESHOLD,
        normalize: normalize,
        align: align,
        grade: grade,
        isPass: isPass,
        tokenizeForArrange: tokenizeForArrange
    };
});
