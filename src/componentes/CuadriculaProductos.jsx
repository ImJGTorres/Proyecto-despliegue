import TarjetaProducto from "./TarjetaProducto";

export default function CuadriculaProductos({
  productos,
  onAgregar,
  temaOscuro,
}) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-6 items-center justify-center">
      {productos.map((prod) => (
        <TarjetaProducto
          key={prod.id}
          producto={prod}
          onAgregar={onAgregar}
          temaOscuro={temaOscuro}
        />
      ))}
    </div>
  );
}
