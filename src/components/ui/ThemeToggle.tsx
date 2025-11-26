"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evita errores de hidratación (espera a que el cliente cargue)
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-9 h-9" />; // Placeholder invisible para que no salte

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            aria-label="Cambiar tema"
        >
            {/* Icono de Sol (Se muestra en Light, se oculta en Dark) */}
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all text-amber-500 dark:-rotate-90 dark:scale-0" />

            {/* Icono de Luna (Se muestra en Dark, se oculta en Light) */}
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all text-indigo-400 dark:rotate-0 dark:scale-100" />
        </button>
    );
}