// src/app/(auth)/register/page.tsx
import RegisterForm from "@/components/RegisterForm"; // <-- ¡NUEVO!

export default function RegisterPage() {
  // Esta página sigue siendo un Server Component.
  // Su único trabajo es renderizar el Client Component 'RegisterForm'.
  return <RegisterForm />;
}