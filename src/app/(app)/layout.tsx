// src/app/(app)/layout.tsx
import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileTabBar from "@/components/MobileTabBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      
      {/* Llama al Sidebar (él mismo se ocultará/mostrará) */}
      <Sidebar />

      {/* Contenido principal con padding inferior SÓLO en móvil */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Llama al MobileTabBar (se ocultará solo en escritorio) */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 flex border-t border-gray-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <MobileTabBar />
      </nav>
    </div>
  );
}