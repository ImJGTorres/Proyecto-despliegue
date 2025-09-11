import React, { useState, useEffect } from "react";
import Encabezado from "./componentes/Encabezado";
import Catalogo from "./paginas/Catalogo";
import Pago from "./paginas/Pago";
import Exito from "./paginas/Exito";
import productosData from "./datos/productos";

export default function App() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [pagina, setPagina] = useState("catalogo");
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cupon, setCupon] = useState(null);

  useEffect(() => {
    const html = document.documentElement;
    if (temaOscuro) {
      html.classList.add("dark", "dark-mode");
    } else {
      html.classList.remove("dark", "dark-mode");
    }
  }, [temaOscuro]);

  const productos = productosData.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAgregar = (producto) => {
    const idx = carrito.findIndex((item) => item.id === producto.id);
    let nuevoCarrito;
    if (idx !== -1) {
      nuevoCarrito = [...carrito];
      nuevoCarrito[idx].cantidad =
        (nuevoCarrito[idx].cantidad || 1) + (producto.cantidad || 1);
    } else {
      nuevoCarrito = [
        ...carrito,
        { ...producto, cantidad: producto.cantidad || 1 },
      ];
    }
    setCarrito(nuevoCarrito);
  };

  const handleSumar = (idx) => {
    setCarrito((prev) => {
      const nuevo = [...prev];
      nuevo[idx].cantidad += 1;
      return nuevo;
    });
  };
  const handleRestar = (idx) => {
    setCarrito((prev) => {
      const nuevo = [...prev];
      if (nuevo[idx].cantidad > 1) {
        nuevo[idx].cantidad -= 1;
        return nuevo;
      } else {
        return nuevo.filter((_, i) => i !== idx);
      }
    });
  };
  const handleEliminar = (idx) => {
    setCarrito((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleAplicarCupon = (codigo, datosCupon) => {
    setCupon(datosCupon ? { ...datosCupon, codigo } : null);
  };
  const handleComprar = () => {
    setCarrito([]);
    setPagina("exito");
  };
  const handleNavegar = (destino) => {
    setPagina(destino);
  };

  return (
    <div
      className={
        (temaOscuro ? "dark " : "") +
        (temaOscuro
          ? "min-h-screen bg-[#191919] text-purple-100"
          : "min-h-screen bg-stone-300 text-purple-900")
      }
    >
      <Encabezado
        temaOscuro={temaOscuro}
        onTema={() => setTemaOscuro((t) => !t)}
        onNavegar={handleNavegar}
        paginaActual={pagina}
        cantidadCarrito={carrito.reduce(
          (acc, item) => acc + (item.cantidad || 1),
          0
        )}
      />
      <div className="max-w-5xl mx-auto py-8 px-4">
        {pagina === "catalogo" && (
          <Catalogo
            productos={productos}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            onAgregar={handleAgregar}
            temaOscuro={temaOscuro}
          />
        )}
        {pagina === "pago" && (
          <Pago
            carrito={carrito}
            onSumar={handleSumar}
            onRestar={handleRestar}
            onEliminar={handleEliminar}
            cupon={cupon}
            onAplicarCupon={handleAplicarCupon}
            onComprar={handleComprar}
            temaOscuro={temaOscuro}
          />
        )}
        {pagina === "exito" && <Exito />}
      </div>
    </div>
  );
}
