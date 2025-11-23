// /app/test-api/page.tsx

'use client'; // ¡Súper importante! Para usar useState y useEffect

import { useState, useEffect } from 'react';

// ¡Definimos la "forma" de tu Budget!
// (¡Ajusta esto a los campos reales de tu Budget!)
interface Budget {
  id: string;
  name: string;
  // ...otros campos...
}

export default function TestApiPage() {

  // 1. La "mesa vacía"
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. La "llamada" cuando carga la página
  useEffect(() => {
    const fetchBudgets = async () => {
      
      // ¡Usamos nuestro "número mágico"!
      const apiUrl = process.env.NEXT_PUBLIC_API_URL1; // Asegúrate de que coincide con tu .env.local 

      try {
        console.log(`Llamando a: ${apiUrl}/budgets/all`);

        // ¡¡LA LLAMADA!!
        const response = await fetch(`${apiUrl}/budgets/all`, {
          // ¡Importante para el futuro!CL
          // Le dice al navegador que envíe cookies (para el JWT)
          credentials: 'include', 
        });

        if (!response.ok) {
          // ¡Si el 'Bouncer' (CORS) nos rechaza, esto fallará!
          throw new Error(`¡Error! Estado: ${response.status}`);
        }

        const data: Budget[] = await response.json();

        // 3. ¡La comida llegó!
        setBudgets(data);

      } catch (err: any) {
        console.error("¡Falló el fetch!", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []); // El '[]' significa: "Ejecuta esto solo una vez"


  // --- El Render ---
  if (isLoading) {
    return <div className="p-8">Llamando a la cocina...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">
      <h1 className="font-bold">¡Error al conectar con la API!</h1>
      <p>{error}</p>
      <p className="mt-4">¡Revisa la consola (F12) para ver si es un error de CORS!</p>
    </div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">¡Conexión Exitosa con la API! </h1>
      <h2 className="text-xl">Respuesta de /budgets/all:</h2>
      
      {/* ¡Mostramos los datos como texto! */}
      <pre className="p-4 bg-gray-100 dark:bg-slate-800 rounded mt-4">
        {JSON.stringify(budgets, null, 2)}
      </pre>
    </div>
  );
}