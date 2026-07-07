const db = require('../config/db');
const alertModel = require('./alertModel');

async function createSale({ usuario_id, total, items, fecha, metodo_pago, cliente_nombre, cliente_ci }) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    let expectedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const productResult = await client.query(
        `
          SELECT id, nombre, precio, stock, stock_minimo
          FROM producto
          WHERE id = $1
          FOR UPDATE
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

    let clienteId = null;
    let clienteNombreFinal = cliente_nombre || null;

    if (cliente_ci && cliente_ci.trim()) {
      const existingCliente = await client.query(
        'SELECT id, nombre FROM cliente WHERE ci = $1',
        [cliente_ci.trim()]
      );
      if (existingCliente.rows.length > 0) {
        clienteId = existingCliente.rows[0].id;
        clienteNombreFinal = existingCliente.rows[0].nombre;
      } else if (cliente_nombre && cliente_nombre.trim()) {
        const newCliente = await client.query(
          'INSERT INTO cliente (ci, nombre) VALUES ($1, $2) RETURNING id',
          [cliente_ci.trim(), cliente_nombre.trim()]
        );
        clienteId = newCliente.rows[0].id;
      }
    }

    const saleDate = fecha ? new Date(fecha) : new Date();
    const pago = metodo_pago || 'EFECTIVO';
    const saleResult = await client.query(
      `
        INSERT INTO venta (usuario_id, total, metodo_pago, fecha, cliente_nombre, cliente_id, estado)
        VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVA')
        RETURNING id, usuario_id, total, metodo_pago, fecha, cliente_nombre, cliente_id, estado
      `,
      [usuario_id, total, pago, saleDate, clienteNombreFinal, clienteId]
    );

    const sale = saleResult.rows[0];
    const itemsQr = [];

    for (const item of validatedItems) {
      await client.query(
        `
          INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [sale.id, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
      );

      const stockResult = await client.query(
        `
          SELECT stock, stock_minimo, nombre
          FROM producto
          WHERE id = $1
        `,
        [item.producto_id]
      );

      const currentProduct = stockResult.rows[0];
      if (!currentProduct) continue;

      const stockAnterior = Number(currentProduct.stock);
      const stockNuevo = stockAnterior - Number(item.cantidad);

      await client.query(
        `
          UPDATE producto
          SET stock = $1
          WHERE id = $2
        `,
        [stockNuevo, item.producto_id]
      );

      await client.query(
        `
          INSERT INTO producto_movimiento (producto_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, usuario_id)
          VALUES ($1, 'SALIDA', $2, $3, $4, $5, $6)
        `,
        [item.producto_id, item.cantidad, stockAnterior, stockNuevo, `Venta #${sale.id}`, usuario_id]
      );

      itemsQr.push(`${item.nombre} x${item.cantidad} = $${Number(item.subtotal).toFixed(2)}`);

      if (stockNuevo <= currentProduct.stock_minimo) {
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
            [item.producto_id, `Stock bajo para ${currentProduct.nombre}`, 'ACTIVA']
          );
        }
      }
    }

    await client.query('COMMIT');

    const saleDateStr = sale.fecha instanceof Date
      ? sale.fecha.toISOString()
      : new Date(sale.fecha).toISOString();

    const totalFormatted = Number(total).toFixed(2);
    const qr_text = [
      'INVENTARIO+',
      '===========',
      `Venta #${sale.id}`,
      `Fecha: ${saleDateStr}`,
      `Total: $${totalFormatted}`,
      `Pago: ${pago}`,
      '-----------',
      'Productos:',
      ...itemsQr.map((iq) => `  ${iq}`),
      '===========',
    ].join('\n');

    return {
      ...sale,
      qr_text,
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
      COALESCE(SUM(total), 0)::numeric(10,2) AS total_ventas
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
      fecha: row.fecha,
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
      fecha: row.fecha,
      ventas: Number(row.ventas),
      total: Number(row.total),
    }));
  }

  if (tipo === 'ventas') {
    const query = `
      SELECT
        v.id AS venta_id,
        v.fecha,
        v.total,
        v.metodo_pago,
        v.estado,
        v.motivo_anulacion,
        v.fecha_anulacion,
        COALESCE(c.nombre, v.cliente_nombre) AS cliente_nombre,
        u.nombre AS usuario,
        COUNT(dv.id)::int AS cantidad_productos,
        STRING_AGG(p.nombre, ', ' ORDER BY p.nombre) AS productos
      FROM venta v
      LEFT JOIN detalle_venta dv ON dv.venta_id = v.id
      LEFT JOIN producto p ON p.id = dv.producto_id
      LEFT JOIN usuario u ON u.id = v.usuario_id
      LEFT JOIN cliente c ON c.id = v.cliente_id
      ${whereClause}
      GROUP BY v.id, v.fecha, v.total, v.metodo_pago, v.estado, v.motivo_anulacion, v.fecha_anulacion, c.nombre, v.cliente_nombre, u.nombre
      ORDER BY v.fecha DESC, v.id DESC
    `;

    const result = await db.query(query, values);
    return result.rows.map((row) => ({
      ...row,
      total: Number(row.total),
      cantidad_productos: Number(row.cantidad_productos),
    }));
  }

  const query = `
    SELECT
      v.id AS venta_id,
      v.fecha,
      v.estado,
      u.nombre AS usuario,
      p.nombre AS producto,
      dv.cantidad,
      dv.precio_unitario,
      (dv.cantidad * dv.precio_unitario)::numeric(10,2) AS total_producto,
      v.total AS total_venta
    FROM detalle_venta dv
    JOIN venta v ON v.id = dv.venta_id
    JOIN producto p ON p.id = dv.producto_id
    LEFT JOIN usuario u ON u.id = v.usuario_id
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

async function getSalesByClient(nombre) {
  const query = `
    SELECT
      v.id,
      v.fecha,
      v.total,
      v.metodo_pago,
      v.cliente_nombre,
      u.nombre AS usuario
    FROM venta v
    LEFT JOIN usuario u ON u.id = v.usuario_id
    WHERE v.cliente_nombre ILIKE $1
    ORDER BY v.fecha DESC
  `;
  const result = await db.query(query, [`%${nombre}%`]);
  return result.rows.map((row) => ({
    ...row,
    total: Number(row.total),
  }));
}

async function getDashboard() {
  const salesSummary = await getSalesSummary();

  const hoyQuery = await db.query(`
    SELECT COALESCE(SUM(total), 0)::numeric(10,2) AS total_hoy
    FROM venta
    WHERE fecha::date = CURRENT_DATE
  `);

  const productCount = await db.query('SELECT COUNT(*)::int AS total FROM producto');
  const lowStock = await getLowStockProducts();
  const activeAlerts = await alertModel.getActiveAlertsCount();

  return {
    total_productos: Number(productCount.rows[0].total),
    total_ventas: Number(salesSummary.total_ventas),
    ventas_hoy: Number(hoyQuery.rows[0].total_hoy),
    productos_stock_bajo: lowStock,
    alertas_activas: activeAlerts,
  };
}

async function getSaleDetail(saleId) {
  const saleResult = await db.query(`
    SELECT
      v.id, v.fecha, v.total, v.metodo_pago, v.estado, v.motivo_anulacion,
      v.fecha_anulacion, v.cliente_nombre,
      COALESCE(c.nombre, v.cliente_nombre) AS cliente,
      c.ci AS cliente_ci,
      u.nombre AS usuario,
      ua.nombre AS usuario_anulacion
    FROM venta v
    LEFT JOIN usuario u ON u.id = v.usuario_id
    LEFT JOIN usuario ua ON ua.id = v.usuario_anulacion_id
    LEFT JOIN cliente c ON c.id = v.cliente_id
    WHERE v.id = $1
  `, [saleId]);

  if (saleResult.rows.length === 0) return null;

  const detailResult = await db.query(`
    SELECT
      dv.id, dv.producto_id, dv.cantidad, dv.precio_unitario, dv.subtotal,
      p.nombre AS producto_nombre, p.codigo
    FROM detalle_venta dv
    JOIN producto p ON p.id = dv.producto_id
    WHERE dv.venta_id = $1
    ORDER BY p.nombre ASC
  `, [saleId]);

  return {
    ...saleResult.rows[0],
    total: Number(saleResult.rows[0].total),
    items: detailResult.rows.map((r) => ({
      ...r,
      cantidad: Number(r.cantidad),
      precio_unitario: Number(r.precio_unitario),
      subtotal: Number(r.subtotal),
    })),
  };
}

async function anularSale(saleId, usuarioId, motivo) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const saleResult = await client.query(
      `SELECT id, estado FROM venta WHERE id = $1 FOR UPDATE`,
      [saleId]
    );

    if (saleResult.rows.length === 0) {
      throw new Error('Venta no encontrada');
    }

    const sale = saleResult.rows[0];
    if (sale.estado !== 'ACTIVA') {
      throw new Error('La venta ya fue anulada anteriormente');
    }

    if (!motivo || motivo.trim() === '') {
      throw new Error('El motivo de anulación es obligatorio');
    }

    const detailResult = await client.query(
      `SELECT dv.id, dv.producto_id, dv.cantidad
       FROM detalle_venta dv
       JOIN producto p ON p.id = dv.producto_id
       WHERE dv.venta_id = $1
       FOR UPDATE OF p`,
      [saleId]
    );

    for (const item of detailResult.rows) {
      const productResult = await client.query(
        `SELECT stock, nombre FROM producto WHERE id = $1 FOR UPDATE`,
        [item.producto_id]
      );

      const product = productResult.rows[0];
      if (!product) continue;

      const stockAnterior = Number(product.stock);
      const stockNuevo = stockAnterior + Number(item.cantidad);

      await client.query(
        `UPDATE producto SET stock = $1 WHERE id = $2`,
        [stockNuevo, item.producto_id]
      );

      await client.query(
        `INSERT INTO producto_movimiento (producto_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, usuario_id)
         VALUES ($1, 'ENTRADA', $2, $3, $4, $5, $6)`,
        [item.producto_id, item.cantidad, stockAnterior, stockNuevo, `Anulación Venta #${saleId}`, usuarioId]
      );
    }

    await client.query(
      `UPDATE venta
       SET estado = 'ANULADA', fecha_anulacion = NOW(), usuario_anulacion_id = $1, motivo_anulacion = $2
       WHERE id = $3`,
      [usuarioId, motivo.trim(), saleId]
    );

    await client.query('COMMIT');
    return { message: 'Venta anulada correctamente', sale_id: saleId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createSale,
  getSalesReport,
  getSalesByClient,
  getDashboard,
  getSaleDetail,
  anularSale,
};