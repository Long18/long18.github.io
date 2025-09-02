import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
import {
  aggregateByMonth,
  parentAndSubMaps,
  suggestCapsForMonth,
  formatVND,
  clamp,
  GUARDRAIL_PCT,
  DEFAULT_NET,
  PAYSLIP_NET_BY_MONTH
} from "@/lib/aggregations";

// Import components
import MonthPicker from "@/components/budget/MonthPicker";
import BudgetTable from "@/components/budget/BudgetTable";
import Charts from "@/components/budget/Charts";
import Transactions from "@/components/budget/Transactions";

// =====================================================
// Main component
// =====================================================

export default function FinanceDashboardMVP() {
  const now = new Date();
  const initialMonth = getMonthKey(now);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const { transactions, importCsv, notice, loading } = useCsvImport();

  // Exclusion toggles (analytics only)
  const [excludedChildren, setExcludedChildren] = useState<Set<string>>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("excludedChildren") : null;
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  const toggleExclude = useCallback((child: string) =>
    setExcludedChildren((prev) => {
      const next = new Set(prev);
      if (next.has(child)) next.delete(child);
      else next.add(child);
      if (typeof window !== "undefined") localStorage.setItem("excludedChildren", JSON.stringify(Array.from(next)));
      return next;
    }), []);

  const analyticsTransactions = useMemo(() =>
    transactions.filter((t) => !excludedChildren.has(t.categoryChild)),
    [transactions, excludedChildren]
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
  const payslipNet = PAYSLIP_NET_BY_MONTH[selectedMonth] ?? DEFAULT_NET;

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
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">Personal Finance Dashboard</h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Upload Money Lover CSV (Sổ giao dịch, Khoản thu/chi). Month filter applies to all views.
              (Tải CSV. Bộ lọc tháng áp dụng cho mọi màn hình.)
            </p>
          </div>
          <div className="flex gap-3 items-center w-full md:w-auto">
            <input
              aria-label="Upload CSV"
              type="file"
              accept=".csv"
              multiple
              onChange={onFile}
              className="block w-full text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-3 sm:p-4">
            <label className="text-xs sm:text-sm font-medium">Select month - Chọn tháng</label>
            <div className="mt-2">
              <MonthPicker value={selectedMonth} onChange={setSelectedMonth} monthsAvailable={new Set(months)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-center mb-3">Payslip net income - Thu nhập ròng</div>

            {/* Main payslip amount - big and centered */}
            <div className="text-center mb-3">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{formatVND(payslipNet)}</div>
            </div>

            {/* Baseline badge */}
            <div className="flex justify-center mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                seriesForMonth.income > 0
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                Baseline: {seriesForMonth.income > 0 ? "Transactions" : "Payslip"}
              </span>
            </div>

            {/* Variance chip */}
            {payslipNet > 0 && (
              <div className="flex justify-center mb-2">
                {(() => {
                  const variance = seriesForMonth.income - payslipNet;
                  const variancePct = Math.round((variance / payslipNet) * 100);
                  const isPositive = variance >= 0;

                  return (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isPositive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {isPositive ? "+" : ""}{formatVND(variance)} ({isPositive ? "+" : ""}{variancePct}%)
                    </span>
                  );
                })()}
              </div>
            )}

            {/* Context line */}
            <div className="text-center">
              <p className="text-xs text-neutral-500">
                Observed income: {formatVND(seriesForMonth.income || payslipNet)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
            <label className="text-xs sm:text-sm font-medium">Status - Trạng thái</label>
            <div className="mt-2 space-y-1 text-xs sm:text-sm">
              {(() => {
                const msgs: string[] = [];
                const baseIncome = seriesForMonth.income || payslipNet;
                if (!baseIncome) msgs.push("Chưa có thu nhập để tính guard-rail");
                else {
                  const parentMap = parentCatsByMonth[selectedMonth] || {};
                  for (const [p, pct] of Object.entries(GUARDRAIL_PCT)) {
                    const spent = parentMap[p] || 0;
                    if (spent / baseIncome > pct) msgs.push(`⚠ ${p} > ${Math.round(pct * 100)}% of income`);
                  }
                }
                return msgs.length ?
                  msgs.map((m) => <div key={m} className="text-amber-700 break-words">{m}</div>) :
                  <div className="text-green-700">Không có cảnh báo guard-rail</div>;
              })()}
            </div>
          </div>
        </section>

        {/* KPI cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-neutral-500">Income - Thu</div>
            <div className="text-lg sm:text-2xl font-semibold">{formatVND(seriesForMonth.income)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-neutral-500">Expense - Chi</div>
            <div className="text-lg sm:text-2xl font-semibold">{formatVND(seriesForMonth.expense)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-neutral-500">Balance - Cân đối</div>
            <div className="text-lg sm:text-2xl font-semibold">{formatVND(seriesForMonth.income - seriesForMonth.expense)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-neutral-500">Saving rate - Tỉ lệ tiết kiệm</div>
            <div className="text-lg sm:text-2xl font-semibold">
              {(() => {
                const saved = (parentCatsByMonth[selectedMonth] || {})["Investment & Savings"] || 0;
                const base = seriesForMonth.income || payslipNet;
                const rate = base > 0 ? Math.round((saved / base) * 100) : 0;
                return `${clamp(rate, 0, 100)}%`;
              })()}
            </div>
          </div>
        </section>

        {/* Analytics scope: exclude toggles */}
        <section className="bg-white rounded-2xl shadow p-3 sm:p-4 mb-6" aria-label="Analytics scope">
          <h2 className="text-sm sm:text-base font-semibold mb-3">Analytics scope - Phạm vi phân tích</h2>
          <p className="text-xs text-neutral-500 mb-2">
            Tắt các nhóm con để loại trừ khỏi phân tích và biểu đồ. Giao dịch vẫn hiển thị ở bảng bên dưới.
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {Array.from(new Set(transactions.filter((t) => getMonthKey(t.date) === selectedMonth).map((t) => t.categoryChild)))
              .sort()
              .map((c) => {
                const off = excludedChildren.has(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleExclude(c)}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs border transition-colors ${
                      off ? "bg-neutral-100 text-neutral-500 line-through border-neutral-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}
                    title={off ? "Excluded from analytics" : "Included in analytics"}
                  >
                    {c}
                  </button>
                );
              })}
          </div>
        </section>

        {/* Charts */}
        <Charts monthlySeries={monthlySeries} pieData={pieData} />

        {/* Budget vs Actual */}
        <BudgetTable
          selectedMonth={selectedMonth}
          parentCatsByMonth={parentCatsByMonth}
          subCatsByMonth={subCatsByMonth}
        />

        {/* Insights */}
        <section className="bg-white rounded-2xl shadow p-3 sm:p-4 mb-6" aria-label="Insights">
          <h2 className="text-sm sm:text-base font-semibold mb-3">Insights - Nhận định</h2>
          {(() => {
            const caps = capsByMonth[selectedMonth] || {};
            const subMap = subCatsByMonth[selectedMonth] || {};
            const items = Object.keys(subMap)
              .map((child) => {
                const actual = subMap[child] || 0;
                const cap = caps[child] || 0;
                const over = Math.max(0, actual - cap);
                const pct = cap > 0 ? Math.round((actual / cap) * 100) : 0;
                return { child, actual, cap, over, pct };
              })
              .filter((x) => x.over > 0)
              .sort((a, b) => b.over - a.over)
              .slice(0, 3);
            return items.length ? (
              <ul className="text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                {items.map((i) => (
                  <li key={i.child} className="break-words">
                    <span className="font-medium">{i.child}</span>: over {formatVND(i.over)} ({i.pct}% of cap)
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs sm:text-sm text-neutral-600">No overspends this month - Không có mục vượt ngân sách tháng này</div>
            );
          })()}
          <p className="mt-2 text-xs text-neutral-500">
            Exclusions affect analytics only, not the transactions list. (Loại trừ chỉ ảnh hưởng phân tích, không ẩn giao dịch.)
          </p>
        </section>

        {/* Transactions */}
        <Transactions transactions={transactions} selectedMonth={selectedMonth} />

        <footer className="text-xs text-neutral-500 pb-8">
          <div>
            Charts có tooltip và số liệu, trạng thái có nhãn chữ để tránh phụ thuộc màu.
            (Đối chiếu số liệu diễn ra theo tháng đã chọn.)
          </div>
        </footer>
      </div>
    </div>
  );
}
