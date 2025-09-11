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

export default function CuponDescuento({ onAplicar }) {
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
          className="p-2 rounded border border-blue-300 dark:border-purple-400 bg-white dark:bg-stone-800 dark:text-purple-900"
        />
        <button
          onClick={handleAplicar}
          className="bg-blue-600 dark:bg-purple-700 text-white px-4 py-2 rounded"
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
