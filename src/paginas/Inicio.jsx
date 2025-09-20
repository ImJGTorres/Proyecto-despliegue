import React from "react";

export default function Inicio({ onSeleccionarRol, temaOscuro }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: temaOscuro
          ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="max-w-md w-full mx-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
          style={{
            backgroundColor: temaOscuro ? "#374151" : "white",
            border: `2px solid ${temaOscuro ? "#6b7280" : "#e5e7eb"}`,
          }}
        >
          <div className="mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
            >
              🛍️ Mini Tienda
            </h1>
            <p
              className="text-lg"
              style={{ color: temaOscuro ? "#9ca3af" : "#6b7280" }}
            >
              Selecciona cómo quieres acceder
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => onSeleccionarRol("usuario")}
              className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{
                background: temaOscuro
                  ? "linear-gradient(135deg, #7c3aed 0%, #581c87 100%)"
                  : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                border: `2px solid ${temaOscuro ? "#a855f7" : "#1d4ed8"}`,
              }}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">👤</span>
                <div className="text-left">
                  <div className="font-bold">Modo Usuario</div>
                  <div className="text-sm opacity-90">Comprar productos</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => onSeleccionarRol("admin")}
              className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{
                background: temaOscuro
                  ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
                  : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                border: `2px solid ${temaOscuro ? "#ef4444" : "#dc2626"}`,
              }}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">⚙️</span>
                <div className="text-left">
                  <div className="font-bold">Modo Administrador</div>
                  <div className="text-sm opacity-90">Gestionar tienda</div>
                </div>
              </div>
            </button>
          </div>

          <div
            className="mt-8 pt-6 border-t"
            style={{ borderColor: temaOscuro ? "#6b7280" : "#e5e7eb" }}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div
                  className="font-semibold mb-1"
                  style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
                >
                  Usuario
                </div>
                <div style={{ color: temaOscuro ? "#9ca3af" : "#6b7280" }}>
                  • Ver catálogo
                  <br />
                  • Agregar al carrito
                  <br />• Realizar compras
                </div>
              </div>
              <div className="text-center">
                <div
                  className="font-semibold mb-1"
                  style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
                >
                  Admin
                </div>
                <div style={{ color: temaOscuro ? "#9ca3af" : "#6b7280" }}>
                  • Gestionar productos
                  <br />
                  • Ver dashboard
                  <br />• Analizar ventas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
