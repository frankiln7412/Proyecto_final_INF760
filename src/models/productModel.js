const db = require('../config/db');

async function getAllProducts() {
  const query = `
    SELECT id, nombre, descripcion, precio, stock, stock_minimo, created_at
    FROM producto
    ORDER BY created_at DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

async function getProductById(id) {
  const query = `
    SELECT id, nombre, descripcion, precio, stock, stock_minimo, created_at
    FROM producto
    WHERE id = $1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
}

async function createProduct({ nombre, descripcion, precio, stock, stock_minimo }) {
  const query = `
    INSERT INTO producto (nombre, descripcion, precio, stock, stock_minimo)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, nombre, descripcion, precio, stock, stock_minimo, created_at
  `;

  const result = await db.query(query, [nombre, descripcion, precio, stock, stock_minimo]);
  return result.rows[0];
}

async function updateProduct(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.nombre !== undefined) {
    fields.push(`nombre = $${index}`);
    values.push(data.nombre);
    index += 1;
  }

  if (data.descripcion !== undefined) {
    fields.push(`descripcion = $${index}`);
    values.push(data.descripcion);
    index += 1;
  }

  if (data.precio !== undefined) {
    fields.push(`precio = $${index}`);
    values.push(data.precio);
    index += 1;
  }

  if (data.stock !== undefined) {
    fields.push(`stock = $${index}`);
    values.push(data.stock);
    index += 1;
  }

  if (data.stock_minimo !== undefined) {
    fields.push(`stock_minimo = $${index}`);
    values.push(data.stock_minimo);
    index += 1;
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const query = `
    UPDATE producto
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING id, nombre, descripcion, precio, stock, stock_minimo, created_at
  `;

  const result = await db.query(query, values);
  return result.rows[0];
}

async function deleteProduct(id) {
  const query = `
    DELETE FROM producto
    WHERE id = $1
    RETURNING id
  `;

  const result = await db.query(query, [id]);
  return result.rowCount > 0;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
