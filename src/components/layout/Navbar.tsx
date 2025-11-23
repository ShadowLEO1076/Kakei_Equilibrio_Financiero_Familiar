// src/components/layout/Navbar.tsx
import Link from 'next/link';
import { Menu } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-800">
      {/* === AJUSTE DE ANCHO === */}
      <div className="w-full max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* === Logo === */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white font-bold">
            K
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            Kakei  家計 <span className="text-teal-500">🐼</span>
          </span>
        </Link>

        {/* === Nav Links (Desktop) === */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="#features" className="text-gray-600 hover:text-teal-500 dark:text-gray-300 dark:hover:text-teal-300 transition-colors duration-200">
            Características
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-teal-500 dark:text-gray-300 dark:hover:text-teal-300 transition-colors duration-200">
            Precios
          </Link>
          <Link href="#faq" className="text-gray-600 hover:text-teal-500 dark:text-gray-300 dark:hover:text-teal-300 transition-colors duration-200">
            FAQ
          </Link>
        </div>

        {/* === Auth Buttons (Desktop) === */}
        <div className="hidden md:flex gap-3">
          <Link 
            href="/login" 
            className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register" 
            className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-200 hover:shadow-lg"
          >
            Registrarse
          </Link>
        </div>

        {/* === Mobile Menu Button === */}
        <div className="md:hidden">
          <button className="text-gray-700 hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-300">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};