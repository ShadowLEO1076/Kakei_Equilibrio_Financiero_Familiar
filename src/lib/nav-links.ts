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
  {
    href: "/profiles", // <-- ¡RUTA CORRECTA!
    label: "Mi Perfil",
    icon: User, // <-- Icono de Lucide // es un icono de la libreria lucide-react asi como Home, BarChart3, FileText, User
  },
  {
    href: "/profiles", // <-- ¡RUTA CORRECTA!
    label: "Configuracion",
    icon: settings, // <-- Icono de Lucide // es un icono de la libreria lucide-react asi como Home, BarChart3, FileText, User
  },







];

