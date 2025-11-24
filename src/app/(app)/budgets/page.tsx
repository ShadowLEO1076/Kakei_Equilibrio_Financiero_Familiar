"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Save } from "lucide-react";

// Servicios
import { categoryService } from "@/services/category.service";
import { budgetService } from "@/services/budget.service";

export default function BudgetsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Datos
    const [categories, setCategories] = useState<any[]>([]);

    // Estado local para los inputs: { "categoryId": "500", "categoryId2": "200" }
    const [budgetInputs, setBudgetInputs] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadData = async () => {
            const profileId = Cookies.get("activeProfileId");
            if (!profileId) return router.push("/profiles");

            try {
                // 1. Traemos Categorías y Presupuestos en paralelo
                const [catsData, budgetsData] = await Promise.all([
                    categoryService.getAll(profileId),
                    budgetService.getAllByProfile(profileId)
                ]);

                setCategories(catsData);

                // 2. Mapeamos los presupuestos existentes a nuestro estado de inputs
                // budgetsData debería ser un array de objetos { categoryId: "...", amount: 100 }
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

    // Manejar cambios en los inputs
    const handleInputChange = (categoryId: string, value: string) => {
        // Solo permitir números positivos
        if (parseFloat(value) < 0) return;

        setBudgetInputs(prev => ({
            ...prev,
            [categoryId]: value
        }));
    };

    // Calcular Total en Vivo
    const totalPlanned = Object.values(budgetInputs).reduce((acc, val) => {
        return acc + (parseFloat(val) || 0);
    }, 0);

    // Guardar Todo
    const handleSave = async () => {
        setIsSaving(true);
        const profileId = Cookies.get("activeProfileId");

        // Preparamos el array para enviar al backend
        // Solo enviamos los que tienen valor > 0
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
            router.push("/dashboard"); // Volver al dashboard triunfante

        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center" > Cargando categorías... ⏳</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 dark:bg-slate-950" >

            {/* --- HEADER FLOTANTE (Sticky) --- */}
            < div className="sticky top-0 z-10 bg-white/80 p-4 backdrop-blur-md border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-800 flex justify-between items-center shadow-sm" >
                <div className="flex items-center gap-2" >
                    <Button variant="ghost" size="sm" onClick={() => router.back()
                    }>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    < div >
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight" >
                            Plan Mensual
                        </h1>
                        < p className="text-xs text-slate-500" > Define tus límites </p>
                    </div>
                </div>

                {/* TOTALIZADOR */}
                <div className="text-right" >
                    <span className="block text-xs text-slate-500 uppercase font-semibold" > Total Asignado </span>
                    < span className="text-xl font-bold text-teal-600 dark:text-teal-400" >
                        ${totalPlanned.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* --- LISTA DE CATEGORÍAS --- */}
            <div className="max-w-2xl mx-auto p-6 space-y-4" >

                {
                    categories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800" >
                            {/* Icono */}
                            < div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-2xl" >
                                {cat.icon || "🏷️"}
                            </div>

                            {/* Nombre */}
                            < div className="flex-1" >
                                <h3 className="font-medium text-slate-900 dark:text-white" > {cat.name} </h3>
                                < p className="text-xs text-slate-400" > {cat.type === 'expense' ? 'Gasto' : 'Ingreso'} </p>
                            </div>

                            {/* Input de Dinero */}
                            < div className="w-32" >
                                <div className="relative" >
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" > $ </span>
                                    < input
                                        type="number"
                                        placeholder="0"
                                        className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-right font-semibold text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        value={budgetInputs[cat.id] || ""}
                                        onChange={(e) => handleInputChange(cat.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                {
                    categories.length === 0 && (
                        <div className="text-center text-slate-500 py-10" >
                            No hay categorías configuradas.Ve al backend y crea algunas.
                        </div>
                    )
                }

            </div>

            {/* --- BOTÓN GUARDAR FLOTANTE O AL FINAL --- */}
            <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center" >
                <Button
                    className="w-full max-w-md shadow-xl py-6 text-lg"
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Guardando..." : "💾 Guardar Mi Presupuesto"}
                </Button>
            </div>

        </div>
    );
}