import React, { useState, useMemo } from "react";
import { BudgetSuggestion, formatVND, suggestBudgetsForMonth, generateBudgetReport, generateBudgetCsv } from "@/lib/aggregations";
import { useCapsStore } from "@/lib/storeCaps";
import toast from "react-hot-toast";

interface BudgetSuggestionsProps {
  selectedMonth: string;
  subCatsByMonth: Record<string, Record<string, number>>;
  netIncome: number;
}

export default function BudgetSuggestions({ selectedMonth, subCatsByMonth, netIncome }: BudgetSuggestionsProps) {
  const { capsByMonth, setCap } = useCapsStore();
  const [showDetails, setShowDetails] = useState(false);
  const [filterParent, setFilterParent] = useState<string>("all");
  const [showLogicPopup, setShowLogicPopup] = useState(false);

  // Generate budget suggestions
  const suggestions = useMemo(() => {
    // Always generate suggestions, even with 0 income (for historical data analysis)
    return suggestBudgetsForMonth(selectedMonth, subCatsByMonth, capsByMonth[selectedMonth] || {}, netIncome);
  }, [selectedMonth, subCatsByMonth, capsByMonth, netIncome]);

  // Generate comprehensive report
  const budgetReport = useMemo(() => {
    if (suggestions.length === 0) return null;
    return generateBudgetReport(
      selectedMonth,
      suggestions,
      netIncome,
      "transaction", // TODO: determine source based on data
      subCatsByMonth
    );
  }, [suggestions, selectedMonth, netIncome, subCatsByMonth]);

  // Group suggestions by parent category
  const groupedSuggestions = useMemo(() => {
    const groups: Record<string, BudgetSuggestion[]> = {};
    suggestions.forEach(suggestion => {
      if (!groups[suggestion.parentCategory]) {
        groups[suggestion.parentCategory] = [];
      }
      groups[suggestion.parentCategory].push(suggestion);
    });
    return groups;
  }, [suggestions]);

  // Filter suggestions by parent category
  const filteredSuggestions = useMemo(() => {
    if (filterParent === "all") return suggestions;
    return suggestions.filter(s => s.parentCategory === filterParent);
  }, [suggestions, filterParent]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalCurrent = suggestions.reduce((sum, s) => sum + s.currentBudget, 0);
    const totalSuggested = suggestions.reduce((sum, s) => sum + s.suggestedBudget, 0);
    const totalDelta = totalSuggested - totalCurrent;
    const increaseCount = suggestions.filter(s => s.status === "increase").length;
    const decreaseCount = suggestions.filter(s => s.status === "decrease").length;
    const excludeCount = suggestions.filter(s => s.status === "exclude").length;

    return {
      totalCurrent,
      totalSuggested,
      totalDelta,
      increaseCount,
      decreaseCount,
      excludeCount,
      suggestionsCount: suggestions.length
    };
  }, [suggestions]);

  // Apply all suggestions
  const applyAllSuggestions = () => {
    try {
      suggestions.forEach(suggestion => {
        if (suggestion.status !== "exclude") {
          setCap(selectedMonth, suggestion.childCategory, suggestion.suggestedBudget);
        }
      });
      toast.success(`Applied ${suggestions.length} budget suggestions for ${selectedMonth}`);
    } catch (error) {
      console.error("Failed to apply suggestions:", error);
      toast.error("Failed to apply budget suggestions");
    }
  };

  // Export CSV
  const exportCsv = () => {
    if (!budgetReport) return;

    const blob = new Blob([budgetReport.csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-suggestions-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  // Apply suggestions for a specific parent category
  const applyParentSuggestions = (parentCategory: string) => {
    try {
      const parentSuggestions = suggestions.filter(s => s.parentCategory === parentCategory);
      parentSuggestions.forEach(suggestion => {
        if (suggestion.status !== "exclude") {
          setCap(selectedMonth, suggestion.childCategory, suggestion.suggestedBudget);
        }
      });
      toast.success(`Applied ${parentSuggestions.length} suggestions for ${parentCategory}`);
    } catch (error) {
      console.error("Failed to apply parent suggestions:", error);
      toast.error("Failed to apply suggestions");
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Budget Suggestions - Gợi ý Ngân sách
        </h3>
        <div className="text-center py-8 text-neutral-500 bg-neutral-50 rounded-lg">
          <p>No budget suggestions available.</p>
          <p className="text-sm">Import transaction data or set a base income to get personalized budget recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Budget Suggestions - Gợi ý Ngân sách
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-xs text-blue-600 font-medium mb-1">Current Total</div>
          <div className="text-sm font-bold text-blue-700">{formatVND(summary.totalCurrent)}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-xs text-green-600 font-medium mb-1">Suggested Total</div>
          <div className="text-sm font-bold text-green-700">{formatVND(summary.totalSuggested)}</div>
        </div>
        <div className={`p-3 rounded-lg text-center ${
          summary.totalDelta >= 0 ? "bg-green-50" : "bg-red-50"
        }`}>
          <div className={`text-xs font-medium mb-1 ${
            summary.totalDelta >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            Net Change
          </div>
          <div className={`text-sm font-bold ${
            summary.totalDelta >= 0 ? "text-green-700" : "text-red-700"
          }`}>
            {summary.totalDelta >= 0 ? "+" : ""}{formatVND(summary.totalDelta)}
          </div>
        </div>
        <div className="bg-neutral-50 p-3 rounded-lg text-center">
          <div className="text-xs text-neutral-600 font-medium mb-1">Changes</div>
          <div className="text-sm font-bold text-neutral-700">
            +{summary.increaseCount} / -{summary.decreaseCount}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={applyAllSuggestions}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Apply All Suggestions
        </button>
        <button
          onClick={exportCsv}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
        >
          Export CSV
        </button>
        <select
          value={filterParent}
          onChange={(e) => setFilterParent(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          {Object.keys(groupedSuggestions).map(parent => (
            <option key={parent} value={parent}>{parent}</option>
          ))}
        </select>
      </div>

      {/* Parent Category Quick Apply */}
      {filterParent === "all" && (
        <div className="mb-4">
          <h3 className="text-xs font-medium text-neutral-600 mb-2">Quick Apply by Category:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(groupedSuggestions).map(([parent, parentSuggestions]) => (
              <button
                key={parent}
                onClick={() => applyParentSuggestions(parent)}
                className="px-2 py-1 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
              >
                {parent} ({parentSuggestions.length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Suggestions Table */}
      {showDetails && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 font-medium text-neutral-600">Parent</th>
                <th className="text-left py-2 font-medium text-neutral-600">Child</th>
                <th className="text-right py-2 font-medium text-neutral-600">Current</th>
                <th className="text-right py-2 font-medium text-neutral-600">Actual</th>
                <th className="text-right py-2 font-medium text-neutral-600">Suggested</th>
                <th className="text-right py-2 font-medium text-neutral-600">Delta</th>
                <th className="text-center py-2 font-medium text-neutral-600">Status</th>
                <th className="text-left py-2 font-medium text-neutral-600">Reasoning</th>
                <th className="text-center py-2 font-medium text-neutral-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuggestions.map((suggestion, index) => (
                <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-2 font-medium text-neutral-800">{suggestion.parentCategory}</td>
                  <td className="py-2 text-neutral-700">{suggestion.childCategory}</td>
                  <td className="py-2 text-right text-blue-600">{formatVND(suggestion.currentBudget)}</td>
                  <td className="py-2 text-right text-neutral-600">{formatVND(suggestion.actualSpending)}</td>
                  <td className="py-2 text-right text-green-600">{formatVND(suggestion.suggestedBudget)}</td>
                  <td className={`py-2 text-right font-medium ${
                    suggestion.delta >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {suggestion.delta >= 0 ? "+" : ""}{formatVND(suggestion.delta)}
                  </td>
                  <td className="py-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.status === "increase" ? "bg-green-100 text-green-700" :
                      suggestion.status === "decrease" ? "bg-red-100 text-red-700" :
                      suggestion.status === "exclude" ? "bg-gray-100 text-gray-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {suggestion.status}
                    </span>
                  </td>
                  <td className="py-2 text-neutral-600 max-w-xs truncate" title={suggestion.reasoning}>
                    {suggestion.reasoning}
                  </td>
                  <td className="py-2 text-center">
                    {suggestion.status !== "exclude" && (
                      <button
                        onClick={() => {
                          setCap(selectedMonth, suggestion.childCategory, suggestion.suggestedBudget);
                          toast.success(`Applied budget for ${suggestion.childCategory}`);
                        }}
                        className="px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Insights Section */}
      {budgetReport && budgetReport.insights.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="text-sm font-semibold text-amber-800 mb-2">Key Insights</h4>
          <div className="text-xs text-amber-700 space-y-1">
            {budgetReport.insights.map((insight, index) => (
              <p key={index}>• {insight}</p>
            ))}
          </div>
        </div>
      )}

      {/* Help Icon */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowLogicPopup(true)}
          className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          title="Budget Suggestion Logic"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Logic Popup */}
      {showLogicPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Budget Suggestion Logic</h3>
              <button
                onClick={() => setShowLogicPopup(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 text-sm text-neutral-700 space-y-2">
              <p>• <strong>Food & Dining</strong>: Scaled to 20% of income, distributed proportionally</p>
              <p>• <strong>Fixed Expenses</strong>: Actual spending + small buffer (5-15%)</p>
              <p>• <strong>Other Categories</strong>: Actual spending × 1.15 with guard-rail limits</p>
              <p>• <strong>Cashflow Categories</strong>: Set to 0, recommend excluding from analysis</p>
              <p>• <strong>Investment & Savings</strong>: Minimum 3M, target 20% of income</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
