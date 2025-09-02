import React, { useState } from "react";
import { useCapsStore } from "@/lib/storeCaps";
import { PARENT_TO_CHILDREN } from "@/lib/parsing";
import { formatVND, round1000, clamp } from "@/lib/aggregations";

interface BudgetTableProps {
  selectedMonth: string;
  parentCatsByMonth: Record<string, Record<string, number>>;
  subCatsByMonth: Record<string, Record<string, number>>;
}

export default function BudgetTable({ selectedMonth, parentCatsByMonth, subCatsByMonth }: BudgetTableProps) {
  const { capsByMonth, setCap } = useCapsStore();
  const [budgetMode, setBudgetMode] = useState<"view" | "edit">("view");

  const budgetRows = React.useMemo(() => {
    const caps = capsByMonth[selectedMonth] || {};
    return Object.keys(PARENT_TO_CHILDREN).map((parent) => {
      const children = PARENT_TO_CHILDREN[parent] || [];
      const childCaps = children.map((c) => Math.max(0, round1000(caps[c] || 0)));
      const cap = childCaps.reduce((s, v) => s + v, 0);
      const actual = (parentCatsByMonth[selectedMonth] || {})[parent] || 0;
      const ratio = cap > 0 ? actual / cap : 0;
      const over = ratio >= 1;
      const warn = !over && ratio >= 0.8;
      return { key: parent, cap, actual, ratio, over, warn, children, childCaps };
    });
  }, [capsByMonth, parentCatsByMonth, selectedMonth]);

  return (
    <section className="bg-white rounded-2xl shadow p-3 sm:p-4 mb-6" aria-label="Budget versus actual">
      <h2 className="text-sm sm:text-base font-semibold mb-3">Budget vs Actual - Ngân sách và Thực chi</h2>

      <div className="flex flex-wrap items-center gap-2 mb-3 justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xs text-neutral-600">Mode:</div>
          <div className="inline-flex rounded-lg border border-neutral-200 overflow-hidden">
            <button
              className={`px-2 sm:px-3 py-1 text-xs ${budgetMode === "view" ? "bg-neutral-100" : ""}`}
              onClick={() => setBudgetMode("view")}
            >
              View
            </button>
            <button
              className={`px-2 sm:px-3 py-1 text-xs ${budgetMode === "edit" ? "bg-neutral-100" : ""}`}
              onClick={() => setBudgetMode("edit")}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="text-left text-neutral-600">
              <th className="py-2">Category</th>
              <th className="py-2">Budget</th>
              <th className="py-2">Actual</th>
              <th className="py-2">Status</th>
              <th className="py-2 w-[280px] sm:w-[320px]">Bar</th>
            </tr>
          </thead>
          <tbody>
            {budgetRows.map((r) => {
              const pct = r.cap > 0 ? clamp((r.actual / r.cap) * 100, 0, 300) : 0;
              const status = r.over ? "Over" : r.warn ? "Near" : "OK";
              const statusClass = r.over ? "text-red-700" : r.warn ? "text-amber-700" : "text-green-700";

              return (
                <React.Fragment key={r.key}>
                  <tr className="border-t border-neutral-100">
                    <td className="py-2 font-medium">{r.key}</td>
                    <td className="py-2">{formatVND(r.cap)}</td>
                    <td className="py-2">{formatVND(r.actual)}</td>
                    <td className={`py-2 ${statusClass}`}>{status}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden relative" aria-label={`Actual ${pct}% of cap`}>
                          {/* Bullet bar with cap at 300% */}
                          <div
                            className={`h-full ${r.over ? "bg-red-500" : r.warn ? "bg-amber-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min(pct, 300)}%` }}
                          />
                          {/* Cap indicator at 100% */}
                          <div className="absolute top-0 left-1/4 h-full w-px bg-gray-400" />
                          {/* 300% cap indicator */}
                          <div className="absolute top-0 right-0 h-full w-px bg-red-300" />
                        </div>
                        <span className="text-xs text-gray-600 min-w-[3rem] text-right">
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                  {r.children.map((cname, i) => {
                    const actualChild = (subCatsByMonth[selectedMonth] || {})[cname] || 0;
                    const capChild = r.childCaps[i] || 0;
                    const pctChild = capChild > 0 ? clamp((actualChild / capChild) * 100, 0, 300) : 0;
                    const overChild = capChild > 0 && actualChild >= capChild;
                    const warnChild = !overChild && capChild > 0 && actualChild >= 0.8 * capChild;

                    return (
                      <tr key={`${r.key}-${cname}`} className="border-t border-neutral-100">
                        <td className="py-2 pl-6 text-neutral-700">↳ {cname}</td>
                        <td className="py-2">
                          {budgetMode === "edit" ? (
                            <input
                              type="number"
                              inputMode="numeric"
                              className="w-36 rounded-lg border border-neutral-200 px-2 py-1"
                              value={(capsByMonth[selectedMonth]?.[cname] || 0).toString()}
                              onChange={(e) => setCap(selectedMonth, cname, Number(e.target.value || 0))}
                            />
                          ) : (
                            <span>{formatVND(capsByMonth[selectedMonth]?.[cname] || 0)}</span>
                          )}
                        </td>
                        <td className="py-2">{formatVND(actualChild)}</td>
                        <td className={`py-2 ${overChild ? "text-red-700" : warnChild ? "text-amber-700" : "text-green-700"}`}>
                          {overChild ? "Over" : warnChild ? "Near" : "OK"}
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden relative" aria-label={`Actual ${pctChild}% of cap`}>
                              {/* Bullet bar with cap at 300% */}
                              <div
                                className={`h-full ${overChild ? "bg-red-500" : warnChild ? "bg-amber-500" : "bg-green-500"}`}
                                style={{ width: `${Math.min(pctChild, 300)}%` }}
                              />
                              {/* Cap indicator at 100% */}
                              <div className="absolute top-0 left-1/4 h-full w-px bg-gray-400" />
                              {/* 300% cap indicator */}
                              <div className="absolute top-0 right-0 h-full w-px bg-red-300" />
                            </div>
                            <span className="text-xs text-gray-600 min-w-[3rem] text-right">
                              {pctChild.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Budget ở cấp con có thể chỉnh trực tiếp (tự động làm tròn 1.000 VND). Tổng cha = tổng con. Guard-rail cảnh báo theo % thu nhập.
      </p>
    </section>
  );
}
