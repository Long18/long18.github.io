import React, { useState, useMemo } from "react";
import { useCapsStore } from "@/lib/storeCaps";
import { PARENT_TO_CHILDREN } from "@/lib/parsing";
import { formatVND, round1000, clamp } from "@/lib/aggregations";

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

  // Top overspends for insights
  const topOverspends = useMemo(() => {
    return sortedRows
      .filter(r => r.overspendAmount > 0)
      .slice(0, 3)
      .map(r => ({ name: r.key, amount: r.overspendAmount }));
  }, [sortedRows]);

  // Handle cap changes with rounding
  const handleCapChange = (childName: string, value: number) => {
    const rounded = round1000(value);
    setCap(selectedMonth, childName, rounded);
  };

  // Export/Import/Copy functions
  const exportCapsCsv = () => {
    const csvContent = [
      "month,categoryChild,capAmount",
      ...Object.entries(capsByMonth[selectedMonth] || {})
        .map(([child, cap]) => `${selectedMonth},${child},${cap}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-caps-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCapsCsv = async () => {
    const csvContent = [
      "month,categoryChild,capAmount",
      ...Object.entries(capsByMonth[selectedMonth] || {})
        .map(([child, cap]) => `${selectedMonth},${child},${cap}`)
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
    <section className="bg-white rounded-2xl shadow p-3 sm:p-4 mb-6" aria-label="Budget versus actual">
      <h2 className="text-sm sm:text-base font-semibold mb-3">Budget vs Actual - Ngân sách và Thực chi</h2>

      {/* Sticky Mode Toggle and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 sticky top-0 z-10 bg-white/80 backdrop-blur p-2 rounded-xl border border-neutral-200 mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-neutral-200 overflow-hidden">
            <button
              className={`px-3 py-1 text-xs ${budgetMode === "view" ? "bg-neutral-100" : ""}`}
              onClick={() => setBudgetMode("view")}
            >
              View
            </button>
            <button
              className={`px-3 py-1 text-xs ${budgetMode === "edit" ? "bg-neutral-100" : ""}`}
              onClick={() => setBudgetMode("edit")}
            >
              Edit
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "overspend" | "alphabetical")}
            className="px-2 py-1 text-xs rounded-lg border border-neutral-200"
          >
            <option value="overspend">Sort: Overspend</option>
            <option value="alphabetical">Sort: A-Z</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={exportCapsCsv} className="px-3 py-1 text-xs rounded-lg border hover:bg-neutral-50">
            Export
          </button>
          <button onClick={copyCapsCsv} className="px-3 py-1 text-xs rounded-lg border hover:bg-neutral-50">
            Copy
          </button>
          <label className="px-3 py-1 text-xs rounded-lg border hover:bg-neutral-50 cursor-pointer">
            Import
            <input type="file" accept=".csv" className="hidden" onChange={handleImportCapsFile} />
          </label>
        </div>
      </div>

      {/* Top Overspends Insights */}
      {topOverspends.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-xs text-amber-800">
            <strong>Top overspends:</strong>{" "}
            {topOverspends.map((item, i) => (
              <span key={item.name}>
                {item.name} +{formatVND(item.amount)}
                {i < topOverspends.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Parent Groups - Mobile Cards / Desktop Rows */}
      <div className="space-y-3">
        {sortedRows.map((row) => (
          <ParentGroup
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

      <p className="mt-4 text-xs text-neutral-500">
        Budget ở cấp con có thể chỉnh trực tiếp (tự động làm tròn 1.000 VND). Tổng cha = tổng con. Guard-rail cảnh báo theo % thu nhập.
      </p>
    </section>
  );
}

// ParentGroup Component - Mobile Cards / Desktop Rows
interface ParentGroupProps {
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

function ParentGroup({ row, selectedMonth, subCatsByMonth, capsByMonth, mode, onCapChange }: ParentGroupProps) {
  const [open, setOpen] = useState(true);
  const pct = row.cap > 0 ? Math.min(300, Math.max(0, (row.actual / row.cap) * 100)) : 0;
  const status = row.over ? "Over" : row.warn ? "Near" : "OK";

  return (
    <div className="border border-neutral-200 rounded-2xl p-3 mb-2 bg-white">
      {/* Column headers - only show on desktop */}
      <div className="hidden md:grid grid-cols-12 gap-2 items-center mb-2 text-xs text-neutral-600 font-medium">
        <div className="col-span-5">Category</div>
        <div className="col-span-2">Budget</div>
        <div className="col-span-2">Actual</div>
        <div className="col-span-1">%</div>
        <div className="col-span-2">Status</div>
      </div>

      {/* Parent header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left"
        aria-label={`Parent: ${row.key}, ${Math.round(pct)} percent of cap`}
      >
        <div className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-12 md:col-span-5 font-medium">{row.key}</div>
          <div className="col-span-4 md:col-span-2 text-sm">
            <span className="md:hidden text-xs text-neutral-500 mr-1">Budget:</span>
            {formatVND(row.cap)}
          </div>
          <div className="col-span-4 md:col-span-2 text-sm">
            <span className="md:hidden text-xs text-neutral-500 mr-1">Actual:</span>
            {formatVND(row.actual)}
          </div>
          <div className="col-span-2 md:col-span-1 text-sm">
            <span className="md:hidden text-xs text-neutral-500 mr-1">%:</span>
            {Math.round(pct)}%
          </div>
          <div className="col-span-2 md:col-span-2 text-xs">
            <span className="md:hidden text-xs text-neutral-500 mr-1">Status:</span>
            <span className={`px-2 py-1 rounded-full border ${
              row.over ? "text-red-700 bg-red-50 border-red-200" :
              row.warn ? "text-amber-700 bg-amber-50 border-amber-200" :
              "text-green-700 bg-green-50 border-green-200"
            }`}>
              {status}
            </span>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden" aria-label={`Actual ${pct}% of cap`}>
            <div
              className={`h-full ${row.over ? "bg-red-500" : row.warn ? "bg-amber-500" : "bg-green-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-xs text-neutral-600 flex justify-between">
            <span>{formatVND(row.actual)}</span>
            <span>/</span>
            <span>{formatVND(row.cap)}</span>
          </div>
        </div>

        {/* Guard-rail warning chip */}
        {row.guardrailRatio > 0.3 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              row.guardrailRatio > 1
                ? "bg-red-100 text-red-800 border border-red-200"
                : row.guardrailRatio > 0.8
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {Math.round(row.guardrailRatio * 100)}% of income
            </span>
          </div>
        )}
      </button>

      {/* Children */}
      {open && (
        <div className="mt-3 space-y-2">
          {row.children.map((childName, i) => {
            const actualChild = (subCatsByMonth[selectedMonth] || {})[childName] || 0;
            const capChild = row.childCaps[i] || 0;
            const pctChild = capChild > 0 ? Math.min(300, Math.max(0, (actualChild / capChild) * 100)) : 0;
            const overChild = capChild > 0 && actualChild >= capChild;
            const warnChild = !overChild && capChild > 0 && actualChild >= 0.8 * capChild;
            const statusChild = overChild ? "Over" : warnChild ? "Near" : "OK";

            return (
              <div key={childName} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-12 md:col-span-5 text-neutral-700">↳ {childName}</div>
                <div className="col-span-4 md:col-span-2">
                  <span className="md:hidden text-xs text-neutral-500 mr-1">Budget:</span>
                  {mode === "edit" ? (
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full rounded-lg border border-neutral-200 px-2 py-1 text-sm"
                      value={Math.round(capChild)}
                      onChange={(e) => onCapChange(childName, Number(e.target.value || 0))}
                      onBlur={(e) => onCapChange(childName, Math.round(Number(e.target.value || 0) / 1000) * 1000)}
                      placeholder="0"
                    />
                  ) : (
                    <span className="text-sm">{formatVND(capChild)}</span>
                  )}
                </div>
                <div className="col-span-4 md:col-span-2 text-sm">
                  <span className="md:hidden text-xs text-neutral-500 mr-1">Actual:</span>
                  {formatVND(actualChild)}
                </div>
                <div className="col-span-4 md:col-span-3">
                  <span className="md:hidden text-xs text-neutral-500 mr-1">Progress:</span>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          statusChild === "Over" ? "bg-red-500" :
                          statusChild === "Near" ? "bg-amber-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${pctChild}%` }}
                      />
                    </div>
                    <div className="text-xs text-neutral-600 flex justify-between">
                      <span>{formatVND(actualChild)}</span>
                      <span>/</span>
                      <span>{formatVND(capChild)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
