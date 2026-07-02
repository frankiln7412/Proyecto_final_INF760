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
      'SELECT id, nombre, stock FROM producto WHERE id = $1 FOR UPDATE',
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

async function deleteReposition(id) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const reposResult = await client.query(
      'SELECT producto_id, cantidad FROM reposicion WHERE id = $1 FOR UPDATE',
      [id]
    );

    const repos = reposResult.rows[0];
    if (!repos) return false;

    const productResult = await client.query(
      'SELECT stock FROM producto WHERE id = $1 FOR UPDATE',
      [repos.producto_id]
    );

    const product = productResult.rows[0];
    if (!product) throw new Error('Producto asociado no encontrado');

    const stockNuevo = Number(product.stock) - Number(repos.cantidad);
    if (stockNuevo < 0) {
      throw new Error('No se puede eliminar la reposición porque dejaría el stock en negativo');
    }

    await client.query(
      'UPDATE producto SET stock = $1 WHERE id = $2',
      [stockNuevo, repos.producto_id]
    );

    await client.query(
      'INSERT INTO producto_movimiento (producto_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo) VALUES ($1, $2, $3, $4, $5, $6)',
      [repos.producto_id, 'SALIDA', repos.cantidad, Number(product.stock), stockNuevo, 'Eliminación de reposición']
    );

    await client.query('DELETE FROM reposicion WHERE id = $1', [id]);

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getAllRepositions,
  getRepositionById,
  createReposition,
  deleteReposition,
};
