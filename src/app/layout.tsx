// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

// ¡METADATA ACTUALIZADA!
export const metadata: Metadata = {
  title: "Kakei - Tu App de Finanzas", // Título de la App
  description: "Gestiona tus finanzas familiares con la filosofía Kakei. Simple, elegante, Kakei.",
  manifest: "/manifest.json", // <-- ¡AQUÍ CONECTAMOS EL MANIFEST!
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* --- ¡AÑADIMOS EL <head> MANUALMENTE! --- */}
      {/* Next.js crea un <head> automático, pero necesitamos 
        añadir estas etiquetas específicas para que iOS (Apple) 
        trate nuestra PWA como una app nativa.
      */}
      <head>
        {/* Le dice a los iPhones que esta web-app puede correr a pantalla completa */}
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Define el color de la barra de estado superior en iOS */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* El color de acento para la barra de UI del navegador (nuestro teal) */}
        <meta name="theme-color" content="#0f766e" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>

      {/* Tu <body> original (sin cambios) */}
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}