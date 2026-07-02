const db = require('./db');

async function runMigrations() {
  console.log('Ejecutando migraciones...');

  await db.query(`
    ALTER TABLE reposicion
    ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL
  `);

  await db.query(`
    ALTER TABLE venta
    ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(50) NOT NULL DEFAULT 'EFECTIVO'
  `);

  await db.query(`
    ALTER TABLE inventario_movimiento
    ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL
  `);

  await db.query(`
    ALTER TABLE inventario_movimiento
    ADD COLUMN IF NOT EXISTS costo_anterior NUMERIC(10,2)
  `);

  await db.query(`
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
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS producto_costo_historico (
      id SERIAL PRIMARY KEY,
      producto_id INTEGER NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
      costo_anterior NUMERIC(10,2) NOT NULL DEFAULT 0,
      costo_nuevo NUMERIC(10,2) NOT NULL DEFAULT 0,
      usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_producto_movimiento_producto_id
    ON producto_movimiento(producto_id)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_producto_costo_historico_producto_id
    ON producto_costo_historico(producto_id)
  `);

  console.log('Migraciones completadas.');
}

module.exports = { runMigrations };
