import React, { useState } from "react";

interface MonthPickerProps {
  value: string;
  onChange: (m: string) => void;
  monthsAvailable: Set<string>;
}

export default function MonthPicker({ value, onChange, monthsAvailable }: MonthPickerProps) {
  const [year, setYear] = useState<number>(() => {
    const y = parseInt(value.split("-")[0], 10);
    return isNaN(y) ? new Date().getFullYear() : y;
  });

  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mk = (y: number, m: number) => `${y}-${String(m + 1).padStart(2, "0")}`;
  const isSelected = (y: number, m: number) => value === mk(y, m);
  const hasData = (y: number, m: number) => monthsAvailable.has(mk(y, m));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button
          className="px-1 sm:px-2 py-1 rounded-lg border border-neutral-200 text-sm sm:text-base"
          onClick={() => setYear((y) => y - 1)}
          aria-label="Prev year"
        >
          ‹
        </button>
        <div className="font-medium text-sm sm:text-base">{year}</div>
        <button
          className="px-1 sm:px-2 py-1 rounded-lg border border-neutral-200 text-sm sm:text-base"
          onClick={() => setYear((y) => y + 1)}
          aria-label="Next year"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {Array.from({ length: 12 }, (_, i) => {
          const key = mk(year, i);
          const selected = isSelected(year, i);
          const available = hasData(year, i);
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`h-7 sm:h-9 rounded-lg sm:rounded-xl border text-xs sm:text-sm transition-colors
                ${selected ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-neutral-200 bg-white text-neutral-800"}
                ${!available ? "opacity-50" : ""}`}
              title={available ? "Has data" : "No data"}
            >
              {monthLabels[i]}
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-neutral-500">
        • Dim = no data imported for that month (có thể vẫn chọn). / Màu mờ = chưa có dữ liệu nhập.
      </div>
    </div>
  );
}
