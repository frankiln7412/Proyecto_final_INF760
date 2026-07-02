-- Script SQL completo para PostgreSQL
-- Crear base de datos si no existe
-- CREATE DATABASE inventario_db;

CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('PROPIETARIO', 'EMPLEADO')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS producto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS insumo (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 0,
  unidad_medida VARCHAR(50) NOT NULL,
  precio NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venta (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  metodo_pago VARCHAR(50) NOT NULL DEFAULT 'EFECTIVO',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detalle_venta (
  id SERIAL PRIMARY KEY,
  venta_id INTEGER NOT NULL REFERENCES venta(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reposicion (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerta (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  mensaje TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'SOLUCIONADA')),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Mejoras: agregar columnas a inventario_movimiento
-- ============================================================
ALTER TABLE inventario_movimiento ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL;
ALTER TABLE inventario_movimiento ADD COLUMN IF NOT EXISTS costo_anterior NUMERIC(10,2);

-- ============================================================
-- Tabla: producto_movimiento (entradas/salidas de productos)
-- ============================================================
CREATE TABLE IF NOT EXISTS producto_movimiento (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ENTRADA', 'SALIDA')),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  stock_anterior INTEGER NOT NULL DEFAULT 0,
  stock_nuevo INTEGER NOT NULL DEFAULT 0,
  motivo TEXT,
  usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabla: producto_costo_historico (cambios de precio)
-- ============================================================
CREATE TABLE IF NOT EXISTS producto_costo_historico (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  costo_anterior NUMERIC(10,2) NOT NULL DEFAULT 0,
  costo_nuevo NUMERIC(10,2) NOT NULL DEFAULT 0,
  usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Índices
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_venta_usuario_id ON venta(usuario_id);
CREATE INDEX IF NOT EXISTS idx_detalle_venta_venta_id ON detalle_venta(venta_id);
CREATE INDEX IF NOT EXISTS idx_reposicion_producto_id ON reposicion(producto_id);
CREATE INDEX IF NOT EXISTS idx_alerta_producto_id ON alerta(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_movimiento_producto_id ON producto_movimiento(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_costo_historico_producto_id ON producto_costo_historico(producto_id);
