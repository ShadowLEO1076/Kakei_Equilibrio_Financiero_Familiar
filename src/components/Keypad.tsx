// src/components/Keypad.tsx
"use client";

import React from "react";
import KeypadKey from "./ui/KeypadKey";
import { Delete } from "lucide-react"; // ¡Icono de Borrar!

type KeypadProps = {
  onKeyClick: (value: string) => void;
  onBackspace: () => void;
};

export default function Keypad({ onKeyClick, onBackspace }: KeypadProps) {
  const handleKey = (value: string) => {
    if (value === "backspace") {
      onBackspace();
    } else {
      onKeyClick(value);
    }
  };

  return (
    // Contenedor del teclado
    <div className="grid grid-cols-3 gap-1 bg-gray-100 p-2 dark:bg-slate-500">
      {/* --- Fila 1 --- */}
      <KeypadKey value="1" keyValue="1" onClick={handleKey} />
      <KeypadKey value="2" keyValue="2" onClick={handleKey} />
      <KeypadKey value="3" keyValue="3" onClick={handleKey} />
      {/* --- Fila 2 --- */}
      <KeypadKey value="4" keyValue="4" onClick={handleKey} />
      <KeypadKey value="5" keyValue="5" onClick={handleKey} />
      <KeypadKey value="6" keyValue="6" onClick={handleKey} />
      {/* --- Fila 3 --- */}
      <KeypadKey value="7" keyValue="7" onClick={handleKey} />
      <KeypadKey value="8" keyValue="8" onClick={handleKey} />
      <KeypadKey value="9" keyValue="9" onClick={handleKey} />
      {/* --- Fila 4 --- */}
      <KeypadKey value="." keyValue="." onClick={handleKey} />
      <KeypadKey value="0" keyValue="0" onClick={handleKey} />
      <KeypadKey
        value={<Delete className="h-6 w-6" />}
        keyValue="backspace"
        onClick={handleKey}
        className="bg-gray-400 dark:bg-slate-600" // Color diferente para "borrar"
      />
    </div>
  );
}