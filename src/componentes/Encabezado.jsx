import React from "react";

export default function Encabezado({
  temaOscuro,
  onTema,
  onNavegar,
  paginaActual,
  cantidadCarrito,
}) {
  return (
    <header
      className="flex justify-between items-center py-4 px-6 bg-white dark:bg-[#23143a] border-b-2 border-blue-500 dark:border-purple-400 shadow mb-6"
      style={{
        backgroundColor: temaOscuro ? "#23143a" : "white",
        borderColor: temaOscuro ? "#a855f7" : "#3b82f6",
      }}
    >
      <nav className="flex gap-4">
        <button
          onClick={() => onNavegar("catalogo")}
          className="font-bold"
          style={{
            color: temaOscuro
              ? paginaActual === "catalogo"
                ? "#c4b5fd"
                : "#e9d5ff"
              : paginaActual === "catalogo"
              ? "#1d4ed8"
              : "#374151",
          }}
        >
          Catálogo
        </button>
        <button
          onClick={() => onNavegar("pago")}
          className="font-bold"
          style={{
            color: temaOscuro
              ? paginaActual === "pago"
                ? "#c4b5fd"
                : "#e9d5ff"
              : paginaActual === "pago"
              ? "#1d4ed8"
              : "#374151",
          }}
        >
          Carrito ({cantidadCarrito})
        </button>
      </nav>
      <button
        onClick={onTema}
        className="text-white font-semibold py-2 px-6 rounded-lg border-2 shadow transition"
        style={{
          background: temaOscuro
            ? "linear-gradient(to right, #7c3aed, #581c87)"
            : "linear-gradient(to right, #2563eb, #3b82f6)",
          borderColor: temaOscuro ? "#a855f7" : "#1d4ed8",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = temaOscuro
            ? "linear-gradient(to right, #581c87, #4c1d95)"
            : "linear-gradient(to right, #1d4ed8, #2563eb)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = temaOscuro
            ? "linear-gradient(to right, #7c3aed, #581c87)"
            : "linear-gradient(to right, #2563eb, #3b82f6)";
        }}
      >
        Cambiar a tema {temaOscuro ? "claro" : "oscuro"}
      </button>
    </header>
  );
}
