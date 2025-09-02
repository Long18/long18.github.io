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

// Net payslip lookup by month - removed, will use CSV data instead
export const DEFAULT_NET = 0;

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
    const baseIncome = monthAgg[month]?.income || DEFAULT_NET;
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

// =====================================================
// Enhanced Budget Suggestion Logic
// =====================================================

// Guard-rail percentages for parent categories (updated)
export const GUARD_RAIL_PERCENTAGES: Record<string, number> = {
    "Essential": 0.30,      // 30% of net income
    "Food & Dining": 0.20,  // 20% of net income
    "Transportation": 0.10, // 10% of net income
    "Entertainment": 0.10,  // 10% of net income
    "Personal Care": 0.10,  // 10% of net income
    "Services": 0.10,       // 10% of net income
    "Others": 0.10,         // 10% of net income
    "Investment & Savings": 0.20, // 20% minimum, can go higher
};

// Fixed expense categories that should not be scaled
export const FIXED_EXPENSE_CATEGORIES = [
    "Rent", "Parking (fixed)", "Internet", "Electricity", "Water"
];

// Cashflow categories that should be excluded from budget analysis
export const CASHFLOW_CATEGORIES = [
    "Credits", "Cho vay", "Rút tiền", "Thu nợ", "Momo"
];

// Budget suggestion interface
export interface BudgetSuggestion {
    parentCategory: string;
    childCategory: string;
    currentBudget: number;
    actualSpending: number;
    suggestedBudget: number;
    delta: number;
    status: "increase" | "decrease" | "maintain" | "exclude";
    reasoning: string;
}

