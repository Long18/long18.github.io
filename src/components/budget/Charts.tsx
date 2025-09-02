import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatVND } from "@/lib/aggregations";

interface ChartsProps {
  monthlySeries: Array<{
    month: string;
    income: number;
    expense: number;
    balance: number;
  }>;
  pieData: Array<{
    name: string;
    value: number;
  }>;
}

// Contrast-safe colors for accessibility
const COLORS = [
  "#4F46E5", // Indigo - primary
  "#22C55E", // Green - income
  "#EF4444", // Red - expense
  "#06B6D4", // Cyan - balance
  "#A855F7", // Purple
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F43F5E", // Rose
  "#84CC16", // Lime
  "#94A3B8", // Slate
  "#EC4899"  // Pink
];

export default function Charts({ monthlySeries, pieData }: ChartsProps) {
  // Validate data to prevent Recharts infinite loops
  const safeMonthlySeries = Array.isArray(monthlySeries) ? monthlySeries : [];
  const safePieData = Array.isArray(pieData) ? pieData : [];

  // Responsive state for mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Use xl breakpoint (1024px)
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate y-axis domain for fixed scale
  const allValues = safeMonthlySeries.flatMap(d => [d.income, d.expense, d.balance]);
  const maxValue = Math.max(...allValues, 0);
  const minValue = Math.min(...allValues, 0);
  const yAxisDomain = [Math.min(minValue * 1.1, 0), Math.max(maxValue * 1.1, 1000000)];

  // Calculate total for donut center
  const totalExpense = safePieData.reduce((sum, item) => sum + item.value, 0);

  // Responsive donut dimensions
  const outerRadius = isMobile ? 60 : 90;
  const innerRadius = isMobile ? 30 : 50;

  return (
    <section className="space-y-6 mb-6">
      {/* Monthly Income vs Expense vs Balance Chart */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6" aria-label="Monthly income expense balance chart">
        <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Monthly income vs expense vs balance - Thu, Chi, Cân đối theo tháng
        </h2>
        <div className="h-64 sm:h-72 lg:h-80">
          <ResponsiveContainer>
            <LineChart data={safeMonthlySeries} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                domain={yAxisDomain}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(value) => formatVND(value)}
              />
              <Tooltip
                formatter={(v: any) => [formatVND(Number(v)), '']}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                name="Income - Thu"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ r: 4, fill: '#22C55E' }}
                activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expense - Chi"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 4, fill: '#EF4444' }}
                activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Balance - Cân đối"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ r: 4, fill: '#06B6D4' }}
                activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Share Donut Chart */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6" aria-label="Category share donut">
        <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          Category share this month - Tỉ trọng chi theo nhóm (cha)
        </h2>

        {/* Mobile: Stack chart and legend vertically */}
        {isMobile ? (
          <div className="space-y-4">
            {/* Chart container for mobile */}
            <div className="h-48 sm:h-56 relative mx-auto">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={safePieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={60}
                    innerRadius={30}
                    paddingAngle={2}
                  >
                    {safePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => [formatVND(Number(v)), '']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center total display */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatVND(totalExpense)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Total Expense
                  </div>
                </div>
              </div>
            </div>

            {/* Legend for mobile */}
            <div className="grid grid-cols-2 gap-3">
              {safePieData.map((entry, index) => {
                const percentage = totalExpense > 0 ? Math.round((entry.value / totalExpense) * 100) : 0;
                return (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{entry.name}</div>
                      <div className="text-gray-500">
                        {formatVND(entry.value)} ({percentage}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Desktop: Side-by-side layout */
          <div className="flex flex-row items-start gap-6">
            {/* Chart container for desktop */}
            <div className="h-64 w-80 relative flex-shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={safePieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={2}
                  >
                    {safePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => [formatVND(Number(v)), '']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center total display */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatVND(totalExpense)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Total Expense
                  </div>
                </div>
              </div>
            </div>

            {/* Legend for desktop */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 gap-3">
                {safePieData.map((entry, index) => {
                  const percentage = totalExpense > 0 ? Math.round((entry.value / totalExpense) * 100) : 0;
                  return (
                    <div key={entry.name} className="flex items-center gap-3 text-sm">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{entry.name}</div>
                        <div className="text-gray-500">
                          {formatVND(entry.value)} ({percentage}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
