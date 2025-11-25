"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 🆕 Para redireccionar
import Cookies from "js-cookie"; // 🆕 Para el profileId
import { Button } from "@/components/ui/Button";
import SegmentedControl from "@/components/ui/SegmentedControl";
import CategoryGrid from "@/components/CategoryGrid";
import { Input } from "@/components/ui/Input";
import Keypad from "@/components/Keypad";
import clsx from "clsx";

// 🆕 SERVICIOS
import { transactionService } from "@/services/transaction.service";
import { categoryService } from "@/services/category.service";

// Tipos
const transactionTypes = [
  { label: "Gasto", value: "gasto" },
  { label: "Ingreso", value: "ingreso" },
  // { label: "Transferencia", value: "transferencia" }, // Deshabilito transferencia por ahora si no tienes backend para eso
];

export default function NewTransactionPage() {
  const router = useRouter();

  // Estados
  const [transactionType, setTransactionType] = useState("gasto");
  const [amountString, setAmountString] = useState("0");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [currentStep, setCurrentStep] = useState("category");

  // 🆕 Estados de Datos Reales
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  // --- 1. CARGAR CATEGORÍAS REALES AL INICIAR ---
  useEffect(() => {
    const loadCategories = async () => {
      const profileId = Cookies.get("activeProfileId");
      if (!profileId) return;

      try {
        const data = await categoryService.getAll(profileId);
        setDbCategories(data);
      } catch (error) {
        console.error("Error cargando categorías", error);
      } finally {
        setIsLoadingCats(false);
      }
    };
    loadCategories();
  }, []);

  // Filtrar categorías según el tab seleccionado
  // Nota: Mapeamos el emoji de la BD a la prop 'Icon' que espera tu CategoryGrid
  // Si tu CategoryGrid espera un componente Lucide, esto podría necesitar ajuste, 
  // pero asumiremos que puede renderizar el emoji si se lo pasamos.
  const currentCategories = dbCategories
    .filter(cat => {
      if (transactionType === "gasto") return cat.type === "expense";
      if (transactionType === "ingreso") return cat.type === "income";
      return false;
    })
    .map(cat => ({
      id: cat.id,
      label: cat.name,
      // Truco: Si CategoryGrid espera un componente Icon, creamos uno falso que renderiza el emoji
      Icon: () => <span className="text-2xl">{cat.icon}</span>
    }));


  // --- LÓGICA DEL TECLADO ---
  const handleKeyClick = (value: string) => {
    if (amountString.length >= 12 && value !== "." && value !== "backspace") return;
    setAmountString((prev) => {
      if (value === ".") {
        if (prev.includes(".")) return prev;
        return prev + ".";
      }
      if (prev === "0" && value !== "0") return value;
      if (prev === "0" && value === "0") return prev;
      return prev + value;
    });
  };

  const handleBackspace = () => {
    setAmountString((prev) => (prev.length === 1 ? "0" : prev.slice(0, -1)));
  };

  // --- 2. GUARDAR REAL (Conectado al Servicio) ---
  const handleSave = async () => {
    const profileId = Cookies.get("activeProfileId");

    // Validaciones
    if (!profileId) return alert("Error de sesión: No hay perfil activo");
    if (!selectedCategoryId) return alert("Por favor selecciona una categoría");
    const amount = parseFloat(amountString);
    if (amount <= 0) return alert("El monto debe ser mayor a 0");

    setIsSaving(true);

    try {
      const commonData = {
        amount: amount,
        description: note || (transactionType === "gasto" ? "Gasto" : "Ingreso"), // Descripción por defecto
        categoryId: selectedCategoryId,
        date: new Date(),
        profileId: profileId,
      };

      if (transactionType === "gasto") {
        await transactionService.createExpense({
          ...commonData,
          paymentMethod: "cash" // Hardcodeado por ahora
        });
      } else if (transactionType === "ingreso") {
        await transactionService.createIncome({
          ...commonData,
          incomeSource: "other" // Hardcodeado por ahora (o salary, etc)
        });
      }

      // Éxito
      router.push("/dashboard");
      router.refresh(); // Refresca los datos del dashboard

    } catch (error: any) {
      console.error(error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handlers de UI ---
  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
    setCurrentStep("amount");
  };

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    setSelectedCategoryId(null);
    setAmountString("0"); // Reseteamos monto al cambiar tipo
    setCurrentStep("category");
  };

  const selectedCategoryLabel = dbCategories.find(c => c.id === selectedCategoryId)?.name;
  const selectedCategoryIcon = dbCategories.find(c => c.id === selectedCategoryId)?.icon;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950">

      {/* HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-900">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          Nueva Transacción
        </h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" disabled={isSaving}>
            <Link href="/dashboard">Cancelar</Link>
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "..." : "Guardar"}
          </Button>
        </div>
      </header>

      {/* CUERPO */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <SegmentedControl
          options={transactionTypes}
          value={transactionType}
          onChange={handleTypeChange}
        />

        {/* PASO 1: CATEGORÍA */}
        {currentStep === "category" && (
          <div className="mb-6 mt-8">
            <h2 className="mb-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              Seleccionar Categoría
            </h2>

            {isLoadingCats ? (
              <div className="text-center py-10 text-slate-400">Cargando categorías...</div>
            ) : currentCategories.length === 0 ? (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-lg">
                No hay categorías de {transactionType} configuradas.
              </div>
            ) : (
              // Asumiendo que tu CategoryGrid puede recibir este array adaptado
              <CategoryGrid
                categories={currentCategories}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={handleCategorySelect}
              />
            )}
          </div>
        )}

        {/* PASO 2: MONTO */}
        {currentStep === "amount" && (
          <>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setCurrentStep("category")}
                className="group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {/* Mostramos el icono seleccionado */}
                <span className="text-2xl">{selectedCategoryIcon}</span>
                <span className="text-xl font-semibold text-slate-900 dark:text-white">
                  {selectedCategoryLabel || "Categoría"}
                </span>
                <span className="text-sm text-slate-500">(Cambiar)</span>
              </button>
            </div>

            <div className="my-4 flex items-center justify-center overflow-hidden whitespace-nowrap">
              <span className="text-3xl font-semibold text-slate-400 dark:text-slate-500 mr-1">$</span>
              <span className={clsx(
                "font-bold text-slate-900 dark:text-white",
                {
                  "text-5xl": amountString.length <= 6,
                  "text-4xl": amountString.length > 6 && amountString.length <= 9,
                  "text-3xl": amountString.length > 9,
                }
              )}>
                {amountString}
              </span>
            </div>

            <div className="mb-6">
              <label htmlFor="note" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nota (Opcional)
              </label>
              <Input
                id="note"
                placeholder="Ej. Café con el equipo"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {/* TECLADO */}
      {currentStep === "amount" && (
        <Keypad onKeyClick={handleKeyClick} onBackspace={handleBackspace} />
      )}
    </div>
  );
}