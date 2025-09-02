import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useAnalyticsScopeStore } from '@/lib/storeAnalyticsScope';
import { PARENT_TO_CHILDREN } from '@/lib/parsing';

interface AnalyticsScopeProps {
  selectedMonth: string;
  transactions: any[];
}

export default function AnalyticsScope({ selectedMonth, transactions }: AnalyticsScopeProps) {
  const {
    mode,
    setMode,
    toggleChild,
    includeAll,
    excludeAll,
    reset,
    includeParent,
    excludeParent,
    getExcludedSet,
    getIncludedCount,
  } = useAnalyticsScopeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  // Get all child categories from transactions
  const allChildren = useMemo(() => {
    const children = new Set<string>();
    transactions.forEach(t => {
      if (t.categoryChild) children.add(t.categoryChild);
    });
    return Array.from(children).sort();
  }, [transactions]);

  // Get excluded set for current month
  const excludedSet = useMemo(() => getExcludedSet(selectedMonth), [getExcludedSet, selectedMonth]);

  // Filter children by search query
  const filteredChildren = useMemo(() => {
    if (!searchQuery.trim()) return allChildren;
    const query = searchQuery.toLowerCase();
    return allChildren.filter(child =>
      child.toLowerCase().includes(query)
    );
  }, [allChildren, searchQuery]);

  // Group children by parent
  const childrenByParent = useMemo(() => {
    const groups: Record<string, string[]> = {};
    filteredChildren.forEach(child => {
      // Find parent for this child
      for (const [parent, children] of Object.entries(PARENT_TO_CHILDREN)) {
        if (children.includes(child)) {
          if (!groups[parent]) groups[parent] = [];
          groups[parent].push(child);
          break;
        }
      }
    });
    return groups;
  }, [filteredChildren]);

  const handleToggleParent = (parentName: string) => {
    const isExpanded = expandedParents.has(parentName);
    const newExpanded = new Set(expandedParents);
    if (isExpanded) {
      newExpanded.delete(parentName);
    } else {
      newExpanded.add(parentName);
    }
    setExpandedParents(newExpanded);
  };

  const handleIncludeParent = (parentName: string) => {
    const children = PARENT_TO_CHILDREN[parentName] || [];
    children.forEach(child => {
      if (excludedSet.has(child)) {
        toggleChild(child, selectedMonth);
      }
    });
    toast.success(`Included all ${parentName} categories`);
  };

  const handleExcludeParent = (parentName: string) => {
    const children = PARENT_TO_CHILDREN[parentName] || [];
    children.forEach(child => {
      if (!excludedSet.has(child)) {
        toggleChild(child, selectedMonth);
      }
    });
    toast.success(`Excluded all ${parentName} categories`);
  };

  const handleExcludeAll = () => {
    allChildren.forEach(child => {
      if (!excludedSet.has(child)) {
        toggleChild(child, selectedMonth);
      }
    });
    toast.success('Excluded all categories');
  };

  const includedCount = getIncludedCount(selectedMonth, allChildren);

  return (
    <section className="bg-white rounded-2xl shadow p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="text-base font-semibold text-indigo-900">Analytics scope - Phạm vi phân tích</h2>
      </div>

      {/* Mode Switch */}
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm font-medium text-neutral-700">Mode:</span>
          <div className="flex bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setMode('global')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === 'global'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setMode('per-month')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === 'per-month'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Per-month
            </button>
          </div>
        </div>
        <p className="text-xs text-neutral-500">
          {mode === 'global'
            ? 'Exclusions apply to all months'
            : `Exclusions apply only to ${selectedMonth}`
          }
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Summary Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Included {includedCount} of {allChildren.length}
        </span>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => {
            includeAll(selectedMonth);
            toast.success('Included all categories');
          }}
          className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          Include All
        </button>
        <button
          onClick={handleExcludeAll}
          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          Exclude All
        </button>
        <button
          onClick={() => {
            reset(selectedMonth);
            toast.success('Reset to default scope');
          }}
          className="px-3 py-1 text-xs font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Parent Groups */}
      {Object.keys(childrenByParent).length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <p className="text-sm">No categories this month</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(childrenByParent).map(([parentName, children]) => {
            const isExpanded = expandedParents.has(parentName);
            const includedInParent = children.filter(child => !excludedSet.has(child)).length;

            return (
              <div key={parentName} className="border border-neutral-200 rounded-lg">
                <button
                  onClick={() => handleToggleParent(parentName)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-4 h-4 text-neutral-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-medium text-sm">{parentName}</span>
                    <span className="text-xs text-neutral-500">({includedInParent}/{children.length})</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncludeParent(parentName);
                      }}
                      className="px-2 py-1 text-xs text-green-700 bg-green-50 rounded hover:bg-green-100 transition-colors"
                    >
                      Include All
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExcludeParent(parentName);
                      }}
                      className="px-2 py-1 text-xs text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
                    >
                      Exclude All
                    </button>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-neutral-100">
                    <div className="flex flex-wrap gap-2 mt-3">
                      {children.map(child => {
                        const isExcluded = excludedSet.has(child);
                        return (
                          <button
                            key={child}
                            onClick={() => toggleChild(child, selectedMonth)}
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                              isExcluded
                                ? 'bg-neutral-100 text-neutral-500 border-neutral-200 line-through'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                            }`}
                            aria-pressed={!isExcluded}
                          >
                            {child}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
