const db = require('../config/db');

async function getAllSupplies() {
  const query = `
    SELECT id, nombre, cantidad, unidad_medida, precio, created_at
    FROM insumo
    ORDER BY created_at DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

async function getSupplyById(id) {
  const query = `
    SELECT id, nombre, cantidad, unidad_medida, precio, created_at
    FROM insumo
    WHERE id = $1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
}

async function createSupply({ nombre, cantidad, unidad_medida, precio }) {
  const query = `
    INSERT INTO insumo (nombre, cantidad, unidad_medida, precio)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nombre, cantidad, unidad_medida, precio, created_at
  `;

  const result = await db.query(query, [nombre, cantidad, unidad_medida, precio]);
  return result.rows[0];
}

async function updateSupply(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.nombre !== undefined) {
    fields.push(`nombre = $${index}`);
    values.push(data.nombre);
    index += 1;
  }

  if (data.cantidad !== undefined) {
    fields.push(`cantidad = $${index}`);
    values.push(data.cantidad);
    index += 1;
  }

  if (data.unidad_medida !== undefined) {
    fields.push(`unidad_medida = $${index}`);
    values.push(data.unidad_medida);
    index += 1;
  }

  if (data.precio !== undefined) {
    fields.push(`precio = $${index}`);
    values.push(data.precio);
    index += 1;
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const query = `
    UPDATE insumo
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING id, nombre, cantidad, unidad_medida, precio, created_at
  `;

  const result = await db.query(query, values);
  return result.rows[0];
}

async function deleteSupply(id) {
  const query = `
    DELETE FROM insumo
    WHERE id = $1
    RETURNING id
  `;

  const result = await db.query(query, [id]);
  return result.rowCount > 0;
}

module.exports = {
  getAllSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
  deleteSupply,
};
