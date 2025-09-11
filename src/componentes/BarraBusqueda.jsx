import React from "react";

export default function BarraBusqueda({ valor, onChange, temaOscuro }) {
  return (
    <div className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-md p-3 rounded-lg border focus:outline-none transition"
        style={{
          borderColor: temaOscuro ? "#a855f7" : "#93c5fd",
          backgroundColor: temaOscuro ? "#524f57" : "white",
          color: temaOscuro ? "#e9d5ff" : "#1f2937",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = temaOscuro ? "#c4b5fd" : "#3b82f6";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = temaOscuro ? "#a855f7" : "#93c5fd";
        }}
      />
    </div>
  );
}
