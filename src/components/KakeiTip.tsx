// src/components/KakeiTip.tsx
import { Lightbulb } from "lucide-react";

export default function KakeiTip() {
  return (
    // ¡Tarjeta especial!
    // Borde izquierdo de color 'teal' para que destaque, como en tu mockup.
    <div className="rounded-xl border-l-4 border-teal-500 bg-teal-50/50 p-6 dark:bg-slate-900 dark:border-teal-400">
      <div className="flex items-center gap-3">
        <Lightbulb className="h-6 w-6 text-teal-600 dark:text-teal-400" />
        <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-200">
          Consejo Kakei
        </h3>
      </div>
      <p className="mt-3 text-sm text-teal-800 dark:text-slate-300">
        Compara precios antes de comprar. En Ecuador, pequeños ahorros suman
        grandes resultados. ¡Pilas!
      </p>
    </div>
  );
}