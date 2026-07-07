const db = require('../config/db');

async function getAllProducts() {
  const query = `
    SELECT id, nombre, codigo, descripcion, precio, stock, stock_minimo, imagen, created_at
    FROM producto
    ORDER BY created_at DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

async function getProductById(id) {
  const query = `
    SELECT id, nombre, codigo, descripcion, precio, stock, stock_minimo, imagen, created_at
    FROM producto
    WHERE id = $1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
}

async function createProduct({ nombre, codigo, descripcion, precio, stock, stock_minimo }) {
  const query = `
    INSERT INTO producto (nombre, codigo, descripcion, precio, stock, stock_minimo)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, nombre, codigo, descripcion, precio, stock, stock_minimo, imagen, created_at
  `;

  const result = await db.query(query, [nombre, codigo || null, descripcion, precio, stock, stock_minimo]);
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

  if (data.codigo !== undefined) {
    fields.push(`codigo = $${index}`);
    values.push(data.codigo);
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

  if (data.imagen !== undefined) {
    fields.push(`imagen = $${index}`);
    values.push(data.imagen);
    index += 1;
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const oldProduct = await client.query(
      'SELECT precio, stock FROM producto WHERE id = $1',
      [id]
    );

    if (!oldProduct.rows[0]) {
      throw new Error('Producto no encontrado');
    }

    const oldPrice = Number(oldProduct.rows[0].precio);
    const oldStock = Number(oldProduct.rows[0].stock);

    const result = await client.query(
      `
        UPDATE producto
        SET ${fields.join(', ')}
        WHERE id = $${index}
        RETURNING id, nombre, descripcion, precio, stock, stock_minimo, imagen, created_at
      `,
      values
    );

    if (data.precio !== undefined && Number(data.precio) !== oldPrice) {
      await client.query(
        `
          INSERT INTO producto_costo_historico (producto_id, costo_anterior, costo_nuevo, usuario_id)
          VALUES ($1, $2, $3, $4)
        `,
        [id, oldPrice, data.precio, data.usuario_id || null]
      );
    }

    if (data.stock !== undefined && Number(data.stock) !== oldStock) {
      const diff = Number(data.stock) - oldStock;
      const tipo = diff > 0 ? 'ENTRADA' : 'SALIDA';

      await client.query(
        `
          INSERT INTO producto_movimiento (producto_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, usuario_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [id, tipo, Math.abs(diff), oldStock, Number(data.stock), 'Ajuste manual', data.usuario_id || null]
      );
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function updateProductImage(id, imagen) {
  const result = await db.query(
    'UPDATE producto SET imagen = $1 WHERE id = $2 RETURNING id, imagen',
    [imagen, id]
  );
  return result.rows[0] || null;
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
  updateProductImage,
};