// Enhanced budget suggestion logic based on 3-month average with guard-rails
export function suggestBudgetsForMonth(
    targetMonth: string,
    actualSpending: Record<string, Record<string, number>>,
    currentBudgets: Record<string, number>,
    baseIncome: number,
    payslipNet: Record<string, number> = {}
): BudgetSuggestion[] {
    const suggestions: BudgetSuggestion[] = [];

    // Get available months for historical data (up to 3 months before targetMonth)
    const targetDate = new Date(targetMonth + "-01");
    const historicalMonths: string[] = [];
    const availableMonths = Object.keys(actualSpending).sort();

    // Try to get 3 months before targetMonth
    for (let i = 1; i <= 3; i++) {
        const month = new Date(targetDate);
        month.setMonth(month.getMonth() - i);
        const monthKey = month.toISOString().slice(0, 7);
        if (actualSpending[monthKey]) {
            historicalMonths.push(monthKey);
        }
    }

    // If no historical data, use target month itself if available
    if (historicalMonths.length === 0 && actualSpending[targetMonth]) {
        historicalMonths.push(targetMonth);
    }

    // If still no data, use any available month as fallback
    if (historicalMonths.length === 0 && availableMonths.length > 0) {
        historicalMonths.push(availableMonths[availableMonths.length - 1]);
    }

    // Calculate 3-month average spending by parent and child
    const parentAvgSpending: Record<string, number> = {};
    const childAvgSpending: Record<string, number> = {};
    const childSpending: Record<string, number> = {};

    // Get target month spending
    const targetMonthSpending = actualSpending[targetMonth] || {};
    for (const [child, amount] of Object.entries(targetMonthSpending)) {
        childSpending[child] = amount;
    }

    // Calculate averages from historical data
    for (const month of historicalMonths) {
        const monthSpending = actualSpending[month] || {};
        for (const [child, amount] of Object.entries(monthSpending)) {
            childAvgSpending[child] = (childAvgSpending[child] || 0) + amount;
        }
    }

    // Average the historical data
    for (const [child, total] of Object.entries(childAvgSpending)) {
        childAvgSpending[child] = total / historicalMonths.length;
    }

    // Group by parent categories
    for (const [child, amount] of Object.entries(childAvgSpending)) {
        let parent = "Others";
        for (const [p, children] of Object.entries(PARENT_TO_CHILDREN)) {
            if (children.includes(child)) {
                parent = p;
                break;
            }
        }
        parentAvgSpending[parent] = (parentAvgSpending[parent] || 0) + amount;
    }

    // If no historical data, create basic suggestions based on guard-rails
    if (Object.keys(parentAvgSpending).length === 0) {
        for (const [parent, children] of Object.entries(PARENT_TO_CHILDREN)) {
            const guardRailPct = GUARD_RAIL_PERCENTAGES[parent] || 0.10;
            const parentTarget = baseIncome > 0 ? baseIncome * guardRailPct : 0;

            if (parent === "Investment & Savings") {
                const minSavings = 3000000;
                const targetSavingRate = 0.20;
                const suggestedTotal = Math.max(minSavings, baseIncome * targetSavingRate);

                for (const child of children) {
                    const current = currentBudgets[child] || 0;
                    const proportion = 1 / children.length;
                    const suggested = Math.round(suggestedTotal * proportion);

                    suggestions.push({
                        parentCategory: parent,
                        childCategory: child,
                        currentBudget: current,
                        actualSpending: 0,
                        suggestedBudget: suggested,
                        delta: suggested - current,
                        status: suggested > current ? "increase" : suggested < current ? "decrease" : "maintain",
                        reasoning: `No historical data - using default ${Math.round(targetSavingRate * 100)}% saving rate`
                    });
                }
            } else {
                // Distribute parent target equally among children
                for (const child of children) {
                    const current = currentBudgets[child] || 0;
                    const suggested = Math.round(parentTarget / children.length);

                    suggestions.push({
                        parentCategory: parent,
                        childCategory: child,
                        currentBudget: current,
                        actualSpending: 0,
                        suggestedBudget: suggested,
                        delta: suggested - current,
                        status: suggested > current ? "increase" : suggested < current ? "decrease" : "maintain",
                        reasoning: `No historical data - using guard-rail ${Math.round(guardRailPct * 100)}%`
                    });
                }
            }
        }
        return suggestions;
    }

    // Process each parent category with historical data
    for (const [parent, avgSpending] of Object.entries(parentAvgSpending)) {
        const guardRailPct = GUARD_RAIL_PERCENTAGES[parent] || 0.10;
        const children = PARENT_TO_CHILDREN[parent] || [];

        if (parent === "Investment & Savings") {
            // Special handling for Investment & Savings
            const currentTotal = children.reduce((sum, child) => sum + (currentBudgets[child] || 0), 0);
            const actualSavingRate = baseIncome > 0 ? avgSpending / baseIncome : 0;
            const targetSavingRate = Math.max(actualSavingRate, 0.20); // 20% minimum
            const suggestedTotal = Math.round(baseIncome * targetSavingRate);

            for (const child of children) {
                const current = currentBudgets[child] || 0;
                const proportion = currentTotal > 0 ? current / currentTotal : 1 / children.length;
                const suggested = Math.round(suggestedTotal * proportion);

                suggestions.push({
                    parentCategory: parent,
                    childCategory: child,
                    currentBudget: current,
                    actualSpending: childSpending[child] || 0,
                    suggestedBudget: suggested,
                    delta: suggested - current,
                    status: suggested > current ? "increase" : suggested < current ? "decrease" : "maintain",
                    reasoning: `Target saving rate ${Math.round(targetSavingRate * 100)}% (${Math.round(suggestedTotal / 1000)}k total)`
                });
            }
        } else {
            // Regular parent categories
            const guardRailLimit = baseIncome * guardRailPct;
            const parentTarget = baseIncome > 0
                ? Math.min(guardRailLimit, Math.max(avgSpending, 0) * 1.1)
                : Math.max(avgSpending, 0) * 1.1;

            // Distribute to children based on recent spending proportions
            const recentMonth = historicalMonths[0] || targetMonth;
            const recentSpending = actualSpending[recentMonth] || {};
            const totalRecentSpending = children.reduce((sum, child) => sum + (recentSpending[child] || 0), 0);

            const childCaps: number[] = [];
            let totalAllocated = 0;

            // First pass: allocate based on recent proportions
            for (const child of children) {
                const recentAmount = recentSpending[child] || 0;
                const proportion = totalRecentSpending > 0 ? recentAmount / totalRecentSpending : 1 / children.length;
                const cap = Math.round(parentTarget * proportion);
                childCaps.push(cap);
                totalAllocated += cap;
            }

            // Adjust first child to match parent target exactly
            if (childCaps.length > 0) {
                const adjustment = Math.round(parentTarget) - totalAllocated;
                childCaps[0] += adjustment;
            }

            // Create suggestions
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const suggested = childCaps[i];
                const current = currentBudgets[child] || 0;
                const actual = childSpending[child] || 0;

                suggestions.push({
                    parentCategory: parent,
                    childCategory: child,
                    currentBudget: current,
                    actualSpending: actual,
                    suggestedBudget: suggested,
                    delta: suggested - current,
                    status: suggested > current ? "increase" : suggested < current ? "decrease" : "maintain",
                    reasoning: `Based on ${historicalMonths.length}-month avg, guard-rail ${Math.round(guardRailPct * 100)}%`
                });
            }
        }
    }

    return suggestions;
}

