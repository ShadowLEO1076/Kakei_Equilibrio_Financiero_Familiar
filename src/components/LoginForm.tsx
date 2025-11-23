"use client"; // <-- ¡Esencial! Este componente maneja estado.

import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Importamos el Router
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { authService } from "@/services/auth.service"; // 2. Importamos tu servicio

export default function LoginForm() {
  const router = useRouter(); // Hook para navegar

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 3. Estados para Feedback y Carga
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);      // Limpiamos errores previos
    setIsLoading(true);  // Activamos modo carga

    try {
      // A. Llamada al Backend
      console.log("Enviando credenciales...", email);
      await authService.login({ email, password });

      // B. Redirección exitosa a /profiles
      // router.refresh() es útil para que Next.js actualice las cookies en el servidor
      router.refresh();
      router.push("/profiles");

    } catch (err: any) {
      // C. Manejo de Error (Feedback rojo)
      console.error("Error de login:", err);
      setError(err.message || "Correo o contraseña incorrectos");
    } finally {
      setIsLoading(false); // Desbloqueamos el botón siempre
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">

      <h1 className="mb-1 text-center text-2xl font-bold text-slate-900 dark:text-white">
        Iniciar Sesión
      </h1>
      <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Bienvenido de nuevo a Kakei
      </p>

      {/* ZONA DE FEEDBACK: Si hay error, se muestra esto */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200 text-center animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Correo Electrónico
          </label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading} // Bloqueamos si está cargando
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Contraseña
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading} // Bloqueamos si está cargando
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading} // Evita doble clic accidental
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              Entrando...
            </span>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-teal-600 hover:underline dark:text-teal-500">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}