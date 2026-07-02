const inventoryMovementModel = require('../models/inventoryMovementModel');

async function getInventoryMovements(req, res) {
  try {
    const movements = await inventoryMovementModel.getInventoryMovements();
    res.json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener movimientos de inventario' });
  }
}

async function getInventoryCostHistory(req, res) {
  try {
    const { inventario_id } = req.query;
    const history = await inventoryMovementModel.getInventoryCostHistory({ inventario_id: inventario_id ? Number(inventario_id) : null });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener historial de costos' });
  }
}

async function createInventoryMovement(req, res) {
  try {
    const movement = await inventoryMovementModel.createInventoryMovement(req.body);
    res.status(201).json({ message: 'Movimiento registrado correctamente', movement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al registrar movimiento' });
  }
}

module.exports = {
  getInventoryMovements,
  getInventoryCostHistory,
  createInventoryMovement,
};