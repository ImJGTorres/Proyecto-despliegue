import React, { useState, useEffect } from "react";
import Encabezado from "./componentes/Encabezado";
import Catalogo from "./paginas/Catalogo";
import Pago from "./paginas/Pago";
import Exito from "./paginas/Exito";
import Admin from "./paginas/Admin";
import Dashboard from "./paginas/Dashboard";
import Inicio from "./paginas/Inicio";
import { crearPedido } from "./servicios/api.js";

export default function App() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [pagina, setPagina] = useState("inicio");
  const [rolUsuario, setRolUsuario] = useState(null); // null, "usuario", "admin"
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cupon, setCupon] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productosLoading, setProductosLoading] = useState(true);
  const [productosError, setProductosError] = useState(null);

  useEffect(() => {
    const html = document.documentElement;
    if (temaOscuro) {
      html.classList.add("dark", "dark-mode");
    } else {
      html.classList.remove("dark", "dark-mode");
    }
  }, [temaOscuro]);

  const fetchProductos = async () => {
    try {
      setProductosLoading(true);
      const response = await fetch("/api/productos");
      if (!response.ok) {
        throw new Error("Error al cargar productos");
      }
      const data = await response.json();
      setProductos(data);
      setProductosError(null);
    } catch (error) {
      setProductosError(error.message);
      console.error("Error fetching productos:", error);
    } finally {
      setProductosLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter(
    (p) =>
      p &&
      p.nombre &&
      typeof p.nombre === "string" &&
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
  const handleComprar = async (datosFormulario) => {
    try {
      // Preparar items del carrito para el pedido
      const items = carrito.map((item) => ({
        id: item.id,
        titulo: item.nombre,
        qty: item.cantidad,
        precio: item.precio,
      }));

      // Enviar pedido al backend
      await crearPedido(datosFormulario.nombre, datosFormulario.email, items);

      // Limpiar carrito y navegar a éxito
      setCarrito([]);
      setPagina("exito");
    } catch (error) {
      console.error("Error al crear pedido:", error);
      alert("Error al procesar el pedido. Inténtalo de nuevo.");
    }
  };
  const handleSeleccionarRol = (rol) => {
    setRolUsuario(rol);
    // Redirigir a la página principal según el rol
    if (rol === "usuario") {
      setPagina("catalogo");
    } else if (rol === "admin") {
      setPagina("admin");
    }
  };

  const handleCambiarRol = () => {
    setRolUsuario(null);
    setPagina("inicio");
    setCarrito([]); // Limpiar carrito al cambiar de rol
  };

  const handleNavegar = (destino) => {
    // Validar navegación según el rol
    if (
      rolUsuario === "usuario" &&
      !["catalogo", "pago", "exito"].includes(destino)
    ) {
      return; // Usuario no puede acceder a admin o dashboard
    }
    if (
      rolUsuario === "admin" &&
      !["admin", "dashboard", "catalogo", "pago", "exito"].includes(destino)
    ) {
      return; // Admin puede acceder a todo
    }
    setPagina(destino);
  };

  // Si no hay rol seleccionado, mostrar pantalla de inicio
  if (!rolUsuario) {
    return (
      <Inicio onSeleccionarRol={handleSeleccionarRol} temaOscuro={temaOscuro} />
    );
  }

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
        rolUsuario={rolUsuario}
        onCambiarRol={handleCambiarRol}
      />
      <div className="max-w-5xl mx-auto py-8 px-4">
        {pagina === "catalogo" && (
          <Catalogo
            productos={productosFiltrados}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            onAgregar={handleAgregar}
            temaOscuro={temaOscuro}
            loading={productosLoading}
            error={productosError}
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
        {pagina === "admin" && (
          <Admin temaOscuro={temaOscuro} onProductosChange={fetchProductos} />
        )}
        {pagina === "dashboard" && <Dashboard temaOscuro={temaOscuro} />}
      </div>
    </div>
  );
}
