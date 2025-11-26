"use client";

import { useState } from "react";

interface Props {
  onChange: (filter: { month: number | null; year: number | null }) => void;
}

export default function MonthYearFilter({ onChange }: Props) {
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const years = Array.from({ length: 6 }, (_, i) => currentYear - i); 
  // Últimos 6 años para analizar, ¿añadir más?

  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setMonth(value);
    onChange({ month: value, year });
  }

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setYear(value);
    onChange({ month, year: value });
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-md shadow">
      
      {/* Filtrar Mes */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">
          Mes
        </label>
        <select
          value={month ?? ""}
          onChange={handleMonthChange}
          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
        >
          <option value="">Todos</option>
          {months.map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Filtrar Año */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">
          Año
        </label>
        <select
          value={year ?? ""}
          onChange={handleYearChange}
          className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
        >
          <option value="">Todos</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
