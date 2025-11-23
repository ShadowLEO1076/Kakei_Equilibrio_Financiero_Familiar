// src/components/ui/Avatar.tsx
import React from "react";

// --- 1. Definimos nuestra paleta de colores "Apple-like" ---
const pastelColors = [
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
];

type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
};

export default function Avatar({ name, size = "md" }: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const colorIndex = name
    ? name.length % pastelColors.length
    : 0;
  const { bg, text } = pastelColors[colorIndex];

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-14 w-14 text-3xl",
    lg: "h-[120px] w-[120px] text-5xl",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold ${sizeClasses[size]} ${bg} ${text}`}
    >
      {initial}
    </div>
  );
}