// src/app/(app)/graficos/page.tsx
"use client"

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { transactionService } from "@/services/transaction.service";
import IncomeExpenseChart from "@/components/ui/IncomeExpenseChart_Mateo";


function groupByMonth(expenses: any[], incomes: any[]) {
  const map: any = {};

  const addToMap = (arr: any[], type: "income" | "expense") => {
    arr.forEach(item => {
      const month = new Date(item.date).toLocaleString("default", { month: "short" });
      if (!map[month]) map[month] = { month, income: 0, expense: 0 };
      map[month][type] += item.amount;
    });
  };

  addToMap(incomes, "income");
  addToMap(expenses, "expense");

  return Object.values(map);
}


export default function GraficosPage() {
 const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const profileId = Cookies.get("activeProfileId");
      if (!profileId) return;

      try {
        setLoading(true);

        const [expensesData, incomesData] = await Promise.all([
          transactionService.getExpenses(profileId),
          transactionService.getIncomes(profileId),
        ]);

        const grouped = groupByMonth(expensesData, incomesData);
        setChartData(grouped);

      } catch (error) {
        console.error("Error cargando datos para gráficos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Gráficos y Estadísticas
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Visualiza tus ingresos y gastos de forma clara.
      </p>

      {loading ? (
        <p className="text-slate-500">Cargando gráficos...</p>
      ) : (
        <div className="space-y-10">
          <IncomeExpenseChart data={chartData} />

          {/* Puedes agregar más gráficos aquí */}
          {/* <ExpenseByCategoryChart data={expensesData} /> */}
        </div>
      )}
    </div>
  );
}