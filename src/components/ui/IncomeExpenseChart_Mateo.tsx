"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function IncomeExpenseChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-80 bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
      <h2 className="font-semibold text-lg mb-4 text-slate-800 dark:text-white">
        Ingresos vs Gastos por Mes
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={3}
            name="Ingresos"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            name="Gastos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}