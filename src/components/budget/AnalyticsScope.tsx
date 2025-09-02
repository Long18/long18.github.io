import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAnalyticsScopeStore } from '@/lib/storeAnalyticsScope';
import { PARENT_TO_CHILDREN } from '@/lib/parsing';

interface AnalyticsScopeProps {
  selectedMonth: string;
  transactions: any[];
}

export default function AnalyticsScope({ selectedMonth, transactions }: AnalyticsScopeProps) {
  const store = useAnalyticsScopeStore();
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
  } = store;

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
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                mode === 'global'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setMode('per-month')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
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
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            includedCount === allChildren.length
              ? 'bg-green-100 text-green-800'
              : includedCount === 0
              ? 'bg-neutral-100 text-neutral-600'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {includedCount === allChildren.length ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All {allChildren.length} categories included
              </>
            ) : includedCount === 0 ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                All {allChildren.length} categories excluded
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {includedCount} of {allChildren.length} categories included
              </>
            )}
          </span>
          {includedCount < allChildren.length && (
            <span className="text-xs text-neutral-500">
              ({allChildren.length - includedCount} excluded)
            </span>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => {
            includeAll(selectedMonth);
            toast.success('Included all categories');
          }}
          className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:bg-green-100 transition-all duration-200"
        >
          Include All
        </button>
        <button
          onClick={handleExcludeAll}
          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:bg-red-100 transition-all duration-200"
        >
          Exclude All
        </button>
        <button
          onClick={() => {
            reset(selectedMonth);
            toast.success('Reset to default scope');
          }}
          className="px-3 py-1 text-xs font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:bg-neutral-100 transition-all duration-200"
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
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:bg-neutral-50 transition-all duration-200"
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
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        includedInParent === children.length
                          ? 'bg-green-100 text-green-700'
                          : includedInParent === 0
                          ? 'bg-neutral-100 text-neutral-500'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {includedInParent === children.length ? 'All Included' :
                         includedInParent === 0 ? 'All Excluded' :
                         `${includedInParent}/${children.length} Included`}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncludeParent(parentName);
                      }}
                      className="px-2 py-1 text-xs text-green-700 bg-green-50 rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:bg-green-100 transition-all duration-200"
                    >
                      Include All
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExcludeParent(parentName);
                      }}
                      className="px-2 py-1 text-xs text-red-700 bg-red-50 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:bg-red-100 transition-all duration-200"
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
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              isExcluded
                                ? 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200 focus:ring-neutral-400 focus:bg-neutral-200'
                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 focus:ring-green-500 focus:bg-green-100'
                            }`}
                            aria-pressed={!isExcluded}
                          >
                            {isExcluded ? (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {child}
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {child}
                              </>
                            )}
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
