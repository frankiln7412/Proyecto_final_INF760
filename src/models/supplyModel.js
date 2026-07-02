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

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const current = await client.query('SELECT precio, cantidad FROM insumo WHERE id = $1', [id]);
    if (!current.rows[0]) throw new Error('Insumo no encontrado');

    const oldPrice = Number(current.rows[0].precio);
    const oldCantidad = Number(current.rows[0].cantidad);

    const result = await client.query(
      `
        UPDATE insumo
        SET ${fields.join(', ')}
        WHERE id = $${index}
        RETURNING id, nombre, cantidad, unidad_medida, precio, created_at
      `,
      values
    );

    if (data.precio !== undefined && Number(data.precio) !== oldPrice) {
      const priceDiff = Number(data.precio) - oldPrice;
      await client.query(
        `
          INSERT INTO inventario_movimiento (inventario_id, tipo, cantidad, costo_unitario, total, descripcion, usuario_id, costo_anterior)
          VALUES ($1, 'ENTRADA', 1, $2, $2, $3, $4, $5)
        `,
        [id, Number(data.precio), `Cambio de precio: $${oldPrice.toFixed(2)} → $${Number(data.precio).toFixed(2)}`, data.usuario_id || null, oldPrice]
      );
    }

    if (data.cantidad !== undefined && Number(data.cantidad) !== oldCantidad) {
      const diff = Number(data.cantidad) - oldCantidad;
      const tipo = diff > 0 ? 'ENTRADA' : 'SALIDA';
      await client.query(
        `
          INSERT INTO inventario_movimiento (inventario_id, tipo, cantidad, costo_unitario, total, descripcion, usuario_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [id, tipo, Math.abs(diff), Number(data.precio ?? current.rows[0].precio), Math.abs(diff) * Number(data.precio ?? current.rows[0].precio), 'Ajuste manual', data.usuario_id || null]
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
