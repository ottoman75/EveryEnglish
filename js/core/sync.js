/*
 * 기기 간 학습 기록 병합 — 순수 함수만 (네트워크는 js/app/sync-gist.js).
 *
 * 요구 조건
 *  - 멱등: merge(a, merge(a, b)) === merge(a, b). 같은 기록을 몇 번 주고받아도 값이 불어나지 않는다
 *  - 총량 보존: 학습 시간·XP는 기기별로 따로 적고 합계만 계산한다. 두 기기 값을 더해 '만들지' 않는다
 *  - 기기 전용 값(설정·진행 중 세션)은 동기화하지 않는다 — 폰과 맥은 쓰는 음성·속도가 다르다
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) module.exports = factory();
    else root.EESync = factory();
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";

    var SYNC_FORMAT = 1;
    var DEVICE_LOCAL_KEYS = ["settings", "inProgress"];

    function clone(o) { return JSON.parse(JSON.stringify(o || {})); }
    function sum(map) { return Object.keys(map || {}).reduce(function (n, k) { return n + (map[k] || 0); }, 0); }

    /**
     * 기존(동기화 이전) 기록을 기기별 장부로 옮긴다. 이미 옮긴 기록은 그대로 둔다.
     * 동기화 전의 학습 시간·XP는 지금 이 기기가 쌓은 것으로 본다.
     */
    function adoptLegacy(state, deviceId) {
        var s = clone(state);
        if (!s.xpByDevice) {
            s.xpByDevice = {};
            if (s.xp) s.xpByDevice[deviceId] = s.xp;
        }
        Object.keys(s.daily || {}).forEach(function (k) {
            var d = s.daily[k];
            if (!d.secondsByDevice) {
                d.secondsByDevice = {};
                if (d.seconds) d.secondsByDevice[deviceId] = d.seconds;
            }
            if (!d.xpByDevice) {
                d.xpByDevice = {};
                if (d.xp) d.xpByDevice[deviceId] = d.xp;
            }
        });
        if (!s.tombstones) s.tombstones = {};
        return s;
    }

    // 기기별 장부에서 합계를 다시 계산한다 (합계 필드는 언제나 파생값)
    function recomputeTotals(s) {
        s.xp = sum(s.xpByDevice);
        Object.keys(s.daily || {}).forEach(function (k) {
            var d = s.daily[k];
            d.seconds = sum(d.secondsByDevice);
            d.xp = sum(d.xpByDevice);
        });
        return s;
    }

    function mergeMaxMap(a, b) {
        var out = {};
        Object.keys(a || {}).concat(Object.keys(b || {})).forEach(function (k) {
            out[k] = Math.max((a && a[k]) || 0, (b && b[k]) || 0);
        });
        return out;
    }

    // 항목의 '최근 활동' 순서: updatedAt(ms) → 날짜 필드 → 활동 횟수
    function activityKey(item) {
        if (!item) return [-1, "", -1];
        var lastDate = [item.lastReviewed, item.lastWrong, item.lastPracticed, item.createdAt].filter(Boolean).sort().pop() || "";
        return [item.updatedAt || 0, lastDate, (item.reviewCount || 0) + (item.wrongCount || 0)];
    }

    function newer(a, b) {
        var ka = activityKey(a), kb = activityKey(b);
        for (var i = 0; i < ka.length; i++) {
            if (ka[i] > kb[i]) return a;
            if (ka[i] < kb[i]) return b;
        }
        return a; // 완전히 같으면 어느 쪽이든 동일
    }

    function mergeItems(a, b, tombstones) {
        var out = {};
        Object.keys(a || {}).concat(Object.keys(b || {})).forEach(function (id) {
            if (out[id]) return;
            var pick = clone(newer(a && a[id], b && b[id]));
            var deletedAt = tombstones[id];
            if (deletedAt && deletedAt >= (pick.updatedAt || 0)) return; // 지운 뒤에 다시 틀린 게 아니면 삭제 유지
            out[id] = pick;
        });
        return out;
    }

    function mergeProgress(a, b) {
        var out = {};
        Object.keys(a || {}).concat(Object.keys(b || {})).forEach(function (id) {
            var pa = a && a[id], pb = b && b[id];
            if (!pa || !pb) { out[id] = clone(pa || pb); return; }
            var later = String(pa.lastDone) >= String(pb.lastDone) ? pa : pb;
            out[id] = {
                // 두 기기에서 각각 완료한 횟수를 정확히 구분할 수 없다 → 과소(최댓값)를 택한다
                completedCount: Math.max(pa.completedCount || 0, pb.completedCount || 0),
                bestScore: Math.max(pa.bestScore || 0, pb.bestScore || 0),
                lastScore: later.lastScore,
                lastDone: later.lastDone
            };
        });
        return out;
    }

    function mergeDaily(a, b) {
        var out = {};
        Object.keys(a || {}).concat(Object.keys(b || {})).forEach(function (k) {
            var da = (a && a[k]) || {}, db = (b && b[k]) || {};
            var tasks = {};
            Object.keys(da.tasks || {}).concat(Object.keys(db.tasks || {})).forEach(function (t) {
                tasks[t] = !!((da.tasks && da.tasks[t]) || (db.tasks && db.tasks[t]));
            });
            out[k] = {
                secondsByDevice: mergeMaxMap(da.secondsByDevice, db.secondsByDevice),
                xpByDevice: mergeMaxMap(da.xpByDevice, db.xpByDevice),
                tasks: tasks
            };
        });
        return out;
    }

    function mergeProfile(local, remote) {
        var p = clone(local);
        // 이름: 나중에 바꾼 쪽. 기록이 없으면 비어 있지 않은 쪽
        if ((remote.nameUpdatedAt || 0) > (local.nameUpdatedAt || 0) || (!local.name && remote.name)) {
            p.name = remote.name;
            p.nameUpdatedAt = remote.nameUpdatedAt;
        }
        var created = [local.createdAt, remote.createdAt].filter(Boolean).sort()[0];
        if (created) p.createdAt = created;
        return p;
    }

    /**
     * @param {Object} local  이 기기의 상태 (adoptLegacy 적용 전이어도 됨)
     * @param {Object|null} remote  공유 사본 (sync payload의 state)
     * @param {string} deviceId
     * @returns {Object} 병합된 상태. 기기 전용 값은 local의 것을 유지
     */
    function merge(local, remote, deviceId) {
        var l = adoptLegacy(local, deviceId);
        if (!remote) return recomputeTotals(l);
        var r = adoptLegacy(remote, "unknown-device");
        var tombstones = mergeMaxMap(l.tombstones, r.tombstones);
        var out = clone(l);
        out.profile = mergeProfile(l.profile || {}, r.profile || {});
        out.progress = mergeProgress(l.progress, r.progress);
        out.wrongNotes = mergeItems(l.wrongNotes, r.wrongNotes, tombstones);
        out.words = mergeItems(l.words, r.words, tombstones);
        out.daily = mergeDaily(l.daily, r.daily);
        out.xpByDevice = mergeMaxMap(l.xpByDevice, r.xpByDevice);
        out.tombstones = tombstones;
        DEVICE_LOCAL_KEYS.forEach(function (k) { out[k] = l[k]; });
        return recomputeTotals(out);
    }

    /** 공유 사본으로 내보낼 형태 — 기기 전용 값 제외 */
    function toPayload(state) {
        var s = clone(state);
        DEVICE_LOCAL_KEYS.forEach(function (k) { delete s[k]; });
        return { format: SYNC_FORMAT, app: "everyenglish", state: s };
    }

    /** 의미 있는 차이가 있는지 (업로드 필요 여부) */
    function sameContent(a, b) {
        return stableStringify(toPayload(a).state) === stableStringify(toPayload(b).state);
    }

    // 키 순서와 무관한 비교 (병합 결과는 키 순서가 기기마다 다를 수 있다)
    function stableStringify(v) {
        if (Array.isArray(v)) return "[" + v.map(stableStringify).join(",") + "]";
        if (v && typeof v === "object") {
            return "{" + Object.keys(v).sort().filter(function (k) { return v[k] !== undefined; })
                .map(function (k) { return JSON.stringify(k) + ":" + stableStringify(v[k]); }).join(",") + "}";
        }
        return JSON.stringify(v);
    }

    return {
        SYNC_FORMAT: SYNC_FORMAT, adoptLegacy: adoptLegacy, recomputeTotals: recomputeTotals,
        merge: merge, toPayload: toPayload, sameContent: sameContent
    };
});
