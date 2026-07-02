const saleModel = require('../models/saleModel');

async function createSale(req, res) {
  try {
    const { total, items, fecha } = req.body;

    if (!total || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'total e items son obligatorios' });
    }

    const sale = await saleModel.createSale({
      usuario_id: req.user.id,
      total,
      items,
      fecha,
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
    const report = await saleModel.getSalesReport({ tipo, desde, hasta });
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener reportes' });
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
  getDashboard,
};