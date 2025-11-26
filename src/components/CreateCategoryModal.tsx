"use client";

import { useState } from "react";
import Cookies from "js-cookie"; // Asumo que usas cookies para auth, si no, bórralo
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
// Asegúrate de importar tu Input. Si es un componente custom, ajústalo aquí.
import { Input } from "@/components/ui/Input";

// --- LISTA DE ICONOS (EMOJIS) ---
// Una selección curada por tu Senpai para ingresos y gastos 💖
const EMOJI_ICONS = [
    "💵", "💸", "💰", "💳", "🏦", "🧾",
    "🍔", "🛒", "🛍️", "🎁", "💊", "🏥",
    "🏠", "💡", "💧", "📞", "💻", "🎮",
    "✈️", "🚕", "🚌", "⛽", "🔧", "🏋️",
    "🎓", "📚", "🐶", "👶", "🎉", "🍷",
    "📈", "📉", "📊", "💹", "💱", "💲",
    "🏧", "🪙", "🧮", "📝", "🪪", "💼",
    "👜", "🏷️", "🔖", "📤", "📥", "🔁",
    "🔄", "⏱️", "⏳", "🤝", "🧑‍💼", "👨‍💼",
    "📬", "📨", "🗂️", "💷", "💶", "💴"
];

interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Para recargar la lista si hace falta
}

export default function CreateCategoryModal({ isOpen, onClose, onSuccess }: CreateCategoryModalProps) {
    // --- ESTADOS DEL FORMULARIO ---
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "💵", // Icono por defecto
        type: "expense" // 'expense' o 'income'
    });

    const [isLoading, setIsLoading] = useState(false);

    // --- MANEJADORES ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIconSelect = (icon: string) => {
        setFormData(prev => ({ ...prev, icon }));
    };

    const handleTypeSelect = (type: "income" | "expense") => {
        setFormData(prev => ({ ...prev, type }));
    };

    // --- EL SUBMIT (POST) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Preparamos los headers (si usas token, agrégalo aquí)
            const token = Cookies.get("token");

            const response = await fetch("http://localhost:3001/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}` // Descomenta si tu back pide token
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error al crear la categoría");
            }

            // 2. Éxito
            console.log("Categoría creada con éxito ✨");
            // Limpiamos form
            setFormData({ name: "", description: "", icon: "💵", type: "expense" });

            if (onSuccess) onSuccess();
            onClose();

        } catch (error) {
            console.error("Oops, algo falló:", error);
            // Aquí podrías poner un toast de error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nueva Categoría"
        >
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* SELECCIÓN DE TIPO (Botones simples tipo Toggle) */}
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                        type="button"
                        onClick={() => handleTypeSelect("expense")}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === "expense"
                            ? "bg-white text-rose-600 shadow-sm dark:bg-slate-700 dark:text-rose-400"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Gasto
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeSelect("income")}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === "income"
                            ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-700 dark:text-emerald-400"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Ingreso
                    </button>
                </div>

                {/* INPUTS DE TEXTO */}
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-slate-500 ml-1">Nombre</label>
                        <Input
                            name="name"
                            placeholder="Ej. Salario, Comida..."
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-500 ml-1">Descripción</label>
                        <Input
                            name="description"
                            placeholder="Breve descripción..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* SELECCIÓN DE ICONO (GRID) */}
                <div>
                    <label className="text-xs font-medium text-slate-500 ml-1 mb-2 block">
                        Elige un icono
                    </label>
                    <div className="grid grid-cols-6 gap-2 h-32 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        {EMOJI_ICONS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleIconSelect(emoji)}
                                className={`text-xl p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${formData.icon === emoji
                                    ? "bg-blue-100 ring-2 ring-blue-500 dark:bg-blue-900/30"
                                    : ""
                                    }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* BOTÓN DE ACCIÓN */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Guardando..." : "Crear Categoría"}
                    </Button>
                </div>

            </form>
        </Modal>
    );
}