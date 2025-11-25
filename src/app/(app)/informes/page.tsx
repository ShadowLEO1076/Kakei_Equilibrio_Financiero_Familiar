"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { transactionService } from "@/services/transaction.service";
import MonthYearFilter from "@/components/MonthYearFilter";
import { formatDate } from "@/components/formatDate";
import { generateReportPDF } from "@/components/pdfGenerator";

export default function InformesPage() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<{ month: number | null; year: number | null }>({
  month: null,
  year: null,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const profileId = Cookies.get("activeProfileId");
        if (!profileId) {
          setError("No hay perfil activo seleccionado.");
          setLoading(false);
          return;
        }

        const [exp, inc] = await Promise.all([
          transactionService.getExpenses(profileId),
          transactionService.getIncomes(profileId),
        ]);

        setExpenses(exp);
        setIncomes(inc);
      } catch (err: any) {
        setError(err.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Informes</h1>
        <p className="text-slate-600">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-red-500">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

    function applyFilter(items: any[]) {
    return items.filter(item => {
    const date = new Date(item.date);
    const monthMatch = filter.month ? (date.getMonth() + 1 === filter.month) : true;
    const yearMatch = filter.year ? (date.getFullYear() === filter.year) : true;
    return monthMatch && yearMatch;
    });
    }

  const filteredExpenses = applyFilter(expenses);
  const filteredIncomes = applyFilter(incomes);

  // Totalizadores
  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalIncomes = filteredIncomes.reduce((acc, i) => acc + (i.amount || 0), 0);
  const balance = totalIncomes - totalExpenses;

  return (

    
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Informes del Perfil
      </h1>

      <button
  onClick={() =>
    generateReportPDF({
      expenses: filteredExpenses,
      incomes: filteredIncomes,
      totalExpenses,
      totalIncomes,
      balance,
      monthText:
        filter.month
          ? new Date(2025, filter.month - 1).toLocaleString("es-ES", {
              month: "long",
            })
          : null,
      year: filter.year,
    })
  }
  className="px-4 py-2 mb-6 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Descargar PDF
</button>

      <MonthYearFilter onChange={setFilter} />

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <h2 className="font-semibold text-slate-700 dark:text-slate-300">
            Ingresos Totales
          </h2>
          <p className="text-2xl font-bold text-green-600">
            ${totalIncomes}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <h2 className="font-semibold text-slate-700 dark:text-slate-300">
            Gastos Totales
          </h2>
          <p className="text-2xl font-bold text-red-500">
            ${totalExpenses}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <h2 className="font-semibold text-slate-700 dark:text-slate-300">
            Balance
          </h2>
          <p className={`text-2xl font-bold ${
            balance >= 0 ? "text-green-500" : "text-red-500"
          }`}>
            ${balance}
          </p>
        </div>
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Ingresos */}
        <div>
          <h2 className="text-xl font-bold mb-2">Ingresos</h2>
          <ul className="space-y-2">
            {filteredIncomes.map((inc) => (
              <li key={inc.id} className="p-3 bg-white dark:bg-slate-800 rounded shadow">
                <p className="font-semibold">{inc.description}</p>
                <p className="text-green-600 font-bold">${inc.amount}</p>
                <p className="text-sm text-slate-500">{formatDate(inc.date)}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Gastos */}
        <div>
          <h2 className="text-xl font-bold mb-2">Gastos</h2>
          <ul className="space-y-2">
            {filteredExpenses.map((exp) => (
              <li key={exp.id} className="p-3 bg-white dark:bg-slate-800 rounded shadow">
                <p className="font-semibold">{exp.description}</p>
                <p className="text-red-600 font-bold">${exp.amount}</p>
                <p className="text-sm text-slate-500">{formatDate(exp.date)}</p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}