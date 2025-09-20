# backend/app.py
import os, time, sqlite3, random
from datetime import datetime, timedelta
from threading import Event as ThreadEvent

from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")
DB_PATH = os.path.join(BASE_DIR, "db.sqlite")

app = Flask(__name__, static_folder=DIST_DIR, static_url_path="/")
CORS(app, resources={r"/api/*": {"origins": "*"}})
ventas_event = ThreadEvent()

@app.after_request
def add_headers(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return resp

def get_conn():
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    with get_conn() as conn:
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                precio REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                correo TEXT NOT NULL,
                creado_en TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS pedido_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pedido_id INTEGER NOT NULL,
                producto_id INTEGER NOT NULL,
                cantidad INTEGER NOT NULL,
                precio_unitario REAL NOT NULL,
                FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id)
            );
        """)
        conn.commit()

@app.route("/api/ping")
def ping():
    return jsonify({"ok": True}), 200

@app.route("/api/productos", methods=["GET"])
def listar_productos():
    with get_conn() as conn:
        rows = conn.execute("SELECT id, nombre, precio FROM productos ORDER BY id DESC").fetchall()
        return jsonify([dict(r) for r in rows]), 200

@app.route("/api/productos/<int:pid>", methods=["GET"])
def obtener_producto(pid):
    with get_conn() as conn:
        row = conn.execute("SELECT id, nombre, precio FROM productos WHERE id = ?", (pid,)).fetchone()
        if not row:
            return jsonify({"error": "No existe"}), 404
        return jsonify(dict(row)), 200

@app.route("/api/productos", methods=["POST"])
def crear_producto():
    payload = request.get_json(force=True) or {}
    nombre = payload.get("nombre")
    precio = payload.get("precio")
    if not nombre or precio is None:
        return jsonify({"error": "Faltan campos"}), 400
    with get_conn() as conn:
        cur = conn.execute("INSERT INTO productos(nombre, precio) VALUES (?,?)", (nombre, float(precio)))
        conn.commit()
        return jsonify({"id": cur.lastrowid, "nombre": nombre, "precio": float(precio)}), 201

@app.route("/api/productos/<int:pid>", methods=["PUT"])
def actualizar_producto(pid):
    payload = request.get_json(force=True) or {}
    nombre = payload.get("nombre")
    precio = payload.get("precio")
    if not nombre or precio is None:
        return jsonify({"error": "Faltan campos"}), 400
    with get_conn() as conn:
        cur = conn.execute("UPDATE productos SET nombre=?, precio=? WHERE id=?", (nombre, float(precio), pid))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({"error": "No existe"}), 404
    return jsonify({"id": pid, "nombre": nombre, "precio": float(precio)}), 200

@app.route("/api/productos/<int:pid>", methods=["DELETE"])
def eliminar_producto(pid):
    with get_conn() as conn:
        cur = conn.execute("DELETE FROM productos WHERE id=?", (pid,))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({"error": "No existe"}), 404
    return jsonify({"ok": True}), 200

# -------- Pedidos (pago simple) --------
@app.route("/api/pedidos", methods=["POST"])
def pedidos_crear():
    data = request.get_json(force=True) or {}
    nombre = str(data.get("nombre") or "").strip()
    correo = str(data.get("correo") or "").strip()
    items = data.get("items") or []
    if not nombre or not correo or not isinstance(items, list) or len(items) == 0:
        return jsonify({"error": "Datos incompletos"}), 400

    with get_conn() as conn:
        cur = conn.cursor()
        ts = datetime.now().isoformat(timespec="seconds")
        cur.execute("INSERT INTO pedidos(nombre, correo, creado_en) VALUES(?,?,?)", (nombre, correo, ts))
        pedido_id = cur.lastrowid

        for it in items:
            pid = it.get("id")
            titulo = str(it.get("titulo") or "").strip()
            qty = int(it.get("qty") or 1)
            try:
                precio_unit = float(it.get("precio"))
            except Exception:
                precio_unit = 0.0

            prod_row = None
            if pid is not None:
                prod_row = cur.execute("SELECT id, precio FROM productos WHERE id=?", (int(pid),)).fetchone()
            if prod_row is None and titulo:
                prod_row = cur.execute(
                    "SELECT id, precio FROM productos WHERE lower(trim(nombre))=lower(trim(?))", (titulo,)
                ).fetchone()
            if prod_row is None:
                cur.execute("INSERT INTO productos(nombre, precio) VALUES(?,?)", (titulo, precio_unit))
                producto_id = cur.lastrowid
            else:
                producto_id = prod_row["id"]
                if not precio_unit:
                    precio_unit = float(prod_row["precio"])

            cur.execute(
                "INSERT INTO pedido_items(pedido_id, producto_id, cantidad, precio_unitario) VALUES(?,?,?,?)",
                (pedido_id, producto_id, qty, precio_unit)
            )
        conn.commit()
        ventas_event.set()  # notifica dashboards

    return jsonify({"ok": True, "pedido_id": pedido_id})

# -------- Analítica para Recharts --------
@app.route("/api/ventas-top", methods=["GET"])
def ventas_top():
    try:
        days = int(request.args.get("days", 30))
        metric = request.args.get("metric", "cantidad")
        limit = int(request.args.get("limit", 6))
        if metric not in ("cantidad", "ingreso"):
            metric = "cantidad"
    except Exception:
        return jsonify({"error": "params inválidos"}), 400

    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT prod.nombre AS titulo,
                   SUM(pi.cantidad) AS cantidad,
                   SUM(pi.cantidad * pi.precio_unitario) AS ingreso
            FROM pedidos ped
            JOIN pedido_items pi ON pi.pedido_id = ped.id
            JOIN productos prod ON prod.id = pi.producto_id
            WHERE ped.creado_en >= DATETIME('now', ?)
            GROUP BY prod.nombre
            ORDER BY CASE WHEN ?='cantidad' THEN SUM(pi.cantidad)
                          ELSE SUM(pi.cantidad * pi.precio_unitario) END DESC
            LIMIT ?
            """, (f"-{days} days", metric, limit)
        ).fetchall()
    return jsonify([dict(r) for r in rows])

