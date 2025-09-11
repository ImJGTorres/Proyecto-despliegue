import React from "react";
import BarraBusqueda from "../componentes/BarraBusqueda";
import CuadriculaProductos from "../componentes/CuadriculaProductos";

export default function Catalogo({
  productos,
  busqueda,
  setBusqueda,
  onAgregar,
  temaOscuro,
}) {
  return (
    <div className="mx-auto mt-8">
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
      >
        Catálogo de Productos
      </h2>
      <BarraBusqueda
        valor={busqueda}
        onChange={setBusqueda}
        temaOscuro={temaOscuro}
      />
      <CuadriculaProductos
        productos={productos}
        onAgregar={onAgregar}
        temaOscuro={temaOscuro}
      />
    </div>
  );
}
