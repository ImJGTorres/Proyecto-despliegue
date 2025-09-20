import React, { useState } from "react";

const CUPONES = {
  DESCUENTO10: {
    tipo: "porcentaje",
    valor: 10,
    descripcion: "10% de descuento en el total",
  },
  ENVIOGRATIS: {
    tipo: "envio",
    descripcion: "¡Envío gratis aplicado!",
  },
  PRIMERACOMPRA: {
    tipo: "porcentaje",
    valor: 15,
    descripcion: "15% de descuento en tu primera compra",
  },
};

export default function CuponDescuento({ onAplicar, temaOscuro }) {
  const [cupon, setCupon] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleAplicar = () => {
    const codigo = cupon.trim().toUpperCase();
    if (CUPONES[codigo]) {
      onAplicar(codigo, CUPONES[codigo]);
      setMensaje(CUPONES[codigo].descripcion);
    } else {
      setMensaje("Cupón inválido");
    }
    setCupon("");
    setTimeout(() => setMensaje(""), 2500);
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2 items-center justify-center">
        <input
          type="text"
          placeholder="Cupón de descuento"
          value={cupon}
          onChange={(e) => setCupon(e.target.value)}
          className="p-2 rounded border"
          style={{
            borderColor: temaOscuro ? "#a855f7" : "#93c5fd",
            backgroundColor: temaOscuro ? "#374151" : "white",
            color: temaOscuro ? "#ffffff" : "#000000",
          }}
        />
        <button
          onClick={handleAplicar}
          className="text-white px-4 py-2 rounded"
          style={{
            backgroundColor: temaOscuro ? "#7c3aed" : "#2563eb",
          }}
        >
          Aplicar
        </button>
      </div>
      {mensaje && (
        <div className="text-blue-700 dark:text-purple-300 bg-blue-100 dark:bg-[#312e81] rounded-md py-1 px-2 font-medium text-center">
          {mensaje}
        </div>
      )}
    </div>
  );
}
