import React, { useState } from "react";
import ItemCarro from "../componentes/ItemCarro";
import CuponDescuento from "../componentes/CuponDescuento";

export default function Pago({
  carrito,
  onSumar,
  onRestar,
  onEliminar,
  cupon,
  onAplicarCupon,
  onComprar,
  temaOscuro,
}) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !direccion || !email) {
      setMensaje("Completa todos los campos");
      return;
    }
    onComprar({ nombre, direccion, email });
    setMensaje("¡Compra realizada con éxito!");
    setNombre("");
    setDireccion("");
    setEmail("");
  };
  // Calcular subtotal
  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // Lógica de cupones
  let descuento = 0;
  let envioGratis = false;
  if (cupon && typeof cupon === "object") {
    if (cupon.tipo === "porcentaje") {
      descuento = Math.round(subtotal * (cupon.valor / 100));
    }
    if (cupon.tipo === "envio") {
      envioGratis = true;
    }
  }
  const total = subtotal - descuento;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
      >
        Carrito de compras
      </h2>
      <ul className="mb-4">
        {carrito.length === 0 ? (
          <p
            style={{ color: temaOscuro ? "#c4b5fd" : "#6b7280" }}
          >
            No hay productos en el carrito.
          </p>
        ) : (
          carrito.map((item, idx) => (
            <ItemCarro
              key={item.id}
              item={item}
              onSumar={() => onSumar(idx)}
              onRestar={() => onRestar(idx)}
              onEliminar={() => onEliminar(idx)}
              mostrarSubtotal
              temaOscuro={temaOscuro}
            />
          ))
        )}
      </ul>
      <div className="mb-2 text-center">
        <span className="font-semibold">Subtotal:</span> $
        {subtotal.toLocaleString("es")}
      </div>
      <CuponDescuento onAplicar={onAplicarCupon} temaOscuro={temaOscuro} />
      {descuento > 0 && (
        <div
          className="mb-2 text-center"
          style={{ color: temaOscuro ? "#86efac" : "#047857" }}
        >
          Cupón aplicado: -${descuento.toLocaleString("es")}
        </div>
      )}
      {envioGratis && (
        <div
          className="mb-2 text-center"
          style={{ color: temaOscuro ? "#93c5fd" : "#1d4ed8" }}
        >
          ¡Envío gratis aplicado!
        </div>
      )}
      <h3
        className="text-lg font-semibold mt-4 text-center"
        style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
      >
        Total a pagar: ${total.toLocaleString("es")}
      </h3>

      {/* Formulario de compra integrado */}
      <form
        className="border-2 rounded-2xl shadow-lg max-w-md mx-auto mt-8 p-8 flex flex-col gap-4"
        style={{
          backgroundColor: temaOscuro ? "#524f57" : "white",
          borderColor: temaOscuro ? "#a855f7" : "#3b82f6",
        }}
        onSubmit={handleSubmit}
      >
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
        >
          Formulario de compra
        </h3>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="p-3 rounded-lg border focus:outline-none transition"
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
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="p-3 rounded-lg border focus:outline-none transition"
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
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-lg border focus:outline-none transition"
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
        <button
          type="submit"
          className="text-white font-semibold py-3 rounded-lg border-2 shadow-md transition"
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
          Comprar
        </button>
        {mensaje && (
          <div className="text-blue-700 dark:text-purple-300 bg-blue-100 dark:bg-[#312e81] rounded-md py-2 px-3 font-medium mt-2 text-center">
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
}
