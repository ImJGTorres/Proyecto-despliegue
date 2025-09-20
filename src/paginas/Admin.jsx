import React, { useState, useEffect } from "react";

export default function Admin({ temaOscuro, onProductosChange }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ id: null, nombre: "", precio: "" });
  const [formLoading, setFormLoading] = useState(false);

  const API_BASE = "/api/productos";

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error("Error al cargar productos");
      const data = await response.json();
      setProductos(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.precio) {
      alert("Por favor complete todos los campos");
      return;
    }

    const body = { nombre: form.nombre.trim(), precio: Number(form.precio) };
    if (Number.isNaN(body.precio)) {
      alert("El precio debe ser un número válido");
      return;
    }

    try {
      setFormLoading(true);
      const url = form.id ? `${API_BASE}/${form.id}` : API_BASE;
      const method = form.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Error al guardar producto");

      setForm({ id: null, nombre: "", precio: "" });
      cargarProductos();
      if (onProductosChange) onProductosChange();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const editarProducto = (producto) => {
    setForm({ id: producto.id, nombre: producto.nombre, precio: producto.precio });
  };

  const eliminarProducto = async (id) => {
    if (!confirm("¿Está seguro de que desea eliminar este producto?")) return;

    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar producto");
      cargarProductos();
      if (onProductosChange) onProductosChange();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const cancelarEdicion = () => {
    setForm({ id: null, nombre: "", precio: "" });
  };

  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}
      >
        Panel de Administración - Productos
      </h2>

      {/* Formulario */}
      <div className={`p-6 rounded-lg mb-8 ${temaOscuro ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}>
          {form.id ? "Editar Producto" : "Crear Nuevo Producto"}
        </h3>
        <form onSubmit={manejarSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: temaOscuro ? "#e5e7eb" : "#374151" }}>
              Nombre del Producto
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={`w-full p-2 border rounded-md ${
                temaOscuro ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
              }`}
              placeholder="Ingrese el nombre del producto"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: temaOscuro ? "#e5e7eb" : "#374151" }}>
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              className={`w-full p-2 border rounded-md ${
                temaOscuro ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
              }`}
              placeholder="0.00"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={formLoading}
              className={`px-4 py-2 rounded-md text-white ${
                formLoading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {formLoading ? "Guardando..." : form.id ? "Actualizar" : "Crear"}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Productos */}
      <div className={`p-6 rounded-lg ${temaOscuro ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}>
          Lista de Productos
        </h3>

        {loading ? (
          <p className="text-center py-4" style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}>
            Cargando productos...
          </p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">Error: {error}</p>
        ) : productos.length === 0 ? (
          <p className="text-center py-4" style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}>
            No hay productos registrados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${temaOscuro ? "#374151" : "#e5e7eb"}` }}>
                  <th className="text-left p-2" style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}>ID</th>
                  <th className="text-left p-2" style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}>Nombre</th>
                  <th className="text-left p-2" style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}>Precio</th>
                  <th className="text-left p-2" style={{ color: temaOscuro ? "#c4b5fd" : "#1d4ed8" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id} style={{ borderBottom: `1px solid ${temaOscuro ? "#374151" : "#e5e7eb"}` }}>
                    <td className="p-2" style={{ color: temaOscuro ? "#e5e7eb" : "#374151" }}>{producto.id}</td>
                    <td className="p-2" style={{ color: temaOscuro ? "#e5e7eb" : "#374151" }}>{producto.nombre}</td>
                    <td className="p-2" style={{ color: temaOscuro ? "#e5e7eb" : "#374151" }}>${producto.precio}</td>
                    <td className="p-2">
                      <button
                        onClick={() => editarProducto(producto)}
                        className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}