// src/lib/nav-links.ts
import { Home, BarChart3, FileText, User } from "lucide-react";

export const navLinks = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: Home, // <-- Icono de Lucide
  },
  {
    href: "/graficos", // <-- ¡RUTA CORRECTA!
    label: "Gráficos",
    icon: BarChart3, // <-- Icono de Lucide
  },
  {
    href: "/informes", // <-- ¡RUTA CORRECTA!
    label: "Informes",
    icon: FileText, // <-- Icono de Lucide
  },
  {
    href: "/perfil", // <-- ¡RUTA CORRECTA!
    label: "Mi Perfil",
    icon: User, // <-- Icono de Lucide
  },
];