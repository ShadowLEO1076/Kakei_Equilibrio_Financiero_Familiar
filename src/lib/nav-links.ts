// src/lib/nav-links.ts
import { Home, BarChart3, FileText, User } from "lucide-react";
import { HandCoins } from 'lucide-react';
import { BadgeDollarSign } from 'lucide-react';
import { Settings as settings } from 'lucide-react';

export const navLinks = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: Home, // <-- Icono de Lucide
  },
  {
    href: "/budgets", // <-- ¡RUTA CORRECTA!
    label: "Presupuestos",
    icon: BadgeDollarSign, // <-- Icono de Lucide

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









];

