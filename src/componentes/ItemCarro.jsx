import React from "react";

export default function ItemCarro({
  item,
  onSumar,
  onRestar,
  onEliminar,
  mostrarSubtotal,
  temaOscuro,
}) {
  return (
    <li
      className="flex justify-between items-center py-2 border-b last:border-b-0"
      style={{
        borderColor: temaOscuro ? "#7c3aed" : "#dbeafe",
      }}
    >
      <span
        className="font-medium"
        style={{ color: temaOscuro ? "#c4b5fd" : "#1e40af" }}
      >
        {item.nombre}
      </span>
      <span style={{ color: temaOscuro ? "#e9d5ff" : "#374151" }}>
        ${item.precio.toLocaleString("es")}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onRestar}
          className="px-2 py-1 text-lg rounded"
          style={{
            backgroundColor: temaOscuro ? "#7c3aed" : "#d1d5db",
            color: temaOscuro ? "#ffffff" : "#000000",
          }}
        >
          -
        </button>
        <span style={{ color: temaOscuro ? "#e9d5ff" : "#000000" }}>
          {item.cantidad}
        </span>
        <button
          onClick={onSumar}
          className="px-2 py-1 text-lg rounded"
          style={{
            backgroundColor: temaOscuro ? "#7c3aed" : "#d1d5db",
            color: temaOscuro ? "#ffffff" : "#000000",
          }}
        >
          +
        </button>
      </div>
      {mostrarSubtotal && (
        <span
          className="ml-4 font-semibold"
          style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
        >
          Subtotal: ${(item.precio * item.cantidad).toLocaleString("es")}
        </span>
      )}
      <button
        onClick={onEliminar}
        className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded transition"
        title="Eliminar"
      >
        Eliminar
      </button>
    </li>
  );
}
