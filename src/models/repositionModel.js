const db = require('../config/db');

async function getAllRepositions() {
  const query = `
    SELECT r.id, r.producto_id, p.nombre AS producto_nombre, r.cantidad, r.fecha, r.usuario_id, u.nombre AS usuario_nombre
    FROM reposicion r
    JOIN producto p ON p.id = r.producto_id
    LEFT JOIN usuario u ON u.id = r.usuario_id
    ORDER BY r.fecha DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

async function getRepositionById(id) {
  const query = `
    SELECT r.id, r.producto_id, p.nombre AS producto_nombre, r.cantidad, r.fecha, r.usuario_id, u.nombre AS usuario_nombre
    FROM reposicion r
    JOIN producto p ON p.id = r.producto_id
    LEFT JOIN usuario u ON u.id = r.usuario_id
    WHERE r.id = $1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
}

async function createReposition({ producto_id, cantidad, usuario_id }) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT id, nombre, stock FROM producto WHERE id = $1',
      [producto_id]
    );

    const product = currentResult.rows[0];
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const stockAnterior = Number(product.stock);
    const stockNuevo = stockAnterior + Number(cantidad);

    const repositionResult = await client.query(
      `
        INSERT INTO reposicion (producto_id, cantidad, usuario_id)
        VALUES ($1, $2, $3)
        RETURNING id, producto_id, cantidad, fecha, usuario_id
      `,
      [producto_id, cantidad, usuario_id || null]
    );

    await client.query(
      'UPDATE producto SET stock = $1 WHERE id = $2',
      [stockNuevo, producto_id]
    );

    await client.query(
      `
        INSERT INTO producto_movimiento (producto_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, usuario_id)
        VALUES ($1, 'ENTRADA', $2, $3, $4, $5, $6)
      `,
      [producto_id, cantidad, stockAnterior, stockNuevo, 'Reposición de stock', usuario_id || null]
    );

    await client.query('COMMIT');
    return repositionResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function updateReposition(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.producto_id !== undefined) {
    fields.push(`producto_id = $${index}`);
    values.push(data.producto_id);
    index += 1;
  }

  if (data.cantidad !== undefined) {
    fields.push(`cantidad = $${index}`);
    values.push(data.cantidad);
    index += 1;
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const query = `
    UPDATE reposicion
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING id, producto_id, cantidad, fecha
  `;

  const result = await db.query(query, values);
  return result.rows[0];
}

async function deleteReposition(id) {
  const query = `
    DELETE FROM reposicion
    WHERE id = $1
    RETURNING id
  `;

  const result = await db.query(query, [id]);
  return result.rowCount > 0;
}

module.exports = {
  getAllRepositions,
  getRepositionById,
  createReposition,
  updateReposition,
  deleteReposition,
};
