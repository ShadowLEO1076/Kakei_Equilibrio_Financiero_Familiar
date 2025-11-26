// src/app/(app)/budgets/page.tsx

"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

// Servicios
import { categoryService } from "@/services/category.service";
import { budgetService } from "@/services/budget.service";
import { transactionService } from "@/services/transaction.service"; //  Necesitamos esto

export default function BudgetsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [budgetInputs, setBudgetInputs] = useState<Record<string, string>>({});

    //  Estado para saber cuánto ha gastado realmente en cada categoría
    const [spentByCategory, setSpentByCategory] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadData = async () => {
            const profileId = Cookies.get("activeProfileId");
            if (!profileId) return router.push("/profiles");

            try {
                //  Traemos TODO: Categorías, Presupuestos existentes y GASTOS REALES
                const [catsData, budgetsData, expensesData] = await Promise.all([
                    categoryService.getAll(profileId),
                    budgetService.getAllByProfile(profileId),
                    transactionService.getExpenses(profileId) //  Traer gastos
                ]);

                // 1. Setup Categorías (Filtrar solo gastos para presupuestar)
                const expenseCats = catsData.filter((c: any) => c.type === 'expense');
                setCategories(expenseCats);

                // 2. Setup Inputs (Presupuestos Planificados)
                const initialInputs: Record<string, string> = {};
                budgetsData.forEach((b: any) => {
                    initialInputs[b.categoryId] = b.amount.toString();
                });
                setBudgetInputs(initialInputs);

                // 3.  Setup Gasto Real (Agrupar gastos por categoría)
                const spentMap: Record<string, number> = {};
                expensesData.forEach((tx: any) => {
                    if (!spentMap[tx.categoryId]) spentMap[tx.categoryId] = 0;
                    spentMap[tx.categoryId] += tx.amount;
                });
                setSpentByCategory(spentMap);

            } catch (error) {
                console.error("Error cargando configuración", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [router]);

    const handleInputChange = (categoryId: string, value: string) => {
        if (parseFloat(value) < 0) return;
        setBudgetInputs(prev => ({ ...prev, [categoryId]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const profileId = Cookies.get("activeProfileId");

        // Convertimos inputs a array numérico
        const budgetsToSave = Object.entries(budgetInputs)
            .map(([categoryId, amountStr]) => ({
                categoryId,
                amount: parseFloat(amountStr) || 0
            }))
            .filter(b => b.amount > 0);

        try {
            await budgetService.saveBudgets({
                profileId: profileId!,
                budgets: budgetsToSave
            });
            router.push("/dashboard");
        } catch (error) {
            alert("Hubo un error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    // Cálculo del Total Planificado (Header)
    const totalPlanned = Object.values(budgetInputs).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

    if (isLoading) return <div className="p-10 text-center">Cargando tu plan... </div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-28 dark:bg-slate-950">

            {/* HEADER STICKY */}
            <div className="sticky top-0 z-10 bg-white/80 p-4 backdrop-blur-md border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-800 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Plan Mensual</h1>
                        <p className="text-xs text-slate-500">Define tus límites</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xs text-slate-500 uppercase font-semibold">Total Asignado</span>
                    <span className="text-xl font-bold text-teal-600 dark:text-teal-400">${totalPlanned.toFixed(2)}</span>
                </div>

            </div>


            {/* LISTA DE CATEGORÍAS CON LÓGICA DE SEMÁFORO */}
            <div className="max-w-3xl mx-auto p-4 space-y-4">

                {categories.map((cat) => {
                    const budgetAmount = parseFloat(budgetInputs[cat.id] || "0");
                    const spentAmount = spentByCategory[cat.id] || 0;

                    //  LÓGICA PODEROSA: PORCENTAJE DE USO
                    // Si el presupuesto es 0, y gasté algo, es 100% overflow infinito (o 100%)
                    const percentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : (spentAmount > 0 ? 100 : 0);

                    // Determinar estado
                    let statusColor = "bg-teal-500"; // Verde (Sano)
                    let borderColor = "focus:border-teal-500 border-slate-200";
                    let message = `${(100 - percentage).toFixed(0)}% disponible`;

                    if (percentage >= 80 && percentage < 100) {
                        statusColor = "bg-orange-500"; // Alerta
                        borderColor = "border-orange-300 focus:border-orange-500";
                        message = "¡Cuidado! Te queda poco.";
                    } else if (percentage >= 100) {
                        statusColor = "bg-red-500"; // Crítico
                        borderColor = "border-red-300 focus:border-red-500 bg-red-50";
                        message = `Te has excedido por $${(spentAmount - budgetAmount).toFixed(2)}`;
                    }

                    return (
                        <div key={cat.id} className="relative bg-white p-4 rounded-xl shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800 transition-all">

                            <div className="flex items-center gap-4 mb-2">
                                {/* Icono */}
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50 text-2xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                    {cat.icon || "🏷️"}
                                </div>

                                {/* Info Texto */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                                    <p className="text-xs text-slate-500">
                                        Gastado real: <span className="font-semibold text-slate-700 dark:text-slate-300">${spentAmount.toFixed(2)}</span>
                                    </p>
                                </div>

                                {/* Input de Presupuesto */}
                                <div className="w-36">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className={clsx(
                                                "w-full rounded-lg border py-2 pl-7 pr-3 text-right font-bold text-slate-900 outline-none transition-colors",
                                                "dark:bg-slate-800 dark:text-white",
                                                borderColor // El borde cambia de color según el estado
                                            )}
                                            value={budgetInputs[cat.id] || ""}
                                            onChange={(e) => handleInputChange(cat.id, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* BARRA DE PROGRESO "SECRETA" (Feedback Visual) */}
                            {budgetAmount > 0 && (
                                <div className="mt-3">
                                    <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider mb-1">
                                        <span className={percentage >= 100 ? "text-red-600" : "text-slate-400"}>
                                            {percentage >= 100 ? "Sobregirado" : "Progreso"}
                                        </span>
                                        <span className={percentage >= 100 ? "text-red-600" : "text-teal-600"}>
                                            {message}
                                        </span>
                                    </div>

                                    {/* Riel de la barra */}
                                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className={clsx("h-full rounded-full transition-all duration-500", statusColor)}
                                            style={{ width: `${Math.min(percentage, 100)}%` }} // Tope visual al 100%
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-400">No hay categorías de gastos configuradas.</p>
                    </div>
                )}
            </div>
            <div className="sticky top-0 z-0    flex justify-center items-center shadow-sm" >
                <Button
                    className="w-xs shadow-lg h-12 text-lg"
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Guardando..." : "Guardar Mi Presupuesto"}
                </Button>
            </div>




        </div>
    );
}