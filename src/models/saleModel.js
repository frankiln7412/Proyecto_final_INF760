const db = require('../config/db');
const alertModel = require('./alertModel');

async function ensureDetailVentaColumns() {
  const result = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'detalle_venta'");
  const columns = result.rows.map((row) => row.column_name);

  if (!columns.includes('total_precio')) {
    await db.query("ALTER TABLE detalle_venta ADD COLUMN IF NOT EXISTS total_precio NUMERIC(10,2) NOT NULL DEFAULT 0");
  }
}

async function createSale({ usuario_id, total, items, fecha }) {
  const client = await db.pool.connect();

  try {
    await ensureDetailVentaColumns();
    await client.query('BEGIN');

    let expectedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const productResult = await client.query(
        `
          SELECT id, nombre, precio, stock, stock_minimo
          FROM producto
          WHERE id = $1
        `,
        [item.producto_id]
      );

      const product = productResult.rows[0];
      if (!product) {
        throw new Error(`Producto no encontrado: ${item.producto_id}`);
      }

      const requestedQuantity = Number(item.cantidad);
      if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
        throw new Error(`Cantidad inválida para ${product.nombre}`);
      }

      if (product.stock < requestedQuantity) {
        throw new Error(`Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}`);
      }

      const priceFromDb = Number(product.precio);
      const submittedPrice = Number(item.precio_unitario);
      if (submittedPrice !== priceFromDb) {
        throw new Error(`El precio para ${product.nombre} no coincide con el inventario`);
      }

      const subtotal = priceFromDb * requestedQuantity;
      const submittedSubtotal = Number(item.subtotal);
      if (Number(submittedSubtotal.toFixed(2)) !== Number(subtotal.toFixed(2))) {
        throw new Error(`El subtotal para ${product.nombre} no coincide con el precio del inventario`);
      }

      expectedTotal += subtotal;
      validatedItems.push({
        producto_id: product.id,
        cantidad: requestedQuantity,
        precio_unitario: priceFromDb,
        subtotal,
        nombre: product.nombre,
      });
    }

    if (Number(Number(total).toFixed(2)) !== Number(expectedTotal.toFixed(2))) {
      throw new Error('El total de la venta no coincide con el inventario');
    }

    const saleDate = fecha ? new Date(fecha) : new Date();
    const saleResult = await client.query(
      `
        INSERT INTO venta (usuario_id, total, fecha)
        VALUES ($1, $2, $3)
        RETURNING id, usuario_id, total, fecha
      `,
      [usuario_id, total, saleDate]
    );

    const sale = saleResult.rows[0];

    for (const item of validatedItems) {
      await client.query(
        `
          INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal, total_precio)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [sale.id, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal, item.subtotal]
      );

      await client.query(
        `
          UPDATE producto
          SET stock = stock - $1
          WHERE id = $2
          RETURNING id
        `,
        [item.cantidad, item.producto_id]
      );

      const updatedProductResult = await client.query(
        `
          SELECT stock, stock_minimo, nombre
          FROM producto
          WHERE id = $1
        `,
        [item.producto_id]
      );

      const updatedProduct = updatedProductResult.rows[0];

      if (updatedProduct && updatedProduct.stock <= updatedProduct.stock_minimo) {
        const existingAlert = await client.query(
          `
            SELECT id
            FROM alerta
            WHERE producto_id = $1 AND estado = 'ACTIVA'
            LIMIT 1
          `,
          [item.producto_id]
        );

        if (existingAlert.rowCount === 0) {
          await client.query(
            `
              INSERT INTO alerta (producto_id, mensaje, estado)
              VALUES ($1, $2, $3)
            `,
            [item.producto_id, `Stock bajo para ${updatedProduct.nombre}`, 'ACTIVA']
          );
        }
      }
    }

    await client.query('COMMIT');
    return {
      ...sale,
      qr_text: `Venta:${sale.id};Monto:${Number(total).toFixed(2)};Fecha:${sale.fecha.toISOString ? sale.fecha.toISOString() : sale.fecha}`
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getSalesSummary() {
  const query = `
    SELECT
      COALESCE(SUM(total), 0)::numeric(10,2) AS total_ventas,
      COALESCE(SUM(total), 0)::numeric(10,2) AS total_ganancias
    FROM venta
  `;

  const result = await db.query(query);
  return result.rows[0];
}

async function getLowStockProducts() {
  const query = `
    SELECT id, nombre, stock, stock_minimo
    FROM producto
    WHERE stock <= stock_minimo
    ORDER BY stock ASC
  `;

  const result = await db.query(query);
  return result.rows;
}

async function getSalesReport({ tipo = 'detalle', desde, hasta } = {}) {
  await ensureDetailVentaColumns();

  const conditions = [];
  const values = [];
  let index = 1;

  if (desde) {
    conditions.push(`v.fecha >= $${index}`);
    values.push(desde);
    index += 1;
  }

  if (hasta) {
    conditions.push(`v.fecha <= $${index}`);
    values.push(hasta);
    index += 1;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  if (tipo === 'diario') {
    const query = `
      SELECT
        TO_CHAR(DATE(v.fecha), 'YYYY-MM-DD') AS fecha,
        COUNT(*)::int AS ventas,
        SUM(v.total)::numeric(10,2) AS total
      FROM venta v
      ${whereClause}
      GROUP BY DATE(v.fecha)
      ORDER BY fecha DESC
    `;

    const result = await db.query(query, values);
    return result.rows.map((row) => ({
      ...row,
      ventas: Number(row.ventas),
      total: Number(row.total),
    }));
  }

  if (tipo === 'mensual') {
    const query = `
      SELECT
        TO_CHAR(DATE_TRUNC('month', v.fecha), 'YYYY-MM') AS fecha,
        COUNT(*)::int AS ventas,
        SUM(v.total)::numeric(10,2) AS total
      FROM venta v
      ${whereClause}
      GROUP BY DATE_TRUNC('month', v.fecha)
      ORDER BY fecha DESC
    `;

    const result = await db.query(query, values);
    return result.rows.map((row) => ({
      ...row,
      ventas: Number(row.ventas),
      total: Number(row.total),
    }));
  }

  const query = `
    SELECT
      v.id AS venta_id,
      v.fecha,
      p.nombre AS producto,
      dv.cantidad,
      dv.precio_unitario,
      (dv.cantidad * dv.precio_unitario)::numeric(10,2) AS total_producto,
      v.total AS total_venta
    FROM detalle_venta dv
    JOIN venta v ON v.id = dv.venta_id
    JOIN producto p ON p.id = dv.producto_id
    ${whereClause}
    ORDER BY v.fecha DESC, v.id DESC, p.nombre ASC
  `;

  const result = await db.query(query, values);
  return result.rows.map((row) => ({
    ...row,
    cantidad: Number(row.cantidad),
    precio_unitario: Number(row.precio_unitario),
    total_producto: Number(row.total_producto),
    total_venta: Number(row.total_venta),
  }));
}

async function getDashboard() {
  const salesSummary = await getSalesSummary();
  const lowStock = await getLowStockProducts();
  const activeAlerts = await alertModel.getActiveAlertsCount();

  return {
    total_ventas: Number(salesSummary.total_ventas),
    total_ganancias: Number(salesSummary.total_ganancias),
    productos_stock_bajo: lowStock,
    alertas_activas: activeAlerts,
  };
}

module.exports = {
  createSale,
  getSalesReport,
  getDashboard,
};