// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { navLinks } from "@/lib/nav-links"; // <-- ¡Nuestra fuente de verdad!

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // ¡LA CLASE CLAVE!
    // 1. hidden: Oculto por defecto (en móvil)
    // 2. md:flex: Se muestra como flex en escritorio
    // 3. bg-white: Fondo blanco en MODO CLARO
    // 4. dark:bg-slate-900: Fondo oscuro en MODO OSCURO
    // 5. border-r: Borde derecho sutil
    <aside className="hidden border-r border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:flex md:w-64 md:flex-col">
      
      {/* Logo (Respeta light/dark) */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white">
          K
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white">
          Kakei 家計
        </span>
      </div>

      {/* Navegación (Respeta light/dark) */}
      <nav className="flex-1">
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.label} className="mb-2">
                <Link
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-4 py-2 transition-colors",
                    {
                      // Activo (Teal)
                      "bg-teal-100 font-semibold text-teal-700 dark:bg-teal-900 dark:text-teal-100":
                        isActive,
                      // Inactivo (Respeta light/dark)
                      "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800":
                        !isActive,
                    }
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}