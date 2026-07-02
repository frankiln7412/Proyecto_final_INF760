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

  async function addConstraintSafe(table, name, check) {
    try {
      await db.query(`ALTER TABLE ${table} ADD CONSTRAINT ${name} CHECK (${check}) NOT VALID`);
    } catch (e) {
      if (e.code !== '42710') { // 42710 = duplicate_object (constraint already exists)
        console.log(`  Constraint ${name} already exists, skipping`);
      }
    }
  }

  await addConstraintSafe('producto', 'producto_precio_check', 'precio >= 0');
  await addConstraintSafe('producto', 'producto_stock_check', 'stock >= 0');
  await addConstraintSafe('producto', 'producto_stock_minimo_check', 'stock_minimo >= 0');
  await addConstraintSafe('insumo', 'insumo_precio_check', 'precio >= 0');
  await addConstraintSafe('insumo', 'insumo_cantidad_check', 'cantidad >= 0');

  // Clean existing data that violates constraints
  await db.query("UPDATE producto SET precio = 0 WHERE precio < 0");
  await db.query("UPDATE producto SET stock = 0 WHERE stock < 0");
  await db.query("UPDATE producto SET stock_minimo = 0 WHERE stock_minimo < 0");
  await db.query("UPDATE insumo SET precio = 0 WHERE precio < 0");
  await db.query("UPDATE insumo SET cantidad = 0 WHERE cantidad < 0");

  // Now validate the constraints (will succeed after cleanup)
  for (const c of ['producto_precio_check', 'producto_stock_check', 'producto_stock_minimo_check', 'insumo_precio_check', 'insumo_cantidad_check']) {
    try {
      await db.query(`ALTER TABLE ONLY ${c.startsWith('producto') ? 'producto' : 'insumo'} VALIDATE CONSTRAINT ${c}`);
    } catch (e) { /* ignore if not applicable */ }
  }

  // Ensure UNIQUE on producto.nombre (remove duplicates first)
  await db.query(`
    DELETE FROM producto a USING producto b
    WHERE a.id < b.id AND a.nombre = b.nombre
  `);
  try {
    await db.query('ALTER TABLE producto ADD CONSTRAINT producto_nombre_unique UNIQUE (nombre)');
  } catch (e) {
    if (e.code !== '42710') {
      console.log('  Note: unique constraint may already exist:', e.message);
    }
  }

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

  await db.query(`
    ALTER TABLE producto
    ADD COLUMN IF NOT EXISTS codigo VARCHAR(50) UNIQUE
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS proveedor (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      contacto VARCHAR(100),
      telefono VARCHAR(30),
      email VARCHAR(150),
      direccion TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    ALTER TABLE reposicion
    ADD COLUMN IF NOT EXISTS proveedor_id INTEGER REFERENCES proveedor(id) ON DELETE SET NULL
  `);

  console.log('Migraciones completadas.');
}

module.exports = { runMigrations };
