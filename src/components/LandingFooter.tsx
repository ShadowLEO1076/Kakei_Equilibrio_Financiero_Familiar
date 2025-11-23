// src/components/LandingFooter.tsx
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function LandingFooter() {
  return (
    // La sección sigue siendo full-width
    <footer className="w-full border-t border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* === AJUSTE DE ANCHO === */}
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Columna 1: Logo y Redes */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white font-bold">
                K
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Kakei  家計<span className="text-teal-500">🐼</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-gray-500 dark:text-slate-400">
              Tu "Familia Oso" financiera. Cuidamos tu hogar, gasto por gasto.
            </p>
            <ul className="mt-8 flex gap-6">
              <li>
                <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-6 w-6" />
                </a>
              </li>
<li>
                <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 2, 3, 4: Enlaces y Contacto */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Producto</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li><a href="#features" className="text-gray-700 transition hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-300">Características</a></li>
                <li><a href="#about" className="text-gray-700 transition hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-300">Sobre Nosotros</a></li>
                <li><a href="#" className="text-gray-700 transition hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-300">El "Oso Sabio" (IA)</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Compañía</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li><a href="#about" className="text-gray-700 transition hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-300">¿Quiénes somos?</a></li>
                <li><a href="#" className="text-gray-700 transition hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-300">Blog de la Familia</a></li>
                <li><a href="#" className="text-gray-700 transition hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-300">Contacto</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Contacto (Falso)</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li><span className="text-gray-700 dark:text-gray-200">hola@kakei.app</span></li>
                <li><span className="text-gray-700 dark:text-gray-200">+1 (555) 123-4567</span></li>
                <li><span className="text-gray-700 dark:text-gray-200">123 Calle Ficticia, Bosque Oso</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500 dark:text-slate-400">
          &copy; 2025 Kakei (Guillermo Calvache & Mateo Vázquez). Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}