@app.route("/api/ventas-serie", methods=["GET"])
def ventas_serie():
    try:
        days = int(request.args.get("days", 30))
        metric = request.args.get("metric", "cantidad")
        top_n = int(request.args.get("top", 5))
        if metric not in ("cantidad", "ingreso"):
            metric = "cantidad"
    except Exception:
        return jsonify({"error": "params inválidos"}), 400

    with get_conn() as conn:
        top_rows = conn.execute(
            """
            SELECT prod.nombre AS titulo,
                   SUM(pi.cantidad) AS cantidad,
                   SUM(pi.cantidad * pi.precio_unitario) AS ingreso
            FROM pedidos ped
            JOIN pedido_items pi ON pi.pedido_id = ped.id
            JOIN productos prod ON prod.id = pi.producto_id
            WHERE ped.creado_en >= DATETIME('now', ?)
            GROUP BY prod.nombre
            ORDER BY CASE WHEN ?='cantidad' THEN SUM(pi.cantidad)
                          ELSE SUM(pi.cantidad * pi.precio_unitario) END DESC
            LIMIT ?
            """, (f"-{days} days", metric, top_n)
        ).fetchall()
        top_titulos = [r["titulo"] for r in top_rows]
        if not top_titulos:
            return jsonify({"labels": [], "series": []})

        qmarks = ",".join(["?"] * len(top_titulos))
        detalle = conn.execute(
            f"""
            SELECT DATE(ped.creado_en) AS fecha, prod.nombre AS titulo,
                   SUM(pi.cantidad) AS cantidad,
                   SUM(pi.cantidad * pi.precio_unitario) AS ingreso
            FROM pedidos ped
            JOIN pedido_items pi ON pi.pedido_id = ped.id
            JOIN productos prod ON prod.id = pi.producto_id
            WHERE ped.creado_en >= DATETIME('now', ?) AND prod.nombre IN ({qmarks})
            GROUP BY fecha, titulo
            ORDER BY fecha ASC, titulo ASC
            """, (f"-{days} days", *top_titulos)
        ).fetchall()

    from collections import defaultdict, OrderedDict
    by_title = defaultdict(lambda: OrderedDict())
    fechas_set = set()
    for r in detalle:
        f = r["fecha"]; t = r["titulo"]; val = r[metric]
        fechas_set.add(f); by_title[t][f] = float(val or 0.0)

    labels = sorted(list(fechas_set))
    series = []
    for t in top_titulos:
        od = by_title.get(t, {})
        data = [float(od.get(f, 0.0)) for f in labels]
        series.append({"titulo": t, "data": data})
    return jsonify({"labels": labels, "series": series})

# -------- SSE: refresco en vivo --------
@app.route("/api/ventas-sse")
def ventas_sse():
    def generate():
        yield "retry: 3000\n\n"
        yield f"data: {int(time.time())}\n\n"
        while True:
            ventas_event.wait(timeout=60)
            ventas_event.clear()
            yield f"data: {int(time.time())}\n\n"
    headers = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    return Response(generate(), mimetype="text/event-stream", headers=headers)

# -------- Seed de datos --------
@app.route("/api/seed", methods=["POST"])
def seed():
    titles = ["Leggings Pro", "Top Compresión", "Jogger Fit", "Short Runner", "Camiseta Dry"]
    precios = [120000, 90000, 135000, 80000, 70000]
    hoy = datetime.now()

    with get_conn() as conn:
        cur = conn.cursor()
        for t, p in zip(titles, precios):
            cur.execute("INSERT INTO productos(nombre, precio) VALUES(?,?)", (t, p))
        for _ in range(12):
            fecha = (hoy - timedelta(days=random.randint(0, 14))).replace(hour=12, minute=0, second=0)
            cur.execute("INSERT INTO pedidos(nombre, correo, creado_en) VALUES(?,?,?)",
                        (f"Cliente {_+1}", f"c{_+1}@mail.com", fecha.isoformat(timespec="seconds")))
            pedido_id = cur.lastrowid
            for __ in range(random.randint(1, 3)):
                prod = cur.execute("SELECT id, precio FROM productos ORDER BY RANDOM() LIMIT 1").fetchone()
                qty = random.randint(1, 4)
                cur.execute(
                    "INSERT INTO pedido_items(pedido_id, producto_id, cantidad, precio_unitario) VALUES(?,?,?,?)",
                    (pedido_id, prod["id"], qty, prod["precio"])
                )
        conn.commit()
    try: ventas_event.set()
    except: pass
    return {"ok": True, "msg": "Sembrado con éxito"}

@app.get("/assets/<path:path>")
def serve_assets(path): return send_from_directory(os.path.join(DIST_DIR, "assets"), path)

@app.get("/", defaults={"path": ""})
@app.get("/<path:path>")
def spa(path):
    full = os.path.join(DIST_DIR, path)
    if path and os.path.exists(full): return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, "index.html")

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port)
