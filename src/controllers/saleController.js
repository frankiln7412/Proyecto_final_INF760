const saleModel = require('../models/saleModel');

function normalizeDateParam(dateStr) {
  if (!dateStr) return null;
  if (dateStr.includes('T')) return dateStr;
  return `${dateStr}T00:00:00`;
}

async function createSale(req, res) {
  try {
    const { total, items, fecha, metodo_pago } = req.body;

    if (total === undefined || total === null) {
      return res.status(400).json({ message: 'total es obligatorio' });
    }

    if (Number(total) < 0) {
      return res.status(400).json({ message: 'El total no puede ser negativo' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Debe incluir al menos un producto' });
    }

    for (const item of items) {
      if (!item.producto_id) {
        return res.status(400).json({ message: 'Cada item debe tener un producto_id' });
      }
      if (item.cantidad === undefined || item.cantidad === null || !Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) <= 0) {
        return res.status(400).json({ message: `Cantidad inválida para el producto ${item.producto_id}` });
      }
      if (item.precio_unitario !== undefined && Number(item.precio_unitario) < 0) {
        return res.status(400).json({ message: `Precio unitario inválido para el producto ${item.producto_id}` });
      }
    }

    const sale = await saleModel.createSale({
      usuario_id: req.user.id,
      total: Number(total),
      items,
      fecha: fecha || undefined,
      metodo_pago: metodo_pago || 'EFECTIVO',
    });

    res.status(201).json({ message: 'Venta registrada correctamente', sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al registrar venta' });
  }
}

async function getSalesReport(req, res) {
  try {
    const { tipo, desde, hasta } = req.query;
    const report = await saleModel.getSalesReport({
      tipo,
      desde: normalizeDateParam(desde),
      hasta: normalizeDateParam(hasta),
    });
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener reportes' });
  }
}

async function getLibroDiario(req, res) {
  try {
    const { fecha } = req.query;
    const desde = fecha ? `${fecha}T00:00:00` : undefined;
    const hasta = fecha ? `${fecha}T23:59:59` : undefined;

    const report = await saleModel.getSalesReport({ tipo: 'diario', desde, hasta });
    const rows = report || [];

    const totalVentas = rows.reduce((sum, r) => sum + Number(r.total), 0);
    const totalTransacciones = rows.reduce((sum, r) => sum + Number(r.ventas), 0);

    res.json({
      fecha: fecha || 'todas',
      ventas: rows,
      resumen: {
        total_ventas: totalVentas,
        total_transacciones: totalTransacciones,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener libro diario' });
  }
}

async function getLibroMensual(req, res) {
  try {
    const { mes, anio } = req.query;
    let desde, hasta;

    if (mes && anio) {
      const mesNum = String(mes).padStart(2, '0');
      const diasEnMes = new Date(anio, mesNum, 0).getDate();
      desde = `${anio}-${mesNum}-01T00:00:00`;
      hasta = `${anio}-${mesNum}-${diasEnMes}T23:59:59`;
    }

    const report = await saleModel.getSalesReport({ tipo: 'mensual', desde, hasta });
    const rows = report || [];

    const totalVentas = rows.reduce((sum, r) => sum + Number(r.total), 0);
    const totalTransacciones = rows.reduce((sum, r) => sum + Number(r.ventas), 0);

    res.json({
      mes: mes || 'todos',
      anio: anio || 'todos',
      ventas: rows,
      resumen: {
        total_ventas: totalVentas,
        total_transacciones: totalTransacciones,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener libro mensual' });
  }
}

async function getDashboard(req, res) {
  try {
    const dashboard = await saleModel.getDashboard();
    res.json(dashboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener dashboard' });
  }
}

module.exports = {
  createSale,
  getSalesReport,
  getLibroDiario,
  getLibroMensual,
  getDashboard,
};