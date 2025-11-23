// src/app/(app)/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import KpiCard from "@/components/ui/KpiCard";
import TransactionList from "@/components/TransactionList";
import KakeiTip from "@/components/KakeiTip";
import { Wallet, TrendingUp, TrendingDown, Target, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
// --- ¡NUEVO! Importamos el formulario de ESCRITORIO ---
import DesktopTransactionForm from "@/components/DesktopTransactionForm"; 

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 md:p-8">
      {/* --- (Cabecera y Botón sin cambios) --- */}
      <header className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard Personal
          </h1>
          <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">
            Gestiona tus finanzas de manera inteligente.
          </p>
        </div>
        <div className="hidden md:block">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="-ml-1 h-5 w-5" />
            <span>Nueva Transacción</span>
          </Button>
        </div>
      </header>

      {/* --- (KPIs y Sección Principal sin cambios) --- */}
      {/* ... (Tu código de KpiCards y TransactionList va aquí) ... */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Balance Total"
          amount="$1,387.00"
          percentageChange="+12% vs mes anterior"
          Icon={Wallet}
          iconColor="bg-blue-500"
        />
        <KpiCard
          title="Ingresos"
          amount="$1,550.00"
          percentageChange="+5% vs mes anterior"
          Icon={TrendingUp}
          iconColor="bg-emerald-500"
        />
        <KpiCard
          title="Gastos"
          amount="$163.00"
          percentageChange="-8% vs mes anterior"
          Icon={TrendingDown}
          iconColor="bg-rose-500"
        />
        <KpiCard
          title="Meta de Ahorro"
          amount="89%"
          percentageChange="$310 de $350"
          Icon={Target}
          iconColor="bg-teal-500"
        />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransactionList />
        </div>
        <div className="lg:col-span-1">
          <KakeiTip />
        </div>
      </div>

      {/* --- ¡MODAL ACTUALIZADO! --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Transacción"
      >
        {/* ¡Reemplazamos el placeholder con el formulario real! */}
        <DesktopTransactionForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}