import { useEffect, useMemo, useState } from "react";
import { ventasTop, ventasSerie, seed } from "../servicios/api.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const API_BASE = import.meta.env?.VITE_API_URL || "http://127.0.0.1:5000/api";

export default function LiveDashboard({
  days = 30,
  initialMetric = "cantidad",
  limit = 6,
  top = 5,
  fallbackMs = 15000,
  temaOscuro = false,
}) {
  const [metric, setMetric] = useState(initialMetric);
  const [topData, setTopData] = useState([]);
  const [serie, setSerie] = useState({ labels: [], series: [] });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function cargar() {
    try {
      setLoading(true);
      const [t, s] = await Promise.all([
        ventasTop(days, metric, limit),
        ventasSerie(days, metric, top),
      ]);
      setTopData(Array.isArray(t) ? t : []);
      setSerie(s?.labels ? s : { labels: [], series: [] });
      setErr("");
    } catch (e) {
      setErr(e.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    cargar();
  }, [days, metric, limit, top]);

  useEffect(() => {
    let es;
    let id = setInterval(cargar, fallbackMs);
    try {
      es = new EventSource(`${API_BASE}/ventas-sse`);
      es.onmessage = () => cargar();
    } catch (e) {
      // EventSource no soportado o error de conexión
      console.warn("EventSource no disponible:", e);
    }
    return () => {
      clearInterval(id);
      if (es && es.close) es.close();
    };
  }, [fallbackMs, days, metric, limit, top]);

  const barData = useMemo(() => {
    const sorted = [...topData].sort(
      (a, b) => (b[metric] || 0) - (a[metric] || 0)
    );
    return sorted.map((r) => ({
      titulo: r.titulo,
      valor: Number(r[metric] || 0),
    }));
  }, [topData, metric]);

  const lineData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < (serie.labels?.length || 0); i++) {
      const row = { fecha: serie.labels[i] };
      for (const s of serie.series || []) row[s.titulo] = s.data[i] || 0;
      arr.push(row);
    }
    return arr;
  }, [serie]);

  const fmt = (n) => new Intl.NumberFormat("es-CO").format(n);

  // Paleta de colores para las líneas
  const coloresProductos = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#87ceeb",
    "#dda0dd",
    "#98fb98",
  ];

  // Estilos según el tema
  const estilosTema = {
    contenedor: {
      backgroundColor: temaOscuro ? "#374151" : "#ffffff",
      color: temaOscuro ? "#e9d5ff" : "#1f2937",
      borderColor: temaOscuro ? "#6b7280" : "#ddd",
    },
    texto: {
      color: temaOscuro ? "#e9d5ff" : "#1f2937",
    },
    borde: {
      borderColor: temaOscuro ? "#6b7280" : "#ddd",
    },
    etiqueta: {
      backgroundColor: temaOscuro ? "#4b5563" : "#eee",
      color: temaOscuro ? "#e9d5ff" : "#374151",
    },
    select: {
      backgroundColor: temaOscuro ? "#4b5563" : "#ffffff",
      color: temaOscuro ? "#e9d5ff" : "#1f2937",
      borderColor: temaOscuro ? "#6b7280" : "#ddd",
    },
    boton: {
      background: temaOscuro ? "#dc2626" : "#e11d48",
    },
  };

  async function handleSeed() {
    setMsg("");
    try {
      const r = await seed();
      setMsg(r?.msg || "Datos generados");
      await cargar();
    } catch (e) {
      setMsg(e.message || "Error al sembrar");
    }
  }

  return (
    <section
      style={{
        display: "grid",
        gap: 16,
        marginTop: 16,
        ...estilosTema.contenedor,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0, ...estilosTema.texto }}>Ventas</h3>
        <label style={estilosTema.texto}>últimos {days} días</label>
        <label style={{ marginLeft: "auto", ...estilosTema.texto }}>
          Métrica:&nbsp;
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            style={estilosTema.select}
          >
            <option value="cantidad">Cantidad</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </label>
        <button
          onClick={handleSeed}
          style={{
            ...estilosTema.boton,
            color: "#fff",
            border: "none",
            padding: "6px 10px",
            borderRadius: 6,
          }}
        >
          Sembrar datos
        </button>
        {loading && (
          <small style={{ opacity: 0.6, ...estilosTema.texto }}>
            Actualizando…
          </small>
        )}
        {err && <small style={{ color: "crimson" }}>{err}</small>}
        {msg && <small style={{ color: "seagreen" }}>{msg}</small>}
      </div>

      <div
        style={{
          width: "100%",
          height: 380,
          border: "1px solid",
          borderRadius: 8,
          padding: 16,
          ...estilosTema.borde,
          ...estilosTema.contenedor,
        }}
      >
        <h4 style={{ margin: 0, marginBottom: 16, ...estilosTema.texto }}>
          Top {limit} por {metric}
        </h4>
        <ResponsiveContainer>
          <BarChart
            data={barData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={temaOscuro ? "#6b7280" : "#ccc"}
            />
            <XAxis
              dataKey="titulo"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={12}
              stroke={temaOscuro ? "#e9d5ff" : "#374151"}
            />
            <YAxis
              tickFormatter={fmt}
              stroke={temaOscuro ? "#e9d5ff" : "#374151"}
            />
            <Tooltip
              formatter={(v) => fmt(v)}
              contentStyle={{
                backgroundColor: temaOscuro ? "#4b5563" : "#ffffff",
                border: `1px solid ${temaOscuro ? "#6b7280" : "#ddd"}`,
                borderRadius: 6,
                color: temaOscuro ? "#e9d5ff" : "#1f2937",
              }}
            />
            <Legend />
            <Bar
              dataKey="valor"
              name={metric === "cantidad" ? "Unidades" : "Ingreso"}
              fill={temaOscuro ? "#8884d8" : "#8884d8"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          width: "100%",
          height: 400,
          border: "1px solid",
          borderRadius: 8,
          padding: 16,
          ...estilosTema.borde,
          ...estilosTema.contenedor,
        }}
      >
        <h4 style={{ margin: 0, marginBottom: 16, ...estilosTema.texto }}>
          Serie diaria (top {top}) · {metric}
        </h4>
        <ResponsiveContainer>
          <LineChart
            data={lineData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={temaOscuro ? "#6b7280" : "#ccc"}
            />
            <XAxis
              dataKey="fecha"
              stroke={temaOscuro ? "#e9d5ff" : "#374151"}
              fontSize={12}
            />
            <YAxis
              tickFormatter={fmt}
              stroke={temaOscuro ? "#e9d5ff" : "#374151"}
            />
            <Tooltip
              formatter={(v) => fmt(v)}
              contentStyle={{
                backgroundColor: temaOscuro ? "#4b5563" : "#ffffff",
                border: `1px solid ${temaOscuro ? "#6b7280" : "#ddd"}`,
                borderRadius: 6,
                color: temaOscuro ? "#e9d5ff" : "#1f2937",
              }}
            />
            <Legend />
            {(serie.series || []).map((s, index) => (
              <Line
                key={s.titulo}
                type="monotone"
                dataKey={s.titulo}
                stroke={coloresProductos[index % coloresProductos.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: coloresProductos[index % coloresProductos.length],
                  strokeWidth: 2,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
