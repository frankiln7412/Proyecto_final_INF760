const db = require('../config/db');

async function getAllRepositions() {
  const query = `
    SELECT r.id, r.producto_id, p.nombre AS producto_nombre, r.cantidad, r.fecha
    FROM reposicion r
    JOIN producto p ON p.id = r.producto_id
    ORDER BY r.fecha DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

async function getRepositionById(id) {
  const query = `
    SELECT r.id, r.producto_id, p.nombre AS producto_nombre, r.cantidad, r.fecha
    FROM reposicion r
    JOIN producto p ON p.id = r.producto_id
    WHERE r.id = $1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
}

async function createReposition({ producto_id, cantidad }) {
  const query = `
    INSERT INTO reposicion (producto_id, cantidad)
    VALUES ($1, $2)
    RETURNING id, producto_id, cantidad, fecha
  `;

  const result = await db.query(query, [producto_id, cantidad]);
  return result.rows[0];
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
