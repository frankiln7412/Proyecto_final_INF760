const db = require('../config/db');

async function getAllMovements({ producto_id, desde, hasta, tipo } = {}) {
  const conditions = [];
  const values = [];
  let index = 1;

  if (producto_id) {
    conditions.push(`pm.producto_id = $${index}`);
    values.push(producto_id);
    index += 1;
  }

  if (tipo) {
    conditions.push(`pm.tipo = $${index}`);
    values.push(tipo);
    index += 1;
  }

  if (desde) {
    conditions.push(`pm.fecha >= $${index}`);
    values.push(desde);
    index += 1;
  }

  if (hasta) {
    conditions.push(`pm.fecha <= $${index}`);
    values.push(hasta);
    index += 1;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      pm.id,
      pm.producto_id,
      p.nombre AS producto_nombre,
      pm.tipo,
      pm.cantidad,
      pm.stock_anterior,
      pm.stock_nuevo,
      pm.motivo,
      pm.usuario_id,
      u.nombre AS usuario_nombre,
      pm.fecha
    FROM producto_movimiento pm
    JOIN producto p ON p.id = pm.producto_id
    LEFT JOIN usuario u ON u.id = pm.usuario_id
    ${whereClause}
    ORDER BY pm.fecha DESC, pm.id DESC
  `;

  const result = await db.query(query, values);
  return result.rows.map((row) => ({
    ...row,
    cantidad: Number(row.cantidad),
    stock_anterior: Number(row.stock_anterior),
    stock_nuevo: Number(row.stock_nuevo),
  }));
}

async function getMovementsSummary({ desde, hasta } = {}) {
  const conditions = [];
  const values = [];
  let index = 1;

  if (desde) {
    conditions.push(`pm.fecha >= $${index}`);
    values.push(desde);
    index += 1;
  }

  if (hasta) {
    conditions.push(`pm.fecha <= $${index}`);
    values.push(hasta);
    index += 1;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      COALESCE(SUM(CASE WHEN pm.tipo = 'ENTRADA' THEN pm.cantidad ELSE 0 END), 0)::int AS total_entradas,
      COALESCE(SUM(CASE WHEN pm.tipo = 'SALIDA' THEN pm.cantidad ELSE 0 END), 0)::int AS total_salidas,
      COUNT(*)::int AS total_movimientos
    FROM producto_movimiento pm
    ${whereClause}
  `;

  const result = await db.query(query, values);
  return result.rows[0];
}

module.exports = {
  getAllMovements,
  getMovementsSummary,
};
