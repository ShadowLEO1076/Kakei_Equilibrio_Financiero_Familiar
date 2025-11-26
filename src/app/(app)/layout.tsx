import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileTabBar from "@/components/MobileTabBar";
import TopHeader from "@/components/TopHeader";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">

      {/* Sidebar (Escritorio) */}
      <Sidebar />

      {/* Contenedor Principal (Columna) */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/*  BARRA SUPERIOR (Sticky) */}
        <TopHeader />

        {/* Contenido principal con Scroll */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <MobileTabBar />
      </nav>

    </div>
  );
}