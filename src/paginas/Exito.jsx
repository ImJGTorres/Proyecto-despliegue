import React from "react";

export default function Exito() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-3xl font-bold text-green-600 mb-4">
        ¡Compra realizada con éxito!
      </h2>
      <p className="text-lg text-gray-700 dark:text-purple-100">
        Gracias por tu compra. Pronto recibirás un correo con los detalles.
      </p>
    </div>
  );
}
