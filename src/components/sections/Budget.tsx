import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import Papa from "papaparse";
import { parseAmount } from "@/lib/parsing";

// Import modules
import {
  Tx,
  getMonthKey,
  useCsvImport,
  PARENT_TO_CHILDREN
} from "@/lib/parsing";
import {
  useCapsStore,
  CapsByMonth
} from "@/lib/storeCaps";
import { useAnalyticsScopeStore } from "@/lib/storeAnalyticsScope";
import {
  aggregateByMonth,
  parentAndSubMaps,
  suggestCapsForMonth,
  formatVND,
  clamp,
  round1000,
  GUARDRAIL_PCT,
  DEFAULT_NET
} from "@/lib/aggregations";

// Import components
import MonthCalendar from "@/components/budget/MonthCalendar";
import BudgetTable from "@/components/budget/BudgetTable";
import Charts from "@/components/budget/Charts";
import Transactions from "@/components/budget/Transactions";
import AnalyticsScope from "@/components/budget/AnalyticsScope";

// =====================================================
// Main component
// =====================================================

export default function FinanceDashboardMVP() {
  const now = new Date();
  const initialMonth = getMonthKey(now);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const { transactions, importCsv, notice, loading } = useCsvImport();

  // Exclusion toggles (analytics only)
  // Analytics scope store
  const { getExcludedSet } = useAnalyticsScopeStore();

  // Get excluded set for current month
  const excludedSet = useMemo(() => getExcludedSet(selectedMonth), [getExcludedSet, selectedMonth]);

  // Analytics transactions filtered by scope
  const analyticsTransactions = useMemo(() =>
    transactions.filter((t) => !excludedSet.has(t.categoryChild)),
    [transactions, excludedSet]
  );

  // Available months from data
  const months = useMemo(() =>
    Array.from(new Set(transactions.map((t) => getMonthKey(t.date)))).sort(),
    [transactions]
  );

  useEffect(() => {
    if (months.length && !months.includes(selectedMonth)) {
      setSelectedMonth(months[months.length - 1]);
    }
  }, [months]); // Remove selectedMonth from dependencies to prevent infinite loop

  // Aggregations for all months
  const monthAgg = useMemo(() => aggregateByMonth(analyticsTransactions), [analyticsTransactions]);

  // Filter transactions for selected month only (for pie chart and budget table)
  const selectedMonthTransactions = useMemo(() =>
    analyticsTransactions.filter((t) => getMonthKey(t.date) === selectedMonth),
    [analyticsTransactions, selectedMonth]
  );

  const { parent: parentCatsByMonth, sub: subCatsByMonth } = useMemo(() => {
    const maps = parentAndSubMaps(selectedMonthTransactions);
    return {
      parent: { [selectedMonth]: maps.parent[selectedMonth] || {} },
      sub: { [selectedMonth]: maps.sub[selectedMonth] || {} }
    };
  }, [selectedMonthTransactions, selectedMonth]);

  const monthlySeries = useMemo(
    () =>
      Object.keys(monthAgg)
        .sort()
        .map((m) => ({
          month: m,
          income: monthAgg[m].income,
          expense: monthAgg[m].expense,
          balance: monthAgg[m].income - monthAgg[m].expense
        })),
    [monthAgg]
  );

  const seriesForMonth = monthAgg[selectedMonth] || { income: 0, expense: 0 };
  const [payslipNet, setPayslipNet] = useState<number>(DEFAULT_NET);

  // Pie data for current month (parent distribution)
  const pieData = useMemo(() => {
    const parentMap = parentCatsByMonth[selectedMonth] || {};
    const entries = Object.entries(parentMap).sort((a, b) => b[1] - a[1]);
    const top = entries.slice(0, 7);
    const otherSum = entries.slice(7).reduce((s, [, v]) => s + v, 0);
    const rows = top.map(([name, value]) => ({ name, value }));
    if (otherSum > 0) rows.push({ name: "Other", value: otherSum });
    return rows;
  }, [parentCatsByMonth, selectedMonth]);

  // Budget rows
  const { capsByMonth, setCaps } = useCapsStore();

  // Track suggested months to prevent infinite loops
  const suggestedMonthsRef = useRef<Set<string>>(new Set());

  // Guard-rail warnings
  const guardrailWarnings = useMemo(() => {
    const warn: string[] = [];
    const baseIncome = seriesForMonth.income || payslipNet;
    if (!baseIncome) return warn;
    const parentMap = parentCatsByMonth[selectedMonth] || {};
    for (const [p, pct] of Object.entries(GUARDRAIL_PCT)) {
      const spent = parentMap[p] || 0;
      if (spent / baseIncome > pct) warn.push(`${p} > ${Math.round(pct * 100)}% of income`);
    }
    return warn;
  }, [parentCatsByMonth, selectedMonth, seriesForMonth, payslipNet]);

  // Suggest caps when empty for the chosen month
  useEffect(() => {
    const existing = capsByMonth[selectedMonth] || {};
    const hasExistingCaps = Object.keys(existing).length > 0;
    const alreadySuggested = suggestedMonthsRef.current.has(selectedMonth);

    if (!hasExistingCaps && !alreadySuggested) {
      setCaps(selectedMonth, suggestCapsForMonth(selectedMonth, monthAgg, subCatsByMonth));
      suggestedMonthsRef.current.add(selectedMonth);
    }
  }, [selectedMonth, subCatsByMonth, monthAgg]); // Remove capsByMonth to prevent infinite loop

  // File handlers
  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    Array.from(files).forEach(file => importCsv(file, selectedMonth));
    e.currentTarget.value = "";
  }, [importCsv, selectedMonth]);

  // Caps CSV helpers
  const buildCapsCsv = () => {
    const caps = capsByMonth[selectedMonth] || {};
    const header = ["month,categoryChild,capAmount"];
    const lines = Object.entries(caps).map(([child, amt]) =>
      `${selectedMonth},${String(child).replace(/,/g, " ")},${Math.max(0, Math.round(amt as number))}`
    );
    return header.concat(lines).join("\n");
  };

  const [capsFlash, setCapsFlash] = useState<string>("");

  const exportCapsCsv = () => {
    const csv = buildCapsCsv();
    try {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `caps_${selectedMonth}.csv`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setCapsFlash("Exported caps CSV");
      setTimeout(() => setCapsFlash(""), 2500);
    } catch {
      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(csv);
          setCapsFlash("Copied caps CSV to clipboard");
          setTimeout(() => setCapsFlash(""), 2500);
        } else {
          console.log(csv);
          setCapsFlash("Export failed. CSV printed to console");
          setTimeout(() => setCapsFlash(""), 3000);
        }
      } catch {
        console.log(csv);
        setCapsFlash("Export failed. CSV printed to console");
        setTimeout(() => setCapsFlash(""), 3000);
      }
    }
  };

  const copyCapsCsv = () => {
    const csv = buildCapsCsv();
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(csv)
        .then(() => {
          setCapsFlash("Copied caps CSV to clipboard");
          setTimeout(() => setCapsFlash(""), 2500);
        })
        .catch(() => {
          console.log(csv);
          setCapsFlash("Copy failed. CSV printed to console");
          setTimeout(() => setCapsFlash(""), 3000);
        });
    } else {
      console.log(csv);
      setCapsFlash("Copy not supported. CSV printed to console");
      setTimeout(() => setCapsFlash(""), 3000);
    }
  };

  const onImportCapsFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res: any) => {
        try {
          const rows = (res.data as any[]) || [];
          const caps: Record<string, number> = {};
          for (const r of rows) {
            const child = r.categoryChild || r.Category || r.child || r["Nhóm"] || r["Category - Nhóm"];
            const raw = r.capAmount || r.Cap || r.amount || r["Budget"] || r["Hạn mức"];
            if (!child) continue;
            const amt = Math.max(0, Math.round(parseAmount(String(raw))));
            caps[String(child)] = amt;
          }
          setCaps(selectedMonth, caps);
          setCapsFlash("Imported caps CSV");
          setTimeout(() => setCapsFlash(""), 2500);
        } catch {}
      },
    });
    e.currentTarget.value = "";
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">Personal Finance Dashboard</h1>
            <p className="text-xs text-neutral-600 mt-1">
              Upload Money Lover CSV (Sổ giao dịch, Khoản thu/chi). Month filter applies to all views.
              (Tải CSV. Bộ lọc tháng áp dụng cho mọi màn hình.)
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              aria-label="Upload CSV"
              type="file"
              accept=".csv"
              multiple
              onChange={onFile}
              className="block w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </header>

        {(loading || notice) && (
          <div className={`mb-4 rounded-xl border p-3 text-sm ${
            loading ? "border-blue-300 bg-blue-50 text-blue-800" : "border-amber-300 bg-amber-50 text-amber-800"
          }`} role="status">
            {loading ? "Đang xử lý CSV… / Parsing CSV…" : notice}
          </div>
        )}

        {/* Top controls */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-3">
            <label className="text-xs font-medium text-neutral-700 mb-2 block flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Select month - Chọn tháng
            </label>
            <MonthCalendar value={selectedMonth} onChange={setSelectedMonth} monthsWithData={new Set(months)} />
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-3">
            <div className="text-xs font-medium text-neutral-700 text-center mb-2 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Net income - Thu nhập ròng
            </div>

            {/* Input field for payslip net income */}
            <div className="text-center mb-2">
              <input
                type="number"
                inputMode="numeric"
                className="w-full text-xl font-bold text-gray-900 text-center border-none outline-none bg-transparent"
                value={payslipNet}
                onChange={(e) => setPayslipNet(Number(e.target.value || 0))}
                placeholder="0"
                min="0"
                step="1000"
              />
            </div>

            {/* Baseline badge and delta */}
            <div className="flex justify-center items-center gap-1 mb-1">
              <span className={`px-1.5 py-0.5 text-xs rounded-full border ${
                seriesForMonth.income > 0
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-neutral-100 border-neutral-200 text-neutral-600"
              }`}>
                {seriesForMonth.income > 0 ? "Baseline: Transactions" : "Baseline: Payslip"}
              </span>
              {payslipNet > 0 && seriesForMonth.income > 0 && (
                (() => {
                  const delta = seriesForMonth.income - payslipNet;
                  return (
                    <span className={`px-1 py-0.5 text-[11px] rounded border ${
                      delta >= 0
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                      {delta >= 0 ? "+" : ""}{formatVND(Math.abs(delta))}
                    </span>
                  );
                })()
              )}
            </div>

            {/* Context line */}
            <div className="text-center">
              <p className="text-xs text-neutral-500">
                Observed: {formatVND(seriesForMonth.income)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1 mb-2">
              <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <label className="text-xs font-semibold text-indigo-900">Status & Insights - Trạng thái & Nhận định</label>
            </div>
            <div className="space-y-2">
              {/* Status Section */}
              <div>
                <div className="text-xs font-medium text-neutral-600 mb-1">Guard-rail Status</div>
                {(() => {
                  const msgs: string[] = [];
                  const baseIncome = seriesForMonth.income || payslipNet;
                  if (!baseIncome) {
                    return (
                      <div className="flex items-center gap-1 p-1.5 bg-neutral-50 rounded-lg border border-neutral-200">
                        <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-neutral-600">Chưa có thu nhập để tính guard-rail</span>
                      </div>
                    );
                  } else {
                    const parentMap = parentCatsByMonth[selectedMonth] || {};
                    for (const [p, pct] of Object.entries(GUARDRAIL_PCT)) {
                      const spent = parentMap[p] || 0;
                      if (spent / baseIncome > pct) {
                        msgs.push(`${p} > ${Math.round(pct * 100)}% of income`);
                      }
                    }
                  }

                  if (msgs.length > 0) {
                    return (
                      <div className="space-y-1">
                        {msgs.map((m, index) => (
                          <div key={index} className="flex items-center gap-1 p-1.5 bg-red-50 rounded-lg border border-red-200">
                            <svg className="w-3 h-3 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-xs text-red-700 break-words">{m}</span>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex items-center gap-1 p-1.5 bg-green-50 rounded-lg border border-green-200">
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-green-700">Không có cảnh báo guard-rail</span>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Insights Section */}
              <div>
                <div className="text-xs font-medium text-neutral-600 mb-1">Top Overspends</div>
                {(() => {
                  const caps = capsByMonth[selectedMonth] || {};
                  const subMap = subCatsByMonth[selectedMonth] || {};
                  const items = Object.keys(subMap)
                    .map((child) => {
                      const cap = Math.max(0, round1000(caps[child] || 0));
                      const actual = subMap[child] || 0;
                      const over = Math.max(0, actual - cap);
                      return { child, over, cap, actual };
                    })
                    .filter((item) => item.over > 0)
                    .sort((a, b) => b.over - a.over)
                    .slice(0, 3);

                  if (items.length === 0) {
                    return (
                      <div className="flex items-center gap-1 p-1.5 bg-green-50 rounded-lg border border-green-200">
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-green-700">Không có vượt ngân sách</span>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-1">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-1.5 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-xs text-amber-700 font-medium">{item.child}</span>
                          </div>
                          <span className="text-xs text-amber-700 font-semibold">+{formatVND(item.over)}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* KPI cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-3">
            <div className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Income - Thu
            </div>
            <div className="text-lg font-semibold text-green-700">{formatVND(seriesForMonth.income)}</div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-3">
            <div className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              Expense - Chi
            </div>
            <div className="text-lg font-semibold text-red-700">{formatVND(seriesForMonth.expense)}</div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-3">
            <div className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Balance - Cân đối
            </div>
            <div className={`text-lg font-semibold ${
              (seriesForMonth.income - seriesForMonth.expense) >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {formatVND(seriesForMonth.income - seriesForMonth.expense)}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-3">
            <div className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Saving rate - Tỉ lệ tiết kiệm
            </div>
            <div className="text-lg font-semibold text-indigo-700">
              {(() => {
                const saved = (parentCatsByMonth[selectedMonth] || {})["Investment & Savings"] || 0;
                const base = seriesForMonth.income || payslipNet;
                const rate = base > 0 ? Math.round((saved / base) * 100) : 0;
                return `${clamp(rate, 0, 100)}%`;
              })()}
            </div>
          </div>
        </section>

        {/* Analytics scope */}
        <AnalyticsScope selectedMonth={selectedMonth} transactions={transactions} />

        {/* Charts */}
        <Charts monthlySeries={monthlySeries} pieData={pieData} />

        {/* Budget vs Actual */}
        <BudgetTable
          selectedMonth={selectedMonth}
          parentCatsByMonth={parentCatsByMonth}
          subCatsByMonth={subCatsByMonth}
          baseIncome={seriesForMonth.income || payslipNet}
        />



        {/* Transactions */}
        <Transactions transactions={transactions} selectedMonth={selectedMonth} />

        <footer className="text-xs text-neutral-500 pb-8">
          <div>
            This is a personal budget management tool designed for tracking expenses and income. If you're interested in using it or would like to learn more about its features, please feel free to contact me at us.thanhlong18@gmail.com. I'd be happy to help you get started!</div>
        </footer>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
