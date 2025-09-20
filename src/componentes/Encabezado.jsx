import React from "react";

export default function Encabezado({
  temaOscuro,
  onTema,
  onNavegar,
  paginaActual,
  cantidadCarrito,
  rolUsuario,
  onCambiarRol,
}) {
  return (
    <header
      className="flex justify-between items-center py-4 px-6 bg-white dark:bg-[#23143a] border-b-2 border-blue-500 dark:border-purple-400 shadow mb-6"
      style={{
        backgroundColor: temaOscuro ? "#23143a" : "white",
        borderColor: temaOscuro ? "#a855f7" : "#3b82f6",
      }}
    >
      {/* Indicador de rol */}
      <div className="flex items-center gap-2">
        <span
          className="text-sm font-medium px-2 py-1 rounded-full"
          style={{
            backgroundColor:
              rolUsuario === "admin"
                ? temaOscuro
                  ? "#dc2626"
                  : "#fee2e2"
                : temaOscuro
                ? "#2563eb"
                : "#dbeafe",
            color:
              rolUsuario === "admin"
                ? temaOscuro
                  ? "#fca5a5"
                  : "#dc2626"
                : temaOscuro
                ? "#93c5fd"
                : "#2563eb",
          }}
        >
          {rolUsuario === "admin" ? "🔧 Admin" : "👤 Usuario"}
        </span>
      </div>
      <nav className="flex gap-4">
        {/* Siempre mostrar Catálogo */}
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

        {/* Mostrar Carrito solo para usuarios */}
        {rolUsuario === "usuario" && (
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
        )}

        {/* Mostrar opciones de admin solo para administradores */}
        {rolUsuario === "admin" && (
          <>
            <button
              onClick={() => onNavegar("admin")}
              className="font-bold"
              style={{
                color: temaOscuro
                  ? paginaActual === "admin"
                    ? "#c4b5fd"
                    : "#e9d5ff"
                  : paginaActual === "admin"
                  ? "#1d4ed8"
                  : "#374151",
              }}
            >
              Admin
            </button>
            <button
              onClick={() => onNavegar("dashboard")}
              className="font-bold"
              style={{
                color: temaOscuro
                  ? paginaActual === "dashboard"
                    ? "#c4b5fd"
                    : "#e9d5ff"
                  : paginaActual === "dashboard"
                  ? "#1d4ed8"
                  : "#374151",
              }}
            >
              📊 Dashboard
            </button>
          </>
        )}

        {/* Botón para cambiar de rol */}
        <button
          onClick={onCambiarRol}
          className="font-bold px-3 py-1 rounded-lg text-sm"
          style={{
            backgroundColor: temaOscuro ? "#6b7280" : "#e5e7eb",
            color: temaOscuro ? "#e9d5ff" : "#374151",
            border: `1px solid ${temaOscuro ? "#9ca3af" : "#d1d5db"}`,
          }}
        >
          Cambiar Rol
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
