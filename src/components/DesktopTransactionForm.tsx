// src/components/DesktopTransactionForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { Input } from "@/components/ui/Input";
// ¡HEMOS QUITADO LA LÍNEA DE IMPORT DE 'Label'!

// Opciones del toggle (las mismas que en móvil)
const transactionTypes = [
  { label: "Gasto", value: "gasto" },
  { label: "Ingreso", value: "ingreso" },
  { label: "Transferencia", value: "transferencia" },
];

type DesktopTransactionFormProps = {
  onClose: () => void; // Función para cerrar el modal
};

export default function DesktopTransactionForm({
  onClose,
}: DesktopTransactionFormProps) {
  const [transactionType, setTransactionType] = useState("gasto");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Guardando desde ESCRITORIO:", {
      type: transactionType,
      amount: parseFloat(amount),
      category,
      note,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4 p-4">
      <SegmentedControl
        options={transactionTypes}
        value={transactionType}
        onChange={setTransactionType}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          {/* --- ¡CORREGIDO! Usamos <label> nativo --- */}
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Monto
          </label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          {/* --- ¡CORREGIDO! Usamos <label> nativo --- */}
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Categoría
          </label>
          <Input
            id="category"
            type="text"
            placeholder="Ej. Comida"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        {/* --- ¡CORREGIDO! Usamos <label> nativo --- */}
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

      <div className="mt-4 flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-slate-800">
        <Button variant="default" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Guardar Transacción
        </Button>
      </div>
    </form>
  );
}