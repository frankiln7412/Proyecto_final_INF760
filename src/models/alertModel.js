const db = require('../config/db');

async function getAllAlerts() {
  const query = `
    SELECT a.id, a.producto_id, p.nombre AS producto_nombre, a.mensaje, a.estado, a.fecha
    FROM alerta a
    JOIN producto p ON p.id = a.producto_id
    ORDER BY a.fecha DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

async function getAlertById(id) {
  const query = `
    SELECT a.id, a.producto_id, p.nombre AS producto_nombre, a.mensaje, a.estado, a.fecha
    FROM alerta a
    JOIN producto p ON p.id = a.producto_id
    WHERE a.id = $1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
}

async function createAlert({ producto_id, mensaje, estado = 'ACTIVA' }) {
  const query = `
    INSERT INTO alerta (producto_id, mensaje, estado)
    VALUES ($1, $2, $3)
    RETURNING id, producto_id, mensaje, estado, fecha
  `;

  const result = await db.query(query, [producto_id, mensaje, estado]);
  return result.rows[0];
}

async function updateAlert(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.producto_id !== undefined) {
    fields.push(`producto_id = $${index}`);
    values.push(data.producto_id);
    index += 1;
  }

  if (data.mensaje !== undefined) {
    fields.push(`mensaje = $${index}`);
    values.push(data.mensaje);
    index += 1;
  }

  if (data.estado !== undefined) {
    fields.push(`estado = $${index}`);
    values.push(data.estado);
    index += 1;
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const query = `
    UPDATE alerta
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING id, producto_id, mensaje, estado, fecha
  `;

  const result = await db.query(query, values);
  return result.rows[0];
}

async function deleteAlert(id) {
  const query = `
    DELETE FROM alerta
    WHERE id = $1
    RETURNING id
  `;

  const result = await db.query(query, [id]);
  return result.rowCount > 0;
}

async function getActiveAlertsCount() {
  const query = `
    SELECT COUNT(*)::int AS total
    FROM alerta
    WHERE estado = 'ACTIVA'
  `;

  const result = await db.query(query);
  return result.rows[0].total;
}

module.exports = {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
  getActiveAlertsCount,
};
