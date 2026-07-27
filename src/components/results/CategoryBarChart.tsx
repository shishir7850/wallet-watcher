"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency, getCategoryColor } from "@/lib/formatters";

interface CategoryBarChartProps {
  byCategory: Record<string, number>;
}

export default function CategoryBarChart({ byCategory }: CategoryBarChartProps) {
  const data = Object.entries(byCategory)
    .filter(([, value]) => value < 0)
    .map(([name, value]) => ({ name, value: Math.abs(value) }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={data.length * 40 + 40}>
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatCurrency(v)}
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            fontSize={12}
          />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
