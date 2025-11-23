// src/components/ui/KeypadKey.tsx
"use client";

import React from "react";

type KeypadKeyProps = {
  value: string | React.ReactNode;
  onClick: (value: string) => void;
  className?: string;
  keyValue: string; // El valor real que enviará
};

export default function KeypadKey({
  value,
  onClick,
  className = "",
  keyValue,
}: KeypadKeyProps) {
  
  const handleClick = () => {
    // --- ¡AQUÍ ESTÁ LA MAGIA! ---
    // 1. Comprueba si el navegador (del celular) puede vibrar
    if (navigator.vibrate) {
      // 2. Ejecuta una vibración corta (50ms)
      // ¡Esto es lo que lo hace sentir "premium" y "nativo"!
      navigator.vibrate(50);
    }
    
    // 3. Llama a la función original que viene de Keypad.tsx
    onClick(keyValue);
  };
  
  return (
    <button
      onClick={handleClick} // <-- ¡Ahora llama a nuestra nueva función!
      className={`flex h-13 items-center justify-center rounded-lg bg-gray-300 text-2xl font-medium text-slate-900 transition-colors hover:bg-gray-400 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 ${className}`}
    >
      {value}
    </button>
  );
}