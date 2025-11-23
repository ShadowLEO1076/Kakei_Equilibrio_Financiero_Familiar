// src/components/JoinFamilyForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type JoinFamilyFormProps = {
    onFormSubmit: (inviteCode: string) => void;
    onClose: () => void;
};

export default function JoinFamilyForm({
    onFormSubmit,
    onClose,
}: JoinFamilyFormProps) {
    const [inviteCode, setInviteCode] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;
        onFormSubmit(inviteCode);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
                <label
                    htmlFor="inviteCode"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    Código de Invitación
                </label>
                <Input
                    id="inviteCode"
                    type="text"
                    placeholder="Ej. KAKEI-XYZ"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                />
            </div>

            <div className="mt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={!inviteCode.trim()}>
                    Unirse
                </Button>
            </div>
        </form>
    );
}