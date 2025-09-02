import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Analytics scope state model
export interface AnalyticsScopeState {
    mode: 'global' | 'per-month';
    global: string[]; // excluded child categories globally
    byMonth: Record<string, string[]>; // excluded by YYYY-MM
}

export interface AnalyticsScopeActions {
    setMode: (mode: 'global' | 'per-month') => void;
    toggleChild: (childName: string, month?: string) => void;
    includeAll: (month?: string) => void;
    excludeAll: (month?: string) => void;
    reset: (month?: string) => void;
    includeParent: (parentName: string, month?: string) => void;
    excludeParent: (parentName: string, month?: string) => void;
    getExcludedSet: (month: string) => Set<string>;
    getIncludedCount: (month: string, allChildren: string[]) => number;
}

export type AnalyticsScopeStore = AnalyticsScopeState & AnalyticsScopeActions;

// Migration from legacy excludedChildren
const migrateLegacyExclusions = (): string[] => {
    if (typeof window === 'undefined') return [];

    try {
        const legacy = localStorage.getItem('excludedChildren');
        if (legacy) {
            const parsed = JSON.parse(legacy);
            if (Array.isArray(parsed)) {
                localStorage.removeItem('excludedChildren'); // Remove old key
                return parsed;
            }
        }
    } catch (error) {
        console.warn('Failed to migrate legacy exclusions:', error);
    }

    return [];
};

export const useAnalyticsScopeStore = create<AnalyticsScopeStore>()(
    persist(
        (set, get) => ({
            // Initial state
            mode: 'global',
            global: migrateLegacyExclusions(),
            byMonth: {},

            // Actions
            setMode: (mode) => set({ mode }),

            toggleChild: (childName, month) => {
                const state = get();
                const targetMonth = month || 'global';

                if (state.mode === 'global') {
                    const global = state.global;
                    const newGlobal = global.includes(childName)
                        ? global.filter(c => c !== childName)
                        : [...global, childName];
                    set({ global: newGlobal });
                } else {
                    const byMonth = { ...state.byMonth };
                    const monthExclusions = byMonth[targetMonth] || [];
                    const newMonthExclusions = monthExclusions.includes(childName)
                        ? monthExclusions.filter(c => c !== childName)
                        : [...monthExclusions, childName];
                    byMonth[targetMonth] = newMonthExclusions;
                    set({ byMonth });
                }
            },

            includeAll: (month) => {
                const state = get();
                if (state.mode === 'global') {
                    set({ global: [] });
                } else {
                    const byMonth = { ...state.byMonth };
                    byMonth[month || ''] = [];
                    set({ byMonth });
                }
            },

            excludeAll: (month) => {
                const state = get();
                // This will be called with all available children
                // Implementation will be handled in the component
            },

            reset: (month) => {
                const state = get();
                if (state.mode === 'global') {
                    set({ global: [] });
                } else {
                    const byMonth = { ...state.byMonth };
                    byMonth[month || ''] = [];
                    set({ byMonth });
                }
            },

            includeParent: (parentName, month) => {
                // This will be implemented in the component with PARENT_TO_CHILDREN
            },

            excludeParent: (parentName, month) => {
                // This will be implemented in the component with PARENT_TO_CHILDREN
            },

            getExcludedSet: (month) => {
                const state = get();
                if (state.mode === 'global') {
                    return new Set(state.global);
                } else {
                    return new Set(state.byMonth[month] || []);
                }
            },

            getIncludedCount: (month, allChildren) => {
                const excludedSet = get().getExcludedSet(month);
                return allChildren.filter(child => !excludedSet.has(child)).length;
            },
        }),
        {
            name: 'analyticsScopeV2',
            version: 1,
        }
    )
);
