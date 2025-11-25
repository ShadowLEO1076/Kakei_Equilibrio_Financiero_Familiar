"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import KpiCard from "@/components/ui/KpiCard";
import TransactionList from "@/components/TransactionList";
import KakeiTip from "@/components/KakeiTip";
import Modal from "@/components/ui/Modal";
import DesktopTransactionForm from "@/components/DesktopTransactionForm";
// Iconos
import { Wallet, TrendingUp, TrendingDown, Target, Plus } from "lucide-react";

// Servicios
import { transactionService } from "@/services/transaction.service";

export default function DashboardPage() {
  const router = useRouter();

  // Estados de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Datos Financieros
  const [financials, setFinancials] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    savingsRate: 0
  });

  // Estado para las transacciones
  const [transactions, setTransactions] = useState<any[]>([]);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      const profileId = Cookies.get("activeProfileId");

      if (!profileId) {
        // Si no hay perfil, mandamos a seleccionar uno
        router.push("/profiles");
        return;
      }

      try {
        setIsLoading(true);

        // 🚀 LLAMADA PARALELA (Traemos todo junto para velocidad)
        const [expensesData, incomesData] = await Promise.all([
          transactionService.getExpenses(profileId),
          transactionService.getIncomes(profileId)
        ]);

        // CÁLCULOS MATEMÁTICOS (El Cerebro)

        // 1. Sumar Ingresos
        const totalIncome = incomesData.reduce((acc: number, curr: any) => acc + curr.amount, 0);

        // 2. Sumar Gastos
        const totalExpense = expensesData.reduce((acc: number, curr: any) => acc + curr.amount, 0);

        // 3. Balance (Lo que te queda)
        const balance = totalIncome - totalExpense;

        // 4. Tasa de Ahorro (%)
        const savingsRate = totalIncome > 0
          ? ((balance / totalIncome) * 100)
          : 0;

        setFinancials({
          income: totalIncome,
          expense: totalExpense,
          balance: balance,
          savingsRate: savingsRate
        });

        // 5. Combinar y preparar transacciones para el listado
        const expensesWithType = Array.isArray(expensesData)
          ? expensesData.map((e: any) => ({ ...e, type: 'expense' }))
          : [];

        const incomesWithType = Array.isArray(incomesData)
          ? incomesData.map((i: any) => ({ ...i, type: 'income' }))
          : [];

        const allTransactions = [...expensesWithType, ...incomesWithType];

        // 6. Ordenar por fecha (más reciente primero)
        allTransactions.sort((a: any, b: any) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        setTransactions(allTransactions);

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]); // Se ejecuta al montar el componente

  // Función para recargar datos después de guardar un gasto nuevo
  const handleTransactionSuccess = () => {
    setIsModalOpen(false);
    window.location.reload(); // O puedes re-ejecutar el fetchDashboardData si lo extraes fuera del useEffect
  };

  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <header className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">
            {isLoading ? "Sincronizando..." : "Tu resumen financiero en tiempo real."}
          </p>
        </div>
        <div className="hidden md:block">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="-ml-1 h-5 w-5" />
            <span>Nueva Transacción</span>
          </Button>
        </div>
      </header>

      {/* KPI CARDS (DATOS REALES) */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">

        {/* TARJETA 1: PRESUPUESTO (Por ahora placeholder hasta que integres BudgetService) */}
        <KpiCard
          title="Presupuesto"
          amount="Configurar"
          percentageChange="-- de --"
          Icon={Target}
          iconColor="bg-gray-400"
          onClick={() => router.push('/budgets')}
        />

        {/* TARJETA 2: BALANCE TOTAL */}
        <KpiCard
          title="Balance Total"
          amount={isLoading ? "..." : `$${financials.balance.toFixed(2)}`}
          percentageChange="Disponible"
          Icon={Wallet}
          iconColor="bg-blue-500"
        />

        {/* TARJETA 3: INGRESOS */}
        <KpiCard
          title="Ingresos"
          amount={isLoading ? "..." : `$${financials.income.toFixed(2)}`}
          percentageChange="Total mes"
          Icon={TrendingUp}
          iconColor="bg-emerald-500"
        />

        {/* TARJETA 4: GASTOS */}
        <KpiCard
          title="Gastos"
          amount={isLoading ? "..." : `$${financials.expense.toFixed(2)}`}
          percentageChange="Total mes"
          Icon={TrendingDown}
          iconColor="bg-rose-500"
        />

        {/* TARJETA 5: TASA DE AHORRO */}
        <KpiCard
          title="Salud Financiera"
          amount={isLoading ? "..." : `${financials.savingsRate.toFixed(1)}%`}
          percentageChange={financials.savingsRate > 20 ? "¡Vas bien!" : "Cuidado"}
          Icon={Target}
          iconColor={financials.savingsRate > 0 ? "bg-teal-500" : "bg-orange-500"}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransactionList transactions={transactions} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <KakeiTip />
        </div>
      </div>

      {/* MODAL PARA AGREGAR GASTO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Movimiento"
      >
        <DesktopTransactionForm onClose={handleTransactionSuccess} />
      </Modal>
    </div>
  );
}