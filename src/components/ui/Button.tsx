// src/components/ui/Button.tsx
"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import clsx from "clsx";

// --- Definición de Variantes del Botón ---
const buttonVariants = cva(
  // Estilos base
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      // Diferentes tipos de botones
      variant: {
        default:
          "bg-slate-900 text-white hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        primary:
          "bg-teal-600 text-white hover:bg-teal-600/90 dark:bg-teal-500 dark:hover:bg-teal-500/90",
        destructive:
          "bg-rose-500 text-white hover:bg-rose-500/90 dark:bg-rose-600 dark:hover:bg-rose-600/90",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
      },
      // Diferentes tamaños
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    // Valores por defecto
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// --- Props del Componente ---
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// --- El Componente en sí ---
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Instalación Necesaria ---
// ¡OJO! Esto usa dos pequeñas librerías.
// Detén tu servidor y ejecuta:
// npm install class-variance-authority @radix-ui/react-slot

export { Button, buttonVariants };