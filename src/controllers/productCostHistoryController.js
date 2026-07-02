const productCostHistoryModel = require('../models/productCostHistoryModel');

async function getCostHistory(req, res) {
  try {
    const { producto_id, desde, hasta } = req.query;
    const history = await productCostHistoryModel.getCostHistory({
      producto_id: producto_id ? Number(producto_id) : undefined,
      desde,
      hasta,
    });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener historial de costos' });
  }
}

module.exports = {
  getCostHistory,
};
