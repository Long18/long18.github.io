import React, { useState, useMemo } from "react";
import { Tx, getMonthKey } from "@/lib/parsing";
import { formatVND } from "@/lib/aggregations";

interface TransactionsProps {
  transactions: Tx[];
  selectedMonth: string;
}

export default function Transactions({ transactions, selectedMonth }: TransactionsProps) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [payer, setPayer] = useState("");

  const rows = useMemo(() => {
    const monthFiltered = transactions.filter((t) => getMonthKey(t.date) === selectedMonth);
    const cats = Array.from(new Set(monthFiltered.map((t) => t.categoryChild))).sort();
    const payers = Array.from(new Set(monthFiltered.map((t) => t.payer || "You"))).sort();
    const filtered = monthFiltered.filter((t) => {
      const q = query.trim().toLowerCase();
      const matchQ = q ? t.note?.toLowerCase().includes(q) || t.categoryChild.toLowerCase().includes(q) : true;
      const matchCat = cat ? t.categoryChild === cat : true;
      const matchPayer = payer ? (t.payer || "You") === payer : true;
      return matchQ && matchCat && matchPayer;
    });
    return { cats, payers, filtered };
  }, [transactions, query, cat, payer, selectedMonth]);

  const totalExpense = rows.filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = rows.filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  // Per-payer rollup summary with enhanced data
  const payerSummary = useMemo(() => {
    const monthFiltered = transactions.filter((t) => getMonthKey(t.date) === selectedMonth);
    const summary: Record<string, { total: number; count: number; income: number; expense: number }> = {};
    monthFiltered.forEach((t) => {
      const p = t.payer || "You";
      if (!summary[p]) {
        summary[p] = { total: 0, count: 0, income: 0, expense: 0 };
      }
      summary[p].total += Math.abs(t.amount);
      summary[p].count += 1;
      if (t.amount > 0) {
        summary[p].income += t.amount;
      } else {
        summary[p].expense += Math.abs(t.amount);
      }
    });
    return Object.entries(summary)
      .sort((a, b) => b[1].total - a[1].total);
  }, [transactions, selectedMonth]);

  return (
    <section className="bg-white rounded-2xl shadow p-4 mb-16" aria-label="Transactions">
      <h2 className="text-base font-semibold mb-3">Transactions - Giao dịch</h2>

      <div className="flex flex-col md:flex-row gap-2 md:items-end mb-3">
        <div className="flex-1">
          <label className="text-sm font-medium">Search - Tìm kiếm</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Từ khóa trong ghi chú hoặc nhóm"
            className="mt-1 w-full rounded-xl border border-neutral-200 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full md:w-64">
          <label className="text-sm font-medium">Category - Nhóm</label>
          <select
            className="mt-1 w-full rounded-xl border border-neutral-200 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            <option value="">All</option>
            {rows.cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enhanced per-payer rollup summary */}
      {payerSummary.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            By payer - Theo người trả
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {payerSummary.map(([p, data]) => (
              <div key={p} className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    p === "You"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-neutral-100 text-neutral-800"
                  }`}>
                    {p}
                  </span>
                  <span className="text-xs text-neutral-500">{data.count} txns</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Total:</span>
                    <span className="font-semibold text-blue-900">{formatVND(data.total)}</span>
                  </div>
                  {data.income > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600">Income:</span>
                      <span className="text-green-700">{formatVND(data.income)}</span>
                    </div>
                  )}
                  {data.expense > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-red-600">Expense:</span>
                      <span className="text-red-700">{formatVND(data.expense)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payer filter chips */}
      {rows.payers.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {rows.payers.map((p) => (
            <button
              key={p}
              onClick={() => setPayer(prev => prev === p ? "" : p)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                payer === p
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="text-sm text-neutral-600 mb-2">
        Total income - Tổng thu: <span className="font-medium text-green-700">{formatVND(totalIncome)}</span> ·
        Total expense - Tổng chi: <span className="font-medium text-red-700">{formatVND(totalExpense)}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-600">
              <th className="py-2">Date - Ngày</th>
              <th className="py-2">Category - Nhóm</th>
              <th className="py-2 hidden md:table-cell">Payer - Người trả</th>
              <th className="py-2">Amount - Số tiền</th>
              <th className="py-2 hidden md:table-cell">Wallet - Ví</th>
              <th className="py-2">Note - Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {rows.filtered.map((t) => (
              <tr key={t.id} className="border-t border-neutral-100">
                <td className="py-1">{t.rawDate}</td>
                <td className="py-1">
                  <div className="md:hidden">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{t.categoryChild}</div>
                      <div className="text-xs text-neutral-500">{t.categoryParent}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                        (t.payer || "You") === "You"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-neutral-100 text-neutral-700 border-neutral-200"
                      }`}>
                        {t.payer || "You"}
                      </span>
                      {t.wallet && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-purple-50 text-purple-600">
                          <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          {t.wallet}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{t.categoryChild}</div>
                      <div className="text-xs text-neutral-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {t.categoryParent}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-1 hidden md:table-cell">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                    (t.payer || "You") === "You"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-neutral-100 text-neutral-700 border-neutral-200"
                  }`}>
                    {t.payer || "You"}
                  </span>
                </td>
                <td className={`py-1 ${t.amount < 0 ? "text-red-700" : "text-green-700"}`}>
                  {formatVND(Math.abs(t.amount))}
                </td>
                <td className="py-1 hidden md:table-cell">
                  {t.wallet ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-200">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      {t.wallet}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400">—</span>
                  )}
                </td>
                <td className="py-1">
                  <div className="flex items-center gap-2">
                    <span>{t.note || ""}</span>
                    {/* Badges for split/reimbursed/transfer */}
                    {t.note && /split|chia tiền|share/i.test(t.note) && (
                      <span className="inline-block px-1.5 py-0.5 text-[11px] rounded border bg-neutral-50 text-neutral-700">
                        Split
                      </span>
                    )}
                    {t.note && /reimburse|hoàn tiền/i.test(t.note) && (
                      <span className="inline-block px-1.5 py-0.5 text-[11px] rounded border bg-green-50 text-green-700">
                        Reimbursed
                      </span>
                    )}
                    {/(transfer|internal)/i.test(t.categoryParent || "") && (
                      <span className="inline-block px-1.5 py-0.5 text-[11px] rounded border bg-blue-50 text-blue-700">
                        Transfer
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-neutral-500">
                  {payer ? `No transactions paid by ${payer} this month - Không có giao dịch do ${payer} trả trong tháng này` : "No transactions for this filter - Không có giao dịch phù hợp"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
