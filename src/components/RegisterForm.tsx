"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // <-- Hook para redirigir
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { authService } from "@/services/auth.service"; // <-- Importamos el servicio

export default function RegisterForm() {
  const router = useRouter();

  // Estados del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState(""); // Opcional según tu backend

  // Estados de UI
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // 1. Validaciones locales
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden ");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setIsLoading(true); // Activar spinner o deshabilitar botón

      // 2. Llamada al Backend
      await authService.register({
        username: name,
        email,
        password,
        age: age ? parseInt(age) : undefined
      });

      // 3. Éxito -> Redirigir
      // Si tu backend hace login automático al registrar, ve al dashboard.
      // Si no, ve al login. Asumiremos Login por ahora.
      alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
      router.push("/login");

    } catch (err: any) {
      // 4. Manejo de Errores del Backend
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false); // Reactivar botón siempre
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">

      <h1 className="mb-1 text-center text-2xl font-bold text-slate-900 dark:text-white">
        Crea tu cuenta
      </h1>
      <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Empieza a gestionar tus finanzas
      </p>

      {/*  Alerta de Error */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tu Nombre
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Ej. María Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading} // Deshabilitar mientras carga
          />
        </div>

        {/* Campo opcional de Edad si tu backend lo pide */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Edad (Opcional)
          </label>
          <Input
            id="age"
            type="number"
            placeholder="Ej. 25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Correo Electrónico
          </label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Contraseña
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirmar Contraseña
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading} // ¡Vital! Evita doble clic
        >
          {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-teal-600 hover:underline dark:text-teal-500">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}