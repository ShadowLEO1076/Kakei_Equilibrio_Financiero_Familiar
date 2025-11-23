// src/components/ui/AddProfileCard.tsx
import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline"; // O un icono similar
import clsx from "clsx";

type AddProfileCardProps = {};

export default function AddProfileCard({ }: AddProfileCardProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3 cursor-pointer p-4 rounded-xl",
        "bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600",
        "transition-all duration-200 ease-in-out",
        "hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md",
        "min-h-[140px]" // Para que tenga una altura similar a ProfileCard
      )}
    >
      <div className="h-14 w-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
        <PlusIcon className="h-8 w-8" />
      </div>
      <span className="text-lg font-medium text-slate-900 dark:text-white">
        Añadir Perfil
      </span>
    </div>
  );
}