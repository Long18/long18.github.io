import React from "react";

interface MonthCalendarProps {
  value: string;
  onChange: (month: string) => void;
  monthsWithData: Set<string>;
}

export default function MonthCalendar({ value, onChange, monthsWithData }: MonthCalendarProps) {
  const [year, month] = value.split("-").map(Number);

  // Extract all years from monthsWithData
  const years = Array.from(monthsWithData)
    .map(monthKey => parseInt(monthKey.split("-")[0]))
    .filter((year, index, arr) => arr.indexOf(year) === index) // Remove duplicates
    .sort((a, b) => a - b); // Sort ascending
  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" }
  ];

  const handleYearChange = (newYear: number) => {
    const newMonth = `${newYear}-${String(month).padStart(2, "0")}`;
    onChange(newMonth);
  };

  const handleMonthChange = (newMonth: number) => {
    const newMonthStr = `${year}-${String(newMonth).padStart(2, "0")}`;
    onChange(newMonthStr);
  };

  return (
    <div className="space-y-3">
      {/* Year Selector */}
      <div>
        <label className="text-xs font-medium text-neutral-600 mb-2 block">Year</label>
        <div className={`grid gap-2 ${
          years.length <= 3 ? 'grid-cols-3' :
          years.length <= 4 ? 'grid-cols-4' :
          years.length <= 6 ? 'grid-cols-3 sm:grid-cols-6' :
          'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6'
        }`}>
          {years.map((y) => {
            const isSelected = y === year;
            return (
              <button
                key={y}
                onClick={() => handleYearChange(y)}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>

      {/* Month Grid */}
      <div>
        <label className="text-xs font-medium text-neutral-600 mb-2 block">Month</label>
        <div className="grid grid-cols-3 gap-2">
          {months.map((m) => {
            const monthKey = `${year}-${String(m.value).padStart(2, "0")}`;
            const hasData = monthsWithData.has(monthKey);
            const isSelected = m.value === month;

            return (
              <button
                key={m.value}
                onClick={() => handleMonthChange(m.value)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : hasData
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Data indicator */}
      {monthsWithData.size > 0 && (
        <div className="text-xs text-neutral-500">
          {monthsWithData.size} month{monthsWithData.size > 1 ? 's' : ''} across {years.length} year{years.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
