const db = require('../config/db');

async function getAllProveedores() {
  const result = await db.query('SELECT id, nombre, contacto, telefono, email, direccion, created_at FROM proveedor ORDER BY nombre ASC');
  return result.rows;
}

async function getProveedorById(id) {
  const result = await db.query('SELECT id, nombre, contacto, telefono, email, direccion, created_at FROM proveedor WHERE id = $1', [id]);
  return result.rows[0];
}

async function createProveedor({ nombre, contacto, telefono, email, direccion }) {
  const result = await db.query(
    `INSERT INTO proveedor (nombre, contacto, telefono, email, direccion)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nombre, contacto, telefono, email, direccion, created_at`,
    [nombre, contacto || null, telefono || null, email || null, direccion || null]
  );
  return result.rows[0];
}

async function updateProveedor(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key of ['nombre', 'contacto', 'telefono', 'email', 'direccion']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index += 1;
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const result = await db.query(
    `UPDATE proveedor SET ${fields.join(', ')} WHERE id = $${index}
     RETURNING id, nombre, contacto, telefono, email, direccion, created_at`,
    values
  );
  return result.rows[0];
}

async function deleteProveedor(id) {
  const result = await db.query('DELETE FROM proveedor WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}

module.exports = {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
