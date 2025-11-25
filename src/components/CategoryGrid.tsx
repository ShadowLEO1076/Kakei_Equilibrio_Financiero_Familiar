// src/components/CategoryGrid.tsx
"use client";

import { Plus } from "lucide-react";
import CategoryIcon from "./ui/CategoryIcon";
import React from "react";

// CORRECCIÓN SENPAI:
// Cambiamos 'LucideIcon' por 'React.ElementType'.
// Esto permite pasar iconos de Lucide, emojis envueltos en span, SVGs, etc.
type Category = {
  id: string;
  label: string;
  Icon: React.ElementType;
};

type CategoryGridProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (id: string) => void;
};

export default function CategoryGrid({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 md:grid-cols-8">

      {categories.map((category) => (
        <CategoryIcon
          key={category.id}
          // TypeScript ahora estará feliz pasando el emoji aquí
          Icon={category.Icon}
          label={category.label}
          isActive={selectedCategoryId === category.id}
          onClick={() => onCategorySelect(category.id)}
        />
      ))}

      {/* Botón "Custom" o "Añadir" */}
      <CategoryIcon
        Icon={Plus}
        label="Otra"
        isActive={selectedCategoryId === "custom"}
        onClick={() => onCategorySelect("custom")}
      />
    </div>
  );
}