// Generate CSV export for budget suggestions
export function generateBudgetCsv(
    targetMonth: string,
    suggestions: BudgetSuggestion[]
): string {
    const header = "month,categoryChild,capAmount";
    const rows = suggestions
        .filter(s => s.status !== "exclude")
        .map(s => `${targetMonth},${s.childCategory},${s.suggestedBudget}`);

    return [header, ...rows].join("\n");
}

// Generate comprehensive budget report
export interface BudgetReport {
    targetMonth: string;
    baseIncome: number;
    baseIncomeSource: "transaction" | "payslip" | "zero";
    parents: Array<{
        name: string;
        guardrailPct: number;
        cap: number;
        actual: number;
        percentUsed: number;
        status: "OK" | "Near" | "Over";
    }>;
    children: Array<{
        name: string;
        parent: string;
        cap: number;
        actual: number;
        percentUsed: number;
        status: "OK" | "Near" | "Over";
    }>;
    insights: string[];
    csvContent: string;
}

export function generateBudgetReport(
    targetMonth: string,
    suggestions: BudgetSuggestion[],
    baseIncome: number,
    baseIncomeSource: "transaction" | "payslip" | "zero",
    actualSpending: Record<string, Record<string, number>>
): BudgetReport {
    const targetSpending = actualSpending[targetMonth] || {};

    // Group suggestions by parent
    const parentGroups: Record<string, BudgetSuggestion[]> = {};
    suggestions.forEach(s => {
        if (!parentGroups[s.parentCategory]) {
            parentGroups[s.parentCategory] = [];
        }
        parentGroups[s.parentCategory].push(s);
    });

    // Generate parent summary
    const parents = Object.entries(parentGroups).map(([name, children]) => {
        const cap = children.reduce((sum, c) => sum + c.suggestedBudget, 0);
        const actual = children.reduce((sum, c) => sum + c.actualSpending, 0);
        const percentUsed = cap > 0 ? (actual / cap) * 100 : 0;
        const status = percentUsed >= 100 ? "Over" : percentUsed >= 80 ? "Near" : "OK";

        return {
            name,
            guardrailPct: GUARD_RAIL_PERCENTAGES[name] || 0.10,
            cap,
            actual,
            percentUsed,
            status: status as "OK" | "Near" | "Over"
        };
    });

    // Generate children details
    const children = suggestions
        .filter(s => s.status !== "exclude")
        .map(s => {
            const percentUsed = s.suggestedBudget > 0 ? (s.actualSpending / s.suggestedBudget) * 100 : 0;
            const status = percentUsed >= 100 ? "Over" : percentUsed >= 80 ? "Near" : "OK";

            return {
                name: s.childCategory,
                parent: s.parentCategory,
                cap: s.suggestedBudget,
                actual: s.actualSpending,
                percentUsed,
                status: status as "OK" | "Near" | "Over"
            };
        });

    // Generate insights
    const insights: string[] = [];

    // Base income insight
    if (baseIncomeSource === "transaction") {
        insights.push(`Using transaction income (${formatVND(baseIncome)}) as base income`);
    } else if (baseIncomeSource === "payslip") {
        insights.push(`Using payslip net (${formatVND(baseIncome)}) as base income`);
    } else {
        insights.push("No income data available - using 0 as base income");
    }

    // Guard-rail violations
    const violations = parents.filter(p => p.actual > baseIncome * p.guardrailPct);
    if (violations.length > 0) {
        insights.push(`Guard-rail violations: ${violations.map(v => v.name).join(", ")}`);
    }

    // Top overspends
    const overspends = children.filter(c => c.status === "Over").sort((a, b) => b.actual - a.actual).slice(0, 3);
    if (overspends.length > 0) {
        insights.push(`Top overspends: ${overspends.map(o => o.name).join(", ")}`);
    }

    return {
        targetMonth,
        baseIncome,
        baseIncomeSource,
        parents,
        children,
        insights,
        csvContent: generateBudgetCsv(targetMonth, suggestions)
    };
}
