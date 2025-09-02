import React, { useState, useMemo } from "react";
import { useCapsStore } from "@/lib/storeCaps";
import { PARENT_TO_CHILDREN } from "@/lib/parsing";
import { formatVND, round1000, clamp } from "@/lib/aggregations";
import BudgetSuggestions from "./BudgetSuggestions";

interface BudgetTableProps {
  selectedMonth: string;
  parentCatsByMonth: Record<string, Record<string, number>>;
  subCatsByMonth: Record<string, Record<string, number>>;
  baseIncome?: number; // For guard-rail calculations
}

export default function BudgetTable({ selectedMonth, parentCatsByMonth, subCatsByMonth, baseIncome = 0 }: BudgetTableProps) {
  const { capsByMonth, setCap } = useCapsStore();
  const [budgetMode, setBudgetMode] = useState<"view" | "edit">("view");
  const [sortBy, setSortBy] = useState<"overspend" | "alphabetical">("overspend");
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  // Enhanced budget rows with guard-rail calculations
  const budgetRows = useMemo(() => {
    const caps = capsByMonth[selectedMonth] || {};
    return Object.keys(PARENT_TO_CHILDREN).map((parent) => {
      const children = PARENT_TO_CHILDREN[parent] || [];
      const childCaps = children.map((c) => Math.max(0, round1000(caps[c] || 0)));
      const cap = childCaps.reduce((s, v) => s + v, 0);
      const actual = (parentCatsByMonth[selectedMonth] || {})[parent] || 0;
      const ratio = cap > 0 ? actual / cap : 0;
      const over = ratio >= 1;
      const warn = !over && ratio >= 0.8;

      // Guard-rail calculation
      const guardrailRatio = baseIncome > 0 ? actual / baseIncome : 0;

      return {
        key: parent,
        cap,
        actual,
        ratio,
        over,
        warn,
        children,
        childCaps,
        guardrailRatio,
        overspendAmount: Math.max(0, actual - cap)
      };
    });
  }, [capsByMonth, parentCatsByMonth, selectedMonth, baseIncome]);

  // Sort rows by overspend first, then by largest gap
  const sortedRows = useMemo(() => {
    const sorted = [...budgetRows];
    if (sortBy === "overspend") {
      return sorted.sort((a, b) => {
        // First by status: Over > Near > OK
        const statusOrder = { over: 3, near: 2, ok: 1 };
        const aStatus = a.over ? "over" : a.warn ? "near" : "ok";
        const bStatus = b.over ? "over" : b.warn ? "near" : "ok";

        if (statusOrder[aStatus] !== statusOrder[bStatus]) {
          return statusOrder[bStatus] - statusOrder[aStatus];
        }

        // Then by largest overspend amount
        return b.overspendAmount - a.overspendAmount;
      });
    }
    return sorted.sort((a, b) => a.key.localeCompare(b.key));
  }, [budgetRows, sortBy]);



  // Handle cap changes with rounding
  const handleCapChange = (childName: string, value: number) => {
    const rounded = round1000(value);
    setCap(selectedMonth, childName, rounded);
  };

  // Export/Import/Copy functions
  const exportBudgetReport = () => {
    const csvContent = [
      "month,parentCategory,childCategory,budget,actual,variance,variancePercent,status,guardrailPercent",
      ...sortedRows.flatMap(row =>
        row.children.map((childName, i) => {
          const actualChild = (subCatsByMonth[selectedMonth] || {})[childName] || 0;
          const capChild = row.childCaps[i] || 0;
          const varianceChild = capChild - actualChild;
          const variancePct = capChild > 0 ? (varianceChild / capChild) * 100 : 0;
          const overChild = capChild > 0 && actualChild >= capChild;
          const warnChild = !overChild && capChild > 0 && actualChild >= 0.8 * capChild;
          const statusChild = overChild ? "Over" : warnChild ? "Near" : "OK";
          const guardrailPct = baseIncome > 0 ? (actualChild / baseIncome) * 100 : 0;

          return `${selectedMonth},"${row.key}","${childName}",${capChild},${actualChild},${varianceChild},${variancePct.toFixed(1)},${statusChild},${guardrailPct.toFixed(1)}`;
        })
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-report-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyBudgetReport = async () => {
    const csvContent = [
      "month,parentCategory,childCategory,budget,actual,variance,variancePercent,status,guardrailPercent",
      ...sortedRows.flatMap(row =>
        row.children.map((childName, i) => {
          const actualChild = (subCatsByMonth[selectedMonth] || {})[childName] || 0;
          const capChild = row.childCaps[i] || 0;
          const varianceChild = capChild - actualChild;
          const variancePct = capChild > 0 ? (varianceChild / capChild) * 100 : 0;
          const overChild = capChild > 0 && actualChild >= capChild;
          const warnChild = !overChild && capChild > 0 && actualChild >= 0.8 * capChild;
          const statusChild = overChild ? "Over" : warnChild ? "Near" : "OK";
          const guardrailPct = baseIncome > 0 ? (actualChild / baseIncome) * 100 : 0;

          return `${selectedMonth},"${row.key}","${childName}",${capChild},${actualChild},${varianceChild},${variancePct.toFixed(1)},${statusChild},${guardrailPct.toFixed(1)}`;
        })
      )
    ].join("\n");

    try {
      await navigator.clipboard.writeText(csvContent);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleImportCapsFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").slice(1); // Skip header

      lines.forEach(line => {
        const [month, child, cap] = line.split(",");
        if (month === selectedMonth && child && cap) {
          setCap(selectedMonth, child, Number(cap));
        }
      });
    };
    reader.readAsText(file);
  };

    return (
    <section className="bg-white rounded-2xl shadow p-3 sm:p-4 mb-6" aria-label="Budget management">
      <h2 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Budget Management - Quản lý Ngân sách
      </h2>

      {/* Budget Suggestions Section */}
      <BudgetSuggestions
        selectedMonth={selectedMonth}
        subCatsByMonth={subCatsByMonth}
        netIncome={baseIncome}
      />

      {/* Divider */}
      <div className="my-6 border-t border-neutral-200"></div>

      {/* Budget vs Actual Section */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Budget vs Actual - Ngân sách và Thực chi
        </h3>

      {/* Mobile-friendly Controls */}
      <div className="space-y-3 mb-4">
        {/* Mode Toggle and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600 font-medium">Mode:</span>
            <div className="inline-flex rounded-lg border border-neutral-200 overflow-hidden">
              <button
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  budgetMode === "view"
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
                onClick={() => setBudgetMode("view")}
              >
                View
              </button>
              <button
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  budgetMode === "edit"
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
                onClick={() => setBudgetMode("edit")}
              >
                Edit
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "overspend" | "alphabetical")}
              className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="overspend">Overspend</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportBudgetReport}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
            title="Export complete budget report with actual spending and variance"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </button>
          <button
            onClick={copyBudgetReport}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
            title="Copy complete budget report to clipboard"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Report
          </button>
          <label className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors cursor-pointer">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import
            <input type="file" accept=".csv" className="hidden" onChange={handleImportCapsFile} />
          </label>
        </div>
      </div>



      {/* Budget Hierarchy - Visual parent-child structure */}
      <div className="space-y-3">
        {sortedRows.map((row) => (
          <BudgetHierarchyCard
            key={row.key}
            row={row}
            selectedMonth={selectedMonth}
            subCatsByMonth={subCatsByMonth}
            capsByMonth={capsByMonth}
            mode={budgetMode}
            onCapChange={handleCapChange}
          />
        ))}
      </div>

      {/* Help Icon */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowHelpPopup(true)}
          className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          title="Budget Hierarchy Guide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Help Popup */}
      {showHelpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Budget Hierarchy Guide</h3>
              <button
                onClick={() => setShowHelpPopup(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 text-sm text-neutral-700 space-y-2">
              <p>• <strong>Parent Categories</strong>: Main spending groups with summary totals</p>
              <p>• <strong>Child Categories</strong>: Specific subcategories with individual budgets</p>
              <p>• <strong>Tree Structure</strong>: Visual hierarchy showing parent-child relationships</p>
              <p>• <strong>Status Indicators</strong>: Color-coded dots and badges (OK/Near/Over)</p>
              <p>• <strong>Progress Bars</strong>: Visual representation of budget usage</p>
              <p>• <strong>Guard-rail Warnings</strong>: Alerts when spending exceeds income thresholds</p>
              <p>• <strong>Edit Mode</strong>: Click to adjust individual child budgets</p>
              <p>• <strong>Export Report</strong>: Download complete budget analysis as CSV</p>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}

// Budget Hierarchy Card - Visual parent-child structure
interface BudgetHierarchyCardProps {
  row: {
    key: string;
    cap: number;
    actual: number;
    ratio: number;
    over: boolean;
    warn: boolean;
    children: string[];
    childCaps: number[];
    guardrailRatio: number;
    overspendAmount: number;
  };
  selectedMonth: string;
  subCatsByMonth: Record<string, Record<string, number>>;
  capsByMonth: Record<string, Record<string, number>>;
  mode: "view" | "edit";
  onCapChange: (childName: string, value: number) => void;
}

function BudgetHierarchyCard({ row, selectedMonth, subCatsByMonth, capsByMonth, mode, onCapChange }: BudgetHierarchyCardProps) {
  const [open, setOpen] = useState(false);
  const pct = row.cap > 0 ? Math.min(300, Math.max(0, (row.actual / row.cap) * 100)) : 0;
  const status = row.over ? "Over" : row.warn ? "Near" : "OK";
  const variance = row.cap - row.actual;
  const variancePct = row.cap > 0 ? (variance / row.cap) * 100 : 0;

  return (
    <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden">
      {/* Parent Category Header */}
      <div className="p-4 border-b border-neutral-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Parent Icon */}
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-neutral-900">{row.key}</h3>
              <p className="text-xs text-neutral-500">{row.children.length} subcategories</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              row.over ? "bg-red-100 text-red-700" :
              row.warn ? "bg-amber-100 text-amber-700" :
              "bg-green-100 text-green-700"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                row.over ? "bg-red-500" : row.warn ? "bg-amber-500" : "bg-green-500"
              }`} />
              <span className="text-sm font-medium">{status}</span>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg
                className={`w-4 h-4 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Parent Summary - 3 Column Layout */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium mb-1">BUDGET</div>
            <div className="text-lg font-bold text-blue-700">{formatVND(row.cap)}</div>
          </div>

          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-xs text-neutral-600 font-medium mb-1">ACTUAL</div>
            <div className={`text-lg font-bold ${
              row.over ? "text-red-600" : row.warn ? "text-amber-600" : "text-green-600"
            }`}>
              {formatVND(row.actual)}
            </div>
          </div>

          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-xs text-neutral-600 font-medium mb-1">VARIANCE</div>
            <div className={`text-lg font-bold ${
              variance >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {variance >= 0 ? "+" : ""}{formatVND(variance)}
            </div>
            <div className={`text-xs ${
              variance >= 0 ? "text-green-500" : "text-red-500"
            }`}>
              {Math.abs(Math.round(variancePct))}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-neutral-600">Progress: {Math.round(pct)}%</span>
            <span className="text-xs text-neutral-600">
              {row.over ? `${formatVND(row.overspendAmount)} over` :
               row.warn ? `${formatVND(Math.abs(variance))} remaining` :
               `${formatVND(variance)} remaining`}
            </span>
          </div>
          <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                row.over ? "bg-red-500" : row.warn ? "bg-amber-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
        </div>

        {/* Guard-rail Warning */}
        {row.guardrailRatio > 0.3 && (
          <div className={`mt-3 p-2 rounded-lg border ${
            row.guardrailRatio > 1
              ? "bg-red-50 border-red-200"
              : row.guardrailRatio > 0.8
              ? "bg-amber-50 border-amber-200"
              : "bg-blue-50 border-blue-200"
          }`}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-xs font-medium">
                Spending {Math.round(row.guardrailRatio * 100)}% of total income
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Children Tree - Visual Hierarchy */}
      {open && (
        <div className="p-4 bg-neutral-50">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Subcategories ({row.children.length})
          </h4>

          <div className="space-y-2">
            {row.children.map((childName, i) => {
              const actualChild = (subCatsByMonth[selectedMonth] || {})[childName] || 0;
              const capChild = row.childCaps[i] || 0;
              const pctChild = capChild > 0 ? Math.min(300, Math.max(0, (actualChild / capChild) * 100)) : 0;
              const overChild = capChild > 0 && actualChild >= capChild;
              const warnChild = !overChild && capChild > 0 && actualChild >= 0.8 * capChild;
              const statusChild = overChild ? "Over" : warnChild ? "Near" : "OK";
              const varianceChild = capChild - actualChild;

              return (
                <div key={childName} className="bg-white rounded-lg p-3 border border-neutral-200">
                  {/* Child Header with Tree Structure */}
                  <div className="flex items-center gap-3 mb-2">
                    {/* Tree Connector */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 border-l-2 border-b-2 border-neutral-300 rounded-bl-lg"></div>
                      <div className="w-px h-4 bg-neutral-300"></div>
                    </div>

                    {/* Child Icon */}
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      statusChild === "Over" ? "bg-red-100" :
                      statusChild === "Near" ? "bg-amber-100" :
                      "bg-green-100"
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        statusChild === "Over" ? "bg-red-500" :
                        statusChild === "Near" ? "bg-amber-500" :
                        "bg-green-500"
                      }`} />
                    </div>

                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-neutral-800">{childName}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          statusChild === "Over" ? "text-red-700 bg-red-100" :
                          statusChild === "Near" ? "text-amber-700 bg-amber-100" :
                          "text-green-700 bg-green-100"
                        }`}>
                          {statusChild}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {Math.round(pctChild)}% of budget
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Child Data - Compact Layout */}
                  <div className="ml-9 grid grid-cols-3 gap-3 mb-2">
                    <div className="text-center">
                      <div className="text-xs text-neutral-500">Budget</div>
                      <div className="text-sm font-medium text-blue-600">{formatVND(capChild)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-neutral-500">Actual</div>
                      <div className={`text-sm font-medium ${
                        statusChild === "Over" ? "text-red-600" :
                        statusChild === "Near" ? "text-amber-600" :
                        "text-green-600"
                      }`}>
                        {formatVND(actualChild)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-neutral-500">Variance</div>
                      <div className={`text-sm font-medium ${
                        varianceChild >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {varianceChild >= 0 ? "+" : ""}{formatVND(varianceChild)}
                      </div>
                    </div>
                  </div>

                  {/* Child Progress Bar */}
                  <div className="ml-9 mb-2">
                    <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          statusChild === "Over" ? "bg-red-500" :
                          statusChild === "Near" ? "bg-amber-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(100, pctChild)}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget input (edit mode) */}
                  {mode === "edit" && (
                    <div className="ml-9">
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={Math.round(capChild)}
                        onChange={(e) => onCapChange(childName, Number(e.target.value || 0))}
                        onBlur={(e) => onCapChange(childName, Math.round(Number(e.target.value || 0) / 1000) * 1000)}
                        placeholder="Set budget..."
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
