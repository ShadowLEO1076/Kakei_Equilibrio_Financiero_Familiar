"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Save, TrendingUp, Loader2 } from "lucide-react";

// Servicios
import { categoryService } from "@/services/category.service";
import { budgetService } from "@/services/budget.service";

export default function BudgetsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [budgetInputs, setBudgetInputs] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadData = async () => {
            const profileId = Cookies.get("activeProfileId");
            if (!profileId) return router.push("/profiles");

            try {
                const [catsData, budgetsData] = await Promise.all([
                    categoryService.getAll(profileId),
                    budgetService.getAllByProfile(profileId)
                ]);

                setCategories(catsData);

                const initialInputs: Record<string, string> = {};
                budgetsData.forEach((b: any) => {
                    initialInputs[b.categoryId] = b.amount.toString();
                });

                setBudgetInputs(initialInputs);

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

        setBudgetInputs(prev => ({
            ...prev,
            [categoryId]: value
        }));
    };

    const totalPlanned = Object.values(budgetInputs).reduce((acc, val) => {
        return acc + (parseFloat(val) || 0);
    }, 0);

    const handleSave = async () => {
        setIsSaving(true);
        const profileId = Cookies.get("activeProfileId");

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

            alert("¡Presupuesto actualizado exitosamente!");
            router.push("/dashboard");

        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
                <p className="mt-4 text-slate-600 dark:text-slate-400">Cargando categorías...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-32">

            {/* HEADER RESPONSIVE */}
            <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 p-6 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                    {/* IZQUIERDA */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Plan Mensual
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Define tus límites de gasto por categoría
                            </p>
                        </div>
                    </div>

                    {/* TOTAL RESPONSIVE */}
                    <div className="text-right bg-teal-50 dark:bg-teal-900/30 px-4 py-3 rounded-2xl border border-teal-100 dark:border-teal-800">
                        <div className="flex items-center gap-2 justify-end">
                            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300 uppercase tracking-wide">
                                Total Asignado
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-teal-700 dark:text-teal-300 block mt-1">
                            ${totalPlanned.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

                {/* ESTADÍSTICAS RESPONSIVE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {categories.filter(cat => budgetInputs[cat.id] && parseFloat(budgetInputs[cat.id]) > 0).length}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Categorías con presupuesto</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {categories.length}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Total categorías</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {categories.filter(cat => cat.type === 'expense').length}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Categorías de gasto</div>
                    </div>
                </div>

                {/* LISTA DE CATEGORÍAS RESPONSIVE */}
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="
                                flex flex-col sm:flex-row sm:items-center
                                gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl 
                                shadow-sm border border-slate-200 dark:border-slate-800 
                                hover:shadow-md transition-all duration-200 
                                hover:border-teal-200 dark:hover:border-teal-800
                                hover:scale-[1.01] active:scale-[0.99]
                            "
                        >
                            {/* ICONO */}
                            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${cat.type === 'expense'
                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                }`}>
                                {cat.icon || (cat.type === 'expense' ? "📊" : "💰")}
                            </div>

                            {/* INFO */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                    {cat.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cat.type === 'expense'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                        }`}>
                                        {cat.type === 'expense' ? 'Gasto' : 'Ingreso'}
                                    </span>

                                    {budgetInputs[cat.id] && parseFloat(budgetInputs[cat.id]) > 0 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                                            Presupuestado
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* INPUT RESPONSIVE */}
                            <div className="w-full sm:w-40">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-3 pl-8 pr-4 text-right font-semibold text-slate-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 outline-none transition-all bg-white dark:bg-slate-800"
                                        value={budgetInputs[cat.id] || ""}
                                        onChange={(e) => handleInputChange(cat.id, e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                {budgetInputs[cat.id] && (
                                    <p className="text-xs text-slate-500 text-right mt-1">
                                        {parseFloat(budgetInputs[cat.id]).toLocaleString('es-ES', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                No hay categorías configuradas
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                Ve a la configuración y crea algunas categorías para comenzar a planificar tu presupuesto.
                            </p>
                        </div>
                    )}
                </div>

            </div>

            {/* BOTÓN GUARDAR RESPONSIVE */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 pt-16 pb-10 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto flex flex-col items-center">
                    <Button
                        className="w-full max-w-sm py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 border-0"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                💾 Guardar Mi Presupuesto
                            </>
                        )}
                    </Button>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
                        {Object.values(budgetInputs).filter(val => parseFloat(val) > 0).length} categorías con presupuesto asignado
                    </p>
                </div>
            </div>

        </div>
    );
}
