// src/components/ui/CategoryIcon.tsx
"use client";

import { type LucideIcon } from "lucide-react"; // Importamos el tipo de un icono de Lucide
import clsx from "clsx";

type CategoryIconProps = {
  Icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
};

export default function CategoryIcon({
  Icon,
  label,
  isActive = false,
  onClick,
}: CategoryIconProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1"
    >
      {/* El círculo del icono */}
      <div
        className={clsx(
          "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
          isActive
            ? "bg-teal-600 text-white" // Estilo Activo
            : "bg-gray-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200" // Estilo Inactivo
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      {/* La etiqueta de texto */}
      <span
        className={clsx(
          "text-xs",
          isActive
            ? "font-semibold text-teal-600 dark:text-teal-500" // Estilo Activo
            : "text-slate-600 dark:text-slate-400" // Estilo Inactivo
        )}
      >
        {label}
      </span>
    </button>
  );
}