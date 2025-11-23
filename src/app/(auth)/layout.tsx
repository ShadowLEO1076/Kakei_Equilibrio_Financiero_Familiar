// src/app/(auth)/layout.tsx
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Nuestro truco de centrado:
    // Fondo base, altura mínima de pantalla, flex y centrado
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-slate-950">
      
      {/* El logo de Kakei irá aquí arriba */}
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-white">
          K
        </div>
        <span className="text-3xl font-bold text-slate-900 dark:text-white">Kakei</span>
      </div>

      {/* Contenedor del formulario, con ancho máximo */}
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}