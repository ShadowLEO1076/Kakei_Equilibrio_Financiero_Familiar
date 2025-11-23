// src/app/(auth)/login/page.tsx
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  // Esta página es un Server Component.
  // Su único trabajo es renderizar el Client Component 'LoginForm'.
  // ¡Esto es una buena práctica!
  return <LoginForm />;
}