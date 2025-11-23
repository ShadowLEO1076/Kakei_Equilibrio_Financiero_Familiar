// src/components/ui/SegmentedControl.tsx
"use client";

import clsx from "clsx";
import React from "react";

// Definimos los tipos de props que aceptará
type Option = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  options: Option[];
  value: string; // El valor actualmente seleccionado
  onChange: (value: string) => void; // Función para cambiar el valor
};

export default function SegmentedControl({
  options,
  value,
  onChange,
}: SegmentedControlProps) {
  return (
    // El contenedor principal, con un fondo grisáceo
    <div className="flex w-full items-center rounded-lg bg-gray-200 p-1 dark:bg-slate-700">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            // Estilos base para todos los botones
            "flex-1 rounded-md px-3 py-1.5 text-center text-sm font-semibold transition-colors",
            {
              // Estilos si está ACTIVO
              "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white":
                value === option.value,
              // Estilos si está INACTIVO
              "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white":
                value !== option.value,
            }
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}