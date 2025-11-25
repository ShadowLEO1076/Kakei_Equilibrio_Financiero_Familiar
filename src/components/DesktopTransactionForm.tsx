// src/components/DesktopTransactionForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/Button";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { Input } from "@/components/ui/Input";
import CategoryGrid from "@/components/CategoryGrid";

//  SERVICIOS
import { transactionService } from "@/services/transaction.service";
import { categoryService } from "@/services/category.service";

// Opciones del toggle
const transactionTypes = [
  { label: "Gasto", value: "gasto" },
  { label: "Ingreso", value: "ingreso" },
];

type DesktopTransactionFormProps = {
  onClose: () => void; // Función para cerrar el modal
};

export default function DesktopTransactionForm({
  onClose,
}: DesktopTransactionFormProps) {
  const router = useRouter();

  // Estados
  const [transactionType, setTransactionType] = useState("gasto");
  const [amount, setAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Estados de datos reales
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
  const currentCategories = dbCategories
    .filter(cat => {
      if (transactionType === "gasto") return cat.type === "expense";
      if (transactionType === "ingreso") return cat.type === "income";
      return false;
    })
    .map(cat => ({
      id: cat.id,
      label: cat.name,
      Icon: () => <span className="text-2xl">{cat.icon}</span>
    }));

  // --- 2. GUARDAR TRANSACCIÓN ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const profileId = Cookies.get("activeProfileId");

    // Validaciones
    if (!profileId) return alert("Error de sesión: No hay perfil activo");
    if (!selectedCategoryId) return alert("Por favor selecciona una categoría");
    const amountNum = parseFloat(amount);
    if (amountNum <= 0 || isNaN(amountNum)) return alert("El monto debe ser mayor a 0");

    setIsSaving(true);

    try {
      const commonData = {
        amount: amountNum,
        description: note || (transactionType === "gasto" ? "Gasto" : "Ingreso"),
        categoryId: selectedCategoryId,
        date: new Date().toISOString(),
        profileId: profileId,
      };

      if (transactionType === "gasto") {
        await transactionService.createExpense({
          ...commonData,
          paymentMethod: "cash"
        });
      } else if (transactionType === "ingreso") {
        await transactionService.createIncome({
          ...commonData,
          incomeSource: "other"
        });
      }

      // Éxito: cerrar modal y refrescar
      onClose();
      router.refresh();

    } catch (error: any) {
      console.error(error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    setSelectedCategoryId(null);
  };

  const selectedCategoryLabel = dbCategories.find(c => c.id === selectedCategoryId)?.name;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4 p-4">
      <SegmentedControl
        options={transactionTypes}
        value={transactionType}
        onChange={handleTypeChange}
      />

      {/* SELECCIÓN DE CATEGORÍA */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Categoría
        </label>
        {isLoadingCats ? (
          <div className="text-center py-4 text-slate-400">Cargando categorías...</div>
        ) : currentCategories.length === 0 ? (
          <div className="text-center py-4 text-slate-400 bg-slate-50 rounded-lg">
            No hay categorías de {transactionType} configuradas.
          </div>
        ) : (
          <CategoryGrid
            categories={currentCategories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
          />
        )}
        {selectedCategoryId && (
          <p className="mt-2 text-sm text-teal-600 dark:text-teal-400">
            Seleccionado: {selectedCategoryLabel}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Monto
          </label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="note"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nota (Opcional)
          </label>
          <Input
            id="note"
            type="text"
            placeholder="Ej. Café con el equipo"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-slate-800">
        <Button variant="default" type="button" onClick={onClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar Transacción"}
        </Button>
      </div>
    </form>
  );
}