const db = require('../config/db');

async function ensureInventoryMovementTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS inventario_movimiento (
      id SERIAL PRIMARY KEY,
      inventario_id INTEGER NOT NULL REFERENCES insumo(id) ON DELETE CASCADE,
      tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ENTRADA', 'SALIDA')),
      cantidad INTEGER NOT NULL CHECK (cantidad > 0),
      costo_unitario NUMERIC(10,2) NOT NULL DEFAULT 0,
      total NUMERIC(10,2) NOT NULL DEFAULT 0,
      descripcion TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getInventoryMovements() {
  await ensureInventoryMovementTable();

  const query = `
    SELECT
      im.id,
      im.inventario_id,
      im.tipo,
      im.cantidad,
      im.costo_unitario,
      im.total,
      im.descripcion,
      im.fecha,
      s.nombre AS inventario_nombre
    FROM inventario_movimiento im
    JOIN insumo s ON s.id = im.inventario_id
    ORDER BY im.fecha DESC, im.id DESC
  `;

  const result = await db.query(query);
  return result.rows.map((row) => ({
    ...row,
    cantidad: Number(row.cantidad),
    costo_unitario: Number(row.costo_unitario),
    total: Number(row.total),
  }));
}

async function getInventoryCostHistory({ inventario_id } = {}) {
  await ensureInventoryMovementTable();

  const query = `
    SELECT
      im.id,
      im.inventario_id,
      im.tipo,
      im.cantidad,
      im.costo_unitario,
      im.total,
      im.descripcion,
      im.fecha,
      s.nombre AS inventario_nombre
    FROM inventario_movimiento im
    JOIN insumo s ON s.id = im.inventario_id
    WHERE ($1::int IS NULL OR im.inventario_id = $1)
    ORDER BY im.fecha ASC, im.id ASC
  `;

  const result = await db.query(query, [inventario_id ?? null]);
  return result.rows.map((row) => ({
    ...row,
    cantidad: Number(row.cantidad),
    costo_unitario: Number(row.costo_unitario),
    total: Number(row.total),
  }));
}

async function createInventoryMovement({ inventario_id, tipo, cantidad, costo_unitario, descripcion }) {
  await ensureInventoryMovementTable();

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query('SELECT cantidad, precio FROM insumo WHERE id = $1', [inventario_id]);
    const current = currentResult.rows[0];
    if (!current) {
      throw new Error('Inventario no encontrado');
    }

    const qty = Number(cantidad);
    const unitCost = Number(costo_unitario);
    const movementTotal = qty * unitCost;
    let newQuantity = Number(current.cantidad) || 0;
    let newCost = Number(current.precio) || 0;

    if (tipo === 'ENTRADA') {
      const currentValue = newQuantity * newCost;
      newQuantity += qty;
      newCost = newQuantity > 0 ? (currentValue + movementTotal) / newQuantity : 0;
    } else if (tipo === 'SALIDA') {
      newQuantity -= qty;
      if (newQuantity < 0) {
        throw new Error('No puedes sacar más de lo disponible');
      }
    } else {
      throw new Error('Tipo de movimiento inválido');
    }

    const movementResult = await client.query(
      `
        INSERT INTO inventario_movimiento (inventario_id, tipo, cantidad, costo_unitario, total, descripcion)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, inventario_id, tipo, cantidad, costo_unitario, total, descripcion, fecha
      `,
      [inventario_id, tipo, qty, unitCost, movementTotal, descripcion || null]
    );

    await client.query(
      `
        UPDATE insumo
        SET cantidad = $1, precio = $2
        WHERE id = $3
      `,
      [newQuantity, newCost, inventario_id]
    );

    await client.query('COMMIT');
    return movementResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getInventoryMovements,
  getInventoryCostHistory,
  createInventoryMovement,
};