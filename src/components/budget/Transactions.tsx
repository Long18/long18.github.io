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

  const rows = useMemo(() => {
    const monthFiltered = transactions.filter((t) => getMonthKey(t.date) === selectedMonth);
    const cats = Array.from(new Set(monthFiltered.map((t) => t.categoryChild))).sort();
    const filtered = monthFiltered.filter((t) => {
      const q = query.trim().toLowerCase();
      const matchQ = q ? t.note?.toLowerCase().includes(q) || t.categoryChild.toLowerCase().includes(q) : true;
      const matchCat = cat ? t.categoryChild === cat : true;
      return matchQ && matchCat;
    });
    return { cats, filtered };
  }, [transactions, query, cat, selectedMonth]);

  const totalExpense = rows.filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = rows.filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

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
              <th className="py-2">Amount - Số tiền</th>
              <th className="py-2">Note - Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {rows.filtered.map((t) => (
              <tr key={t.id} className="border-t border-neutral-100">
                <td className="py-1">{t.rawDate}</td>
                <td className="py-1">{t.categoryChild}</td>
                <td className={`py-1 ${t.amount < 0 ? "text-red-700" : "text-green-700"}`}>
                  {formatVND(Math.abs(t.amount))}
                </td>
                <td className="py-1">{t.note || ""}</td>
              </tr>
            ))}
            {rows.filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-neutral-500">
                  No transactions for this filter - Không có giao dịch phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
