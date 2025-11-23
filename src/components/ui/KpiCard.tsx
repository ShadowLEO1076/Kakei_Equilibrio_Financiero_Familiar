// src/components/ui/KpiCard.tsx
import type { LucideIcon } from "lucide-react";

// Definimos las 'props' que nuestro componente aceptará
type KpiCardProps = {
  title: string;
  amount: string;
  percentageChange: string;
  Icon: LucideIcon; // ¡Podemos pasar un componente de icono como prop!
  iconColor?: string; // Color opcional para el icono
};

export default function KpiCard({
  title,
  amount,
  Icon,
  percentageChange,
  iconColor = "bg-teal-500", // Color por defecto
}: KpiCardProps) {
  return (
    // La tarjeta base: fíjate en el padding (p-6), bordes (rounded-xl) y la sombra sutil
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconColor}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
          {amount}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          {percentageChange}
        </p>
      </div>
    </div>
  );
}