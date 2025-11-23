// src/components/CategoryGrid.tsx
"use client";

import { type LucideIcon, Plus } from "lucide-react"; // Solo importamos Plus
import CategoryIcon from "./ui/CategoryIcon";
import React from "react";

// ¡NUEVO! Definimos el tipo de una categoría
type Category = {
  id: string;
  label: string;
  Icon: LucideIcon;
};

type CategoryGridProps = {
  categories: Category[]; // <-- ¡NUEVO! Recibe las categorías como prop
  selectedCategoryId: string | null;
  onCategorySelect: (id: string) => void;
};

export default function CategoryGrid({
  categories, // <-- ¡NUEVO!
  selectedCategoryId,
  onCategorySelect,
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
      {/* ¡AHORA MAPEAMOS LAS PROPS! */}
      {categories.map((category) => (
        <CategoryIcon
          key={category.id}
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