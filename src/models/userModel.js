const db = require('../config/db');

async function createUser({ nombre, correo, password, rol = 'EMPLEADO' }) {
  const query = `
    INSERT INTO usuario (nombre, correo, password, rol)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nombre, correo, rol, created_at
  `;

  const result = await db.query(query, [nombre, correo, password, rol]);
  return result.rows[0];
}

async function findByEmail(correo) {
  const query = `
    SELECT id, nombre, correo, password, rol, created_at
    FROM usuario
    WHERE correo = $1
  `;

  const result = await db.query(query, [correo]);
  return result.rows[0];
}

async function findById(id) {
  const query = `
    SELECT id, nombre, correo, rol, created_at
    FROM usuario
    WHERE id = $1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
}

async function getAllUsers() {
  const query = `
    SELECT id, nombre, correo, rol, created_at
    FROM usuario
    ORDER BY created_at DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

async function updateUser(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.nombre !== undefined) {
    fields.push(`nombre = $${index}`);
    values.push(data.nombre);
    index += 1;
  }

  if (data.correo !== undefined) {
    fields.push(`correo = $${index}`);
    values.push(data.correo);
    index += 1;
  }

  if (data.rol !== undefined) {
    fields.push(`rol = $${index}`);
    values.push(data.rol);
    index += 1;
  }

  if (data.password !== undefined) {
    fields.push(`password = $${index}`);
    values.push(data.password);
    index += 1;
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);
  const query = `
    UPDATE usuario
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING id, nombre, correo, rol, created_at
  `;

  const result = await db.query(query, values);
  return result.rows[0];
}

async function deleteUser(id) {
  const query = `
    DELETE FROM usuario
    WHERE id = $1
    RETURNING id
  `;

  const result = await db.query(query, [id]);
  return result.rowCount > 0;
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  getAllUsers,
  updateUser,
  deleteUser,
};
