import React from "react";
import LiveDashboard from "../componentes/LiveDashboard";

export default function Dashboard({ temaOscuro }) {
  return (
    <div
      className="max-w-6xl mx-auto mt-8"
      style={{
        backgroundColor: temaOscuro ? "#191919" : "#f8fafc",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
      >
        📊 Dashboard de Ventas
      </h2>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        style={{
          backgroundColor: temaOscuro ? "#374151" : "#ffffff",
          border: `1px solid ${temaOscuro ? "#6b7280" : "#e5e7eb"}`,
        }}
      >
        <LiveDashboard temaOscuro={temaOscuro} />
      </div>
    </div>
  );
}
