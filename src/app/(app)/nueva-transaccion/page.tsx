// src/app/(app)/nueva-transaccion/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import SegmentedControl from "@/components/ui/SegmentedControl";
import CategoryGrid from "@/components/CategoryGrid";
import { Input } from "@/components/ui/Input";
import Keypad from "@/components/Keypad";
import clsx from "clsx"; // <-- ¡NUEVO! Para las clases dinámicas
import {
  Utensils, Car, Home, Film, Gift, Briefcase, GraduationCap, HeartPulse,
  PiggyBank, LineChart, Landmark,
  DollarSign,
} from "lucide-react";

// --- (Listas de categorías y tipos, sin cambios) ---
const transactionTypes = [
  { label: "Gasto", value: "gasto" },
  { label: "Ingreso", value: "ingreso" },
  { label: "Transferencia", value: "transferencia" },
];
const expenseCategories = [
  { id: "cat_1", label: "Comida", Icon: Utensils },
  { id: "cat_2", label: "Transporte", Icon: Car },
  { id: "cat_3", label: "Hogar", Icon: Home },
  { id: "cat_4", label: "Ocio", Icon: Film },
  { id: "cat_5", label: "Salud", Icon: HeartPulse },
  { id: "cat_6", label: "Educación", Icon: GraduationCap },
  { id: "cat_7", label: "Regalos", Icon: Gift },
  { id: "cat_8", label: "Trabajo", Icon: Briefcase },
];
const incomeCategories = [
  { id: "cat_9", label: "Salario", Icon: Briefcase },
  { id: "cat_10", label: "Regalo", Icon: Gift },
  { id: "cat_11", label: "Freelance", Icon: DollarSign },
];
const transferCategories = [
  { id: "cat_12", label: "Ahorros", Icon: PiggyBank },
  { id: "cat_13", label: "Inversión", Icon: LineChart },
  { id: "cat_14", label: "Entre Cuentas", Icon: Landmark },
];
const allCategories = [
  ...expenseCategories,
  ...incomeCategories,
  ...transferCategories,
];
// --- (Fin de listas) ---

export default function NewTransactionPage() {
  const [transactionType, setTransactionType] = useState("gasto");
  const [amountString, setAmountString] = useState("0");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [currentStep, setCurrentStep] = useState("category");

  // --- (Lógica de Keypad y Save, sin cambios) ---
  const handleKeyClick = (value: string) => {
    // ¡LÍMITE DE LÓGICA! No permitimos más de 12 caracteres (incluido el punto).
    // Esto es un límite razonable para montos monetarios y evitar desbordamiento extremo.
    if (amountString.length >= 12 && value !== "." && value !== "backspace") {
      return; // Ignora la entrada si excede el límite
    }

    setAmountString((prev) => {
      if (value === ".") { 
        if (prev.includes(".")) return prev; // Evita múltiples puntos
        // Si el valor actual es "0" y se presiona ".", convierte a "0."
        return prev + "."; 
      }
      if (prev === "0" && value !== "0") return value; // Reemplaza "0" con el primer dígito (no si es otro "0")
      if (prev === "0" && value === "0") return prev; // Si ya es "0" y se presiona "0", sigue siendo "0"

      return prev + value;
    });
  };

  const handleBackspace = () => {
    setAmountString((prev) => (prev.length === 1 ? "0" : prev.slice(0, -1)));
  };

  const handleSave = () => {
    console.log("Guardando:", {
      type: transactionType,
      amount: parseFloat(amountString),
      category: selectedCategoryId,
      note,
    });
    // Aquí iría la lógica para enviar al backend
  };

  // --- (Handlers del "Wizard", sin cambios) ---
  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
    setCurrentStep("amount");
  };
  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    setSelectedCategoryId(null);
    setCurrentStep("category");
  };

  const selectedCategory = allCategories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <div className="flex h-full flex-col">
      {/* --- 1. CABECERA (BUG DEL BOTÓN CORREGIDO) --- */}
      <header className="flex items-center justify-between p-4">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          Agregar Transacción
        </h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"> 
            <Link href="/dashboard">Cancelar</Link>
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </header>

      {/* --- 2. CUERPO DEL FORMULARIO (Scrollable) --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <SegmentedControl
          options={transactionTypes}
          value={transactionType}
          onChange={handleTypeChange}
        />

        {/* --- PASO 1 (Sin cambios) --- */}
        {currentStep === "category" && (
          <div className="mb-6 mt-8">
            <h2 className="mb-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              Seleccionar Categoría
            </h2>
            {transactionType === "gasto" && ( <CategoryGrid categories={expenseCategories} selectedCategoryId={selectedCategoryId} onCategorySelect={handleCategorySelect} /> )}
            {transactionType === "ingreso" && ( <CategoryGrid categories={incomeCategories} selectedCategoryId={selectedCategoryId} onCategorySelect={handleCategorySelect} /> )}
            {transactionType === "transferencia" && ( <CategoryGrid categories={transferCategories} selectedCategoryId={selectedCategoryId} onCategorySelect={handleCategorySelect} /> )}
          </div>
        )}

        {/* --- PASO 2 (CON EL ARREGLO VISUAL Y CORRECCIÓN DEL BUG DE PARSING) --- */}
        {currentStep === "amount" && (
          <>
            {/* Label de Refuerzo (Sin cambios) */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setCurrentStep("category")}
                className="group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {selectedCategory && ( <selectedCategory.Icon className="h-6 w-6 text-slate-700 dark:text-slate-300" /> )}
                <span className="text-xl font-semibold text-slate-900 dark:text-white">
                  {selectedCategory ? selectedCategory.label : "Seleccionar Categoría"}
                </span>
                <span className="text-sm text-slate-500">(Cambiar)</span>
              </button>
            </div>
            
            {/* =============================================================
            ¡AQUÍ ESTÁ EL ARREGLO DEL NÚMERO GRANDE!
            =============================================================
            */}
            {/* El Contenedor ahora oculta el desbordamiento y no permite el salto de línea */}
            <div className="my-4 flex items-center justify-center overflow-hidden whitespace-nowrap">
              <span className="text-3xl font-semibold text-slate-400 dark:text-slate-500">
                $
              </span>
              
              {/* ¡El Span Mágico! 
                  Usamos clsx para cambiar el tamaño de la fuente
                  basado en la longitud del texto.
              */}
              <span className={clsx(
                "font-bold text-slate-900 dark:text-white",
                {
                  "text-5xl": amountString.length <= 6, // Hasta 6 dígitos: 123.45
                  "text-4xl": amountString.length > 6 && amountString.length <= 9, // Hasta 9 dígitos: 123,456.78
                  "text-3xl": amountString.length > 9, // Más de 9 dígitos: 12,345,678.90
                }
              )}>
                {amountString}
              </span>
            </div>
            {/* ============================================================= */}
            
            {/* Input de Nota (¡BUG CORREGIDO!) */}
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

      {/* --- 3. TECLADO (Condicional, sin cambios) --- */}
      {currentStep === "amount" && (
        <Keypad onKeyClick={handleKeyClick} onBackspace={handleBackspace} />
      )}
    </div>
  );
}