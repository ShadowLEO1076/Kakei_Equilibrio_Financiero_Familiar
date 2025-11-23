// src/app/page.tsx
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import LandingFooter from '@/components/LandingFooter'; // ¡Aquí importamos tu footer!

export default function LandingPage() {
  return (
    // ¡Añadimos clases dark mode al main!
    <main className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <Hero />
      <Features />
      
      {/* ¡Y aquí usamos tu footer mejorado! */}
      <LandingFooter />
    </main>
  );
}