"use client";

import { useState } from "react"; // 1. Importamos useState
import { useRouter } from "next/navigation";
import { Settings, Users, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CreateCategoryModal from "@/components/CreateCategoryModal"; // 2. Importamos tu nuevo Modal
import { User } from "lucide-react";

export default function TopHeader() {
    const router = useRouter();

    // 3. Estado para controlar si el modal está abierto o cerrado
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 md:px-6">

                {/* Izquierda: Título */}
                <div className="font-bold text-slate-700 dark:text-white md:hidden">
                    Kakei App
                </div>
                <div className="hidden md:block">
                    {/* Espacio vacío */}
                </div>

                {/* Derecha: Acciones Globales */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/')}
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-teal-400 transition-colors"
                        title="Salir / Inicio"
                    >
                        <LogOut size={20} />
                    </button>

                    {/* User */}
                    <button
                        onClick={() => router.push('/profiles')}
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-teal-400 transition-colors"
                        title="Mi Perfil"
                    >
                        <User size={20} />
                    </button>

                    {/* Botón Salir / Perfil */}


                    {/* Botón Familias */}
                    <button
                        onClick={() => router.push('/families')}
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-teal-400 transition-colors"
                        title="Mis Familias"
                    >
                        <Users size={20} />
                    </button>

                    {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
                    {/* Botón Configuración -> Ahora abre Nueva Categoría */}
                    <button
                        onClick={() => setIsCategoryModalOpen(true)} // 4. Cambiamos router.push por el setter del estado
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                        title="Nueva Categoría"
                    >
                        <Settings size={20} />
                    </button>

                    {/* Separador Vertical */}
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

                    {/* Toggle de Tema */}
                    <ThemeToggle />
                </div>
            </header>

            {/* 5. Renderizamos el Modal fuera del header visualmente, pero dentro del componente */}
            <CreateCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSuccess={() => {
                    // Opcional: Si necesitas recargar algo global cuando se crea una categoría
                    console.log("Categoría creada, modal cerrado.");
                    // window.location.reload(); // Si fueras muy bruto, pero mejor usar contexto en el futuro 😉
                }}
            />
        </>
    );
}