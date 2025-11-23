// src/components/ui/Modal.tsx
"use client"; // Los modales, por definición, son interactivos

import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
}: ModalProps) {
  // Si no está abierto, no renderiza nada
  if (!isOpen) return null;

  return (
    // El contenedor "backdrop" que cubre toda la pantalla
    <div
      onClick={onClose} // Cierra el modal si haces clic fuera
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      {/* El modal en sí */}
      <div
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal lo cierre
        className="w-full max-w-md rounded-xl border border-slate-700 bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        {/* Encabezado del Modal */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* El contenido (el formulario irá aquí) */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}