// src/components/ui/ProfileCard.tsx
import React from "react";
import clsx from "clsx";
import Avatar from "@/components/ui/Avatar"; // Tu componente Avatar

type ProfileCardProps = {
  id: string; // Añadido para el manejo de selección
  name: string;
  avatarInitial?: string; // Puedes pasarlo o que Avatar lo genere
  isSelected?: boolean;   // Para indicar si está seleccionado
  onClick: (profileId: string) => void;
};

export default function ProfileCard({
  id,
  name,
  avatarInitial,
  isSelected = false,
  onClick,
}: ProfileCardProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-3 cursor-pointer p-4 rounded-xl",
        "transition-all duration-200 ease-in-out",
        "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700",
        isSelected
          ? "ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-slate-950"
          : "hover:shadow-md"
      )}
      onClick={() => onClick(id)}
    >
      {avatarInitial ? (
        <Avatar name={name} size="md" />
      ) : (
        <Avatar name={name} size="md" /> // Si no hay initial, Avatar lo genera del name
      )}
      <span className="text-lg font-medium text-slate-900 dark:text-white">
        {name}
      </span>
      {/* <span className="text-sm text-slate-500 dark:text-slate-400">{role}</span> */}
    </div>
  );
}