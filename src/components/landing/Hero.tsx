// src/components/landing/Hero.tsx
import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => {
  return (
    // La sección sigue siendo full-width para el color de fondo
    <section className="w-full py-16 md:py-24 dark:bg-slate-900">
      {/* === AJUSTE DE ANCHO === */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* === Columna de Texto === */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Kakei: Tu Asistente Financiero Familiar Inteligente
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Domina tus finanzas personales y familiares en un solo lugar. 
              Visualiza, planifica y ahorra con la ayuda de nuestra IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
              <Link 
                href="/register" 
                className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-600 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Empezar Gratis
              </Link>
              <Link 
                href="#features" 
                className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 shadow-md hover:bg-gray-100 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Conocer Más
              </Link>
            </div>
          </div>

          {/* === Columna de Imagen === */}
          <div className="flex items-center justify-center">
            <Image
              src="/avatars/panda2.png" // ¡Usa la imagen .png sin fondo!
              alt="Familia de pandas gestionando finanzas con Kakei"
              width={450}
              height={350}
              className="rounded-lg" // Ya no necesita sombra si el fondo es transparente
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};