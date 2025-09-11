import React, { useState } from "react";

export default function TarjetaProducto({ producto, onAgregar, temaOscuro }) {
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const handleCantidad = (e) =>
    setCantidad(Math.max(1, Number(e.target.value)));
  const handleAgregar = () => {
    onAgregar({ ...producto, cantidad });
    setCantidad(1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  };
  return (
    <div
      className="bg-stone-200 dark:bg-stone-900 border-2 border-stone-400 dark:border-purple-400 rounded-xl shadow-md p-6 mx-auto flex flex-col items-center w-full max-w-xl min-w-[220px] sm:min-w-[320px]"
      style={{
        backgroundColor: temaOscuro ? "#1c1917" : "#e7e5e4",
        borderColor: temaOscuro ? "#a855f7" : "#a8a29e",
      }}
    >
      <h2
        className="text-xl font-bold mb-2"
        style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
      >
        {producto.nombre}
      </h2>
      <p
        className="text-lg mb-4"
        style={{ color: temaOscuro ? "#e9d5ff" : "#374151" }}
      >
        Precio:{" "}
        <span className="font-semibold">
          {producto.precio.toLocaleString("es")}
        </span>
      </p>
      <div className="flex items-center gap-2 mb-4">
        <label
          className="font-medium"
          style={{ color: temaOscuro ? "#a855f7" : "#1d4ed8" }}
        >
          Cantidad:
        </label>
        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={handleCantidad}
          className="w-16 p-1 rounded border text-center"
          style={{
            borderColor: temaOscuro ? "#a855f7" : "#93c5fd",
            backgroundColor: temaOscuro ? "#1c1917" : "white",
            color: temaOscuro ? "#e9d5ff" : "#000000",
          }}
        />
      </div>
      <button
        onClick={handleAgregar}
        className="font-semibold py-2 px-6 rounded-lg border-2 shadow transition text-white"
        style={{
          background: agregado
            ? "#10b981"
            : temaOscuro
            ? "linear-gradient(to right, #7c3aed, #581c87)"
            : "linear-gradient(to right, #2563eb, #3b82f6)",
          borderColor: agregado
            ? "#047857"
            : temaOscuro
            ? "#a855f7"
            : "#1d4ed8",
        }}
        disabled={agregado}
      >
        {agregado ? "¡Agregado!" : "Agregar al Carrito"}
      </button>
    </div>
  );
}
