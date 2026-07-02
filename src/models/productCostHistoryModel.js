const db = require('../config/db');

async function getCostHistory({ producto_id, desde, hasta } = {}) {
  const conditions = [];
  const values = [];
  let index = 1;

  if (producto_id) {
    conditions.push(`pch.producto_id = $${index}`);
    values.push(producto_id);
    index += 1;
  }

  if (desde) {
    conditions.push(`pch.fecha >= $${index}`);
    values.push(desde);
    index += 1;
  }

  if (hasta) {
    conditions.push(`pch.fecha <= $${index}`);
    values.push(hasta);
    index += 1;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      pch.id,
      pch.producto_id,
      p.nombre AS producto_nombre,
      pch.costo_anterior,
      pch.costo_nuevo,
      pch.usuario_id,
      u.nombre AS usuario_nombre,
      pch.fecha
    FROM producto_costo_historico pch
    JOIN producto p ON p.id = pch.producto_id
    LEFT JOIN usuario u ON u.id = pch.usuario_id
    ${whereClause}
    ORDER BY pch.fecha DESC, pch.id DESC
  `;

  const result = await db.query(query, values);
  return result.rows.map((row) => ({
    ...row,
    costo_anterior: Number(row.costo_anterior),
    costo_nuevo: Number(row.costo_nuevo),
  }));
}

async function registerCostChange({ producto_id, costo_anterior, costo_nuevo, usuario_id }) {
  const query = `
    INSERT INTO producto_costo_historico (producto_id, costo_anterior, costo_nuevo, usuario_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, producto_id, costo_anterior, costo_nuevo, usuario_id, fecha
  `;

  const result = await db.query(query, [producto_id, costo_anterior, costo_nuevo, usuario_id || null]);
  return result.rows[0];
}

module.exports = {
  getCostHistory,
  registerCostChange,
};
