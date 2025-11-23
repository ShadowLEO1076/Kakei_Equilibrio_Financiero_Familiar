// src/components/landing/Features.tsx
import { Brain, Smartphone, BookOpen } from 'lucide-react';

// ... (El array featureList sigue igual)

const featureList = [
  {
    icon: <Brain size={40} className="text-teal-500" />,
    title: "Asistente Oso Sabio (IA)",
    description: "Deja que nuestra IA analice tus patrones de gasto y te dé consejos prácticos y personalizados para maximizar tus ahorros. ¡Como un senpai financiero!"
  },
  {
    icon: <Smartphone size={40} className="text-teal-500" />,
    title: "Experiencia Móvil PWA",
    description: "Accede a Kakei desde cualquier dispositivo, en cualquier momento. Nuestra PWA es rápida, ligera y funciona incluso sin conexión. Tus finanzas en tu bolsillo."
  },
  {
    icon: <BookOpen size={40} className="text-teal-500" />,
    title: "Filosofía Kakei",
    description: "Inspirada en el método japonés de presupuesto familiar, nuestra app te guía para encontrar el balance perfecto entre tus ingresos, gastos fijos y ahorros."
  }
];

export const Features = () => {
  return (
    // La sección sigue siendo full-width
    <section id="features" className="w-full py-20 bg-gray-50 bg-bamboo-pattern bg-opacity-10 dark:bg-slate-900/50">
      {/* === AJUSTE DE ANCHO === */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Diseñado para el éxito financiero
          </h2>
          {/* Reducimos un poco el max-w del párrafo para que sea aún más legible */}
          <p className="text-lg text-gray-600 dark:text-slate-400 max-w-xl mx-auto">
            Kakei no es solo un rastreador de gastos, es tu socio para construir un futuro financiero sólido.
          </p>
        </div>

        {/* === Grid de Tarjetas === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureList.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100
                         dark:bg-slate-800 dark:border-slate-700
                         transform transition-all duration-300 ease-in-out
                         hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]"
            >
              <div className="mb-6 inline-block p-4 bg-teal-100 rounded-full dark:bg-teal-900/50">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};