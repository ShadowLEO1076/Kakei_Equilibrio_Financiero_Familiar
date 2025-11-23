// src/components/CreateFamilyForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type CreateFamilyFormProps = {
    onFormSubmit: (familyName: string) => void;
    onClose: () => void;
};

export default function CreateFamilyForm({
    onFormSubmit,
    onClose,
}: CreateFamilyFormProps) {
    const [familyName, setFamilyName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!familyName.trim()) return;
        onFormSubmit(familyName);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
                <label
                    htmlFor="familyName"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    Nombre de la Familia
                </label>
                <Input
                    id="familyName"
                    type="text"
                    placeholder="Ej. Familia Kakei, Equipo Ahorrador..."
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    required
                />
            </div>

            <div className="mt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={!familyName.trim()}>
                    Crear Familia
                </Button>
            </div>
        </form>
    );
}