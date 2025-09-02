import { create } from "zustand";

// =====================================================
// Types
// =====================================================

export type CapsByMonth = Record<string, Record<string, number>>; // month -> child -> VND

type CapsState = {
    capsByMonth: CapsByMonth;
    setCap: (month: string, child: string, amount: number) => void;
    setCaps: (month: string, caps: Record<string, number>) => void;
};

// =====================================================
// Helpers
// =====================================================

const round1000 = (n: number) => Math.round(n / 1000) * 1000;

// =====================================================
// Zustand store for caps (persisted)
// =====================================================

export const useCapsStore = create<CapsState>((set: any) => ({
    capsByMonth: (typeof window !== "undefined" && JSON.parse(localStorage.getItem("capsByMonth") || "{}")) || {},
    setCap: (month: string, child: string, amount: number) =>
        set((s: any) => {
            const next: CapsByMonth = { ...s.capsByMonth, [month]: { ...(s.capsByMonth[month] || {}), [child]: round1000(Math.max(0, amount)) } };
            if (typeof window !== "undefined") localStorage.setItem("capsByMonth", JSON.stringify(next));
            return { capsByMonth: next };
        }),
    setCaps: (month: string, caps: Record<string, number>) =>
        set((s: any) => {
            const rounded: Record<string, number> = Object.fromEntries(
                Object.entries(caps).map(([k, v]) => [k, round1000(Math.max(0, v as number))])
            );
            const next: CapsByMonth = { ...s.capsByMonth, [month]: { ...(s.capsByMonth[month] || {}), ...rounded } };
            if (typeof window !== "undefined") localStorage.setItem("capsByMonth", JSON.stringify(next));
            return { capsByMonth: next };
        }),
}));
