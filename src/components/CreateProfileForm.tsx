// src/components/CreateProfileForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button"; // <-- ¡RUTA ABSOLUTA!
import { Input } from "@/components/ui/Input";   // <-- ¡RUTA ABSOLUTA!
import Avatar from "@/components/ui/Avatar"; // <-- ¡RUTA ABSOLUTA!

type CreateProfileFormProps = {
  onFormSubmit: (name: string) => void;
  onClose: () => void;
};

export default function CreateProfileForm({
  onFormSubmit,
  onClose,
}: CreateProfileFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onFormSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Avatar name={name} size="md" />
      </div>

      <div>
        <label
          htmlFor="profileName"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Nombre del Perfil
        </label>
        <Input
          id="profileName"
          type="text"
          placeholder="Ej. María, Ahorros, Gremio..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={!name.trim()}>
          Crear Perfil
        </Button>
      </div>
    </form>
  );
}