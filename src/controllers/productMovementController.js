const productMovementModel = require('../models/productMovementModel');

async function getMovements(req, res) {
  try {
    const { producto_id, tipo, desde, hasta } = req.query;
    const movements = await productMovementModel.getAllMovements({
      producto_id: producto_id ? Number(producto_id) : undefined,
      tipo,
      desde,
      hasta,
    });
    res.json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener movimientos de productos' });
  }
}

async function getMovementsSummary(req, res) {
  try {
    const { desde, hasta } = req.query;
    const summary = await productMovementModel.getMovementsSummary({ desde, hasta });
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener resumen de movimientos' });
  }
}

module.exports = {
  getMovements,
  getMovementsSummary,
};
