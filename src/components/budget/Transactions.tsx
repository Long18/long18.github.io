import React, { useState, useMemo } from "react";
import { Tx, getMonthKey } from "@/lib/parsing";
import { formatVND } from "@/lib/aggregations";

// Helper function to render note with hashtags
const renderNoteWithHashtags = (note: string) => {
  if (!note) return null;

  // Split by hashtags and render them as styled chips
  const parts = note.split(/(#\w+)/g);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {parts.map((part, index) => {
        if (part.startsWith('#')) {
          return (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {part}
            </span>
          );
        }
        return part ? <span key={index}>{part}</span> : null;
      })}
    </div>
  );
};

interface TransactionsProps {
  transactions: Tx[];
  selectedMonth: string;
}

export default function Transactions({ transactions, selectedMonth }: TransactionsProps) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [payer, setPayer] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");

  const rows = useMemo(() => {
    const monthFiltered = transactions.filter((t) => getMonthKey(t.date) === selectedMonth);
    const cats = Array.from(new Set(monthFiltered.map((t) => t.categoryChild))).sort();
    const payers = Array.from(new Set(monthFiltered.map((t) => t.payer || "You"))).sort();
    const filtered = monthFiltered.filter((t) => {
      const q = query.trim().toLowerCase();
      const matchQ = q ? t.note?.toLowerCase().includes(q) || t.categoryChild.toLowerCase().includes(q) : true;
      const matchCat = cat ? t.categoryChild === cat : true;
      const matchPayer = payer ? (t.payer || "You") === payer : true;
      const matchType = typeFilter === "all" ||
        (typeFilter === "income" && t.amount > 0) ||
        (typeFilter === "expense" && t.amount < 0);
      return matchQ && matchCat && matchPayer && matchType;
    });

    // Group transactions by date for mobile view
    const groupedByDate = filtered.reduce((acc, t) => {
      const dateKey = t.rawDate;
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          transactions: [],
          totalIncome: 0,
          totalExpense: 0,
          balance: 0
        };
      }
      acc[dateKey].transactions.push(t);
      if (t.amount > 0) {
        acc[dateKey].totalIncome += t.amount;
      } else {
        acc[dateKey].totalExpense += Math.abs(t.amount);
      }
      acc[dateKey].balance = acc[dateKey].totalIncome - acc[dateKey].totalExpense;
      return acc;
    }, {} as Record<string, {
      date: string;
      transactions: Tx[];
      totalIncome: number;
      totalExpense: number;
      balance: number;
    }>);

    // Sort dates in descending order (newest first)
    const sortedDates = Object.values(groupedByDate).sort((a, b) =>
      new Date(b.date.split('/').reverse().join('-')).getTime() -
      new Date(a.date.split('/').reverse().join('-')).getTime()
    );

    return { cats, payers, filtered, groupedByDate: sortedDates };
  }, [transactions, query, cat, payer, typeFilter, selectedMonth]);

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
    <section className="bg-white rounded-2xl shadow p-4 mb-16" aria-label="Transaction History">
      <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Transaction History - Lịch sử Giao dịch
      </h2>

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
                  <span className="text-xs text-neutral-500">{data.count} giao dịch</span>
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

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs text-neutral-600 font-medium">Filter by type:</span>
        {["all", "income", "expense"].map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type as "all" | "income" | "expense")}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              typeFilter === type
                ? type === "income"
                  ? "bg-green-100 text-green-700 border-green-300"
                  : type === "expense"
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-indigo-100 text-indigo-700 border-indigo-300"
                : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
            }`}
          >
            {type === "all" ? "All" : type === "income" ? "Income - Thu" : "Expense - Chi"}
          </button>
        ))}
      </div>

      {/* Payer filter chips */}
      {rows.payers.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-neutral-600 font-medium">Filter by payer:</span>
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

      {/* Mobile-first grouped layout */}
      <div className="space-y-4">
        {rows.groupedByDate.map((dayGroup) => (
          <div key={dayGroup.date} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* Day header with totals */}
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-3 py-2 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-indigo-700">
                      {new Date(dayGroup.date.split('/').reverse().join('-')).getDate()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm text-neutral-900">{dayGroup.date}</div>
                    <div className="text-xs text-neutral-500">
                      {dayGroup.transactions.length} giao dịch
                    </div>
                  </div>
                </div>
                <div className={`text-right font-semibold text-sm ${
                  dayGroup.balance >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {dayGroup.balance >= 0 ? '+' : ''}{formatVND(dayGroup.balance)}
                </div>
              </div>
            </div>

                        {/* Transactions for this day */}
            <div className="divide-y divide-neutral-100">
              {dayGroup.transactions.map((t) => (
                <div key={t.id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    {/* Left side - Category and details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-sm text-neutral-900 truncate">
                          {t.categoryChild}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {t.categoryParent}
                        </div>
                      </div>

                      {/* Payer and wallet chips */}
                      <div className="flex items-center gap-1 mb-1">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs border ${
                          (t.payer || "You") === "You"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-neutral-100 text-neutral-700 border-neutral-200"
                        }`}>
                          {t.payer || "You"}
                        </span>
                        {t.wallet && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-purple-50 text-purple-600">
                            <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            {t.wallet}
                          </span>
                        )}
                      </div>

                      {/* Note with hashtags */}
                      {t.note && (
                        <div className="mb-1">
                          {renderNoteWithHashtags(t.note)}
                        </div>
                      )}

                      {/* Badges */}
                      <div className="flex items-center gap-1">
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
                    </div>

                    {/* Right side - Amount */}
                    <div className={`text-right font-semibold text-base ${
                      t.amount < 0 ? "text-red-700" : "text-green-700"
                    }`}>
                      {t.amount < 0 ? "-" : "+"}{formatVND(Math.abs(t.amount))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {rows.groupedByDate.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-lg font-medium mb-2">No transactions found</div>
            <div className="text-sm">Try adjusting your filters or import some data</div>
          </div>
        )}
      </div>
    </section>
  );
}
