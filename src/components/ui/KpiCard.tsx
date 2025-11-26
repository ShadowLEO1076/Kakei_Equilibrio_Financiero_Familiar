import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  title: string;
  amount: string;
  percentageChange: string;
  Icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
};

export default function KpiCard({
  title,
  amount,
  Icon,
  percentageChange,
  iconColor = "bg-teal-500",
  onClick,
}: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      // CLASES CLAVE:
      // 1. 'relative': Para poder posicionar el icono con 'absolute' en desktop.
      // 2. 'flex items-center justify-between': En móvil, alinea texto e icono horizontalmente.
      // 3. 'md:block': En desktop, volvemos al comportamiento de bloque normal.
      // 4. 'p-4 md:p-6': Padding más pequeño en móvil (slim), grande en desktop.
      className={`relative flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 md:block md:p-6 ${onClick ? "cursor-pointer hover:shadow-md md:hover:scale-[1.02]" : ""
        }`}
    >
      {/* --- SECCIÓN DE TEXTO --- */}
      <div>
        <span className="text-xs font-medium text-gray-500 dark:text-slate-400 md:text-sm">
          {title}
        </span>

        {/* En móvil el margen es pequeño (mt-1), en desktop respira más (md:mt-4) */}
        <div className="mt-1 md:mt-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white md:text-2xl">
            {amount}
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 md:text-sm">
            {percentageChange}
          </p>
        </div>
      </div>

      {/* --- SECCIÓN DEL ICONO --- */}
      {/* Truco de Senpai:
         - Móvil: Es un bloque flex normal a la derecha.
         - Desktop ('md:absolute'): Se sale del flujo y se pega arriba a la derecha.
      */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconColor} md:absolute md:right-6 md:top-6 md:h-12 md:w-12`}
      >
        <Icon className="h-5 w-5 text-white md:h-6 md:w-6" />
      </div>
    </div>
  );
}