// src/components/MobileTabBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { navLinks } from "@/lib/nav-links"; // <-- ¡Nuestra fuente de verdad!
import clsx from "clsx";
import { Plus } from "lucide-react"; // <-- ¡Nuevo icono!

export default function MobileTabBar() {
  const pathname = usePathname();

  // Dividimos los enlaces: 2 a la izquierda, 2 a la derecha
  const leftLinks = navLinks.slice(0, 2);
  const rightLinks = navLinks.slice(2, 4);

  return (
    <div className="flex h-16 w-full items-center justify-around">
      {/* --- Enlaces de la Izquierda --- */}
      {leftLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs",
              isActive
                ? "text-teal-600 dark:text-teal-500"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="mt-1">{link.label}</span>
          </Link>
        );
      })}

      {/* --- ¡EL BOTÓN DE ACCIÓN CENTRAL! --- */}
      <div className="flex-1">
        <Link
          href="/nueva-transaccion" // <-- ¡A la nueva página!
          className="group relative -top-4 flex items-center justify-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition-transform group-hover:scale-105 dark:bg-teal-500">
            <Plus className="h-7 w-7" />
          </div>
        </Link>
      </div>

      {/* --- Enlaces de la Derecha --- */}
      {rightLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs",
              isActive
                ? "text-teal-600 dark:text-teal-500"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="mt-1">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}