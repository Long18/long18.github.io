import { Tx, getMonthKey, PARENT_TO_CHILDREN } from "./parsing";

// =====================================================
// Guard-rail (parent-level warnings) + payslip map
// =====================================================

export const GUARDRAIL_PCT: Record<string, number> = {
    Essential: 0.3,
    "Daily Food & Drinks": 0.2,
    Transportation: 0.1,
    Entertainment: 0.1,
    Others: 0.1,
};

// Net payslip lookup by month
// Requirement: no cache, default should be 0
export const DEFAULT_NET = 0;
export const PAYSLIP_NET_BY_MONTH: Record<string, number> = {};

// =====================================================
// Helpers
// =====================================================

export const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Math.round(n));

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export const round1000 = (n: number) => Math.round(n / 1000) * 1000;

// =====================================================
// Aggregations
// =====================================================

export function aggregateByMonth(transactions: Tx[]) {
    const map: Record<string, { income: number; expense: number }> = {};
    for (const t of transactions) {
        const m = getMonthKey(t.date);
        if (!map[m]) map[m] = { income: 0, expense: 0 };
        if (t.amount > 0) map[m].income += t.amount;
        else map[m].expense += Math.abs(t.amount);
    }
    return map;
}

export function parentAndSubMaps(transactions: Tx[]) {
    const parent: Record<string, Record<string, number>> = {};
    const sub: Record<string, Record<string, number>> = {};
    for (const t of transactions) {
        if (t.amount >= 0) continue;
        const m = getMonthKey(t.date);
        if (!parent[m]) parent[m] = {};
        if (!sub[m]) sub[m] = {};
        const p = t.categoryParent;
        const c = t.categoryChild;
        parent[m][p] = (parent[m][p] ?? 0) + Math.abs(t.amount);
        sub[m][c] = (sub[m][c] ?? 0) + Math.abs(t.amount);
    }
    return { parent, sub };
}

// =====================================================
// Budget suggestions
// =====================================================

export function suggestCapsForMonth(
    month: string,
    monthAgg: Record<string, { income: number; expense: number }>,
    subCatsByMonth: Record<string, Record<string, number>>
): Record<string, number> {
    const baseIncome = monthAgg[month]?.income || PAYSLIP_NET_BY_MONTH[month] || DEFAULT_NET;
    const caps: Record<string, number> = {};
    const monthsSorted = Object.keys(subCatsByMonth).sort();
    const prev = monthsSorted.filter((m) => m < month).slice(-1)[0];

    for (const [parent, children] of Object.entries(PARENT_TO_CHILDREN)) {
        const target = round1000(baseIncome * (GUARDRAIL_PCT[parent] ?? 0));
        if (target <= 0 || children.length === 0) continue;

        const weights: Record<string, number> = {};
        if (prev) {
            const subPrev = subCatsByMonth[prev] || {};
            for (const c of children) weights[c] = (weights[c] || 0) + (subPrev[c] || 0);
        }

        const totalW = Object.values(weights).reduce((s, v) => s + v, 0);
        let alloc = children.map(() => target / children.length);
        if (totalW > 0) alloc = children.map((c) => ((weights[c] || 0) / totalW) * target);

        const rounded = alloc.map((v) => round1000(v));
        const diff = target - rounded.reduce((s, v) => s + v, 0);
        if (rounded.length) rounded[0] += diff;

        children.forEach((c, i) => {
            caps[c] = Math.max(0, rounded[i] || 0);
        });
    }
    return caps;
}
