import React from "react";
import BarraBusqueda from "../componentes/BarraBusqueda";
import CuadriculaProductos from "../componentes/CuadriculaProductos";

export default function Catalogo({
  productos,
  busqueda,
  setBusqueda,
  onAgregar,
  temaOscuro,
  loading,
  error,
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
      {loading ? (
        <div className="text-center py-8">
          <p style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}>
            Cargando productos...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p style={{ color: temaOscuro ? "#ef4444" : "#dc2626" }}>
            Error al cargar productos: {error}
          </p>
        </div>
      ) : (
        <CuadriculaProductos
          productos={productos}
          onAgregar={onAgregar}
          temaOscuro={temaOscuro}
        />
      )}
    </div>
  );
}
