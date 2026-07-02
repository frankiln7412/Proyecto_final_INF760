const alertModel = require('../models/alertModel');

async function getAlerts(req, res) {
  try {
    const alerts = await alertModel.getAllAlerts();
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener alertas' });
  }
}

async function getAlert(req, res) {
  try {
    const alert = await alertModel.getAlertById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener alerta' });
  }
}

async function createAlert(req, res) {
  try {
    const { producto_id, mensaje, estado } = req.body;

    if (!producto_id || !mensaje) {
      return res.status(400).json({ message: 'producto_id y mensaje son obligatorios' });
    }

    const alert = await alertModel.createAlert({ producto_id, mensaje, estado });
    res.status(201).json({ message: 'Alerta creada correctamente', alert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear alerta' });
  }
}

async function updateAlert(req, res) {
  try {
    const alert = await alertModel.updateAlert(req.params.id, req.body);
    if (!alert) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    res.json({ message: 'Alerta actualizada correctamente', alert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar alerta' });
  }
}

async function deleteAlert(req, res) {
  try {
    const deleted = await alertModel.deleteAlert(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    res.json({ message: 'Alerta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar alerta' });
  }
}

module.exports = {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
};
