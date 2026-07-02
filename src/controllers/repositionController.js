const repositionModel = require('../models/repositionModel');

async function getRepositions(req, res) {
  try {
    const repositions = await repositionModel.getAllRepositions();
    res.json(repositions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener reposiciones' });
  }
}

async function getReposition(req, res) {
  try {
    const reposition = await repositionModel.getRepositionById(req.params.id);
    if (!reposition) {
      return res.status(404).json({ message: 'Reposición no encontrada' });
    }

    res.json(reposition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener reposición' });
  }
}

async function createReposition(req, res) {
  try {
    const { producto_id, cantidad } = req.body;

    if (!producto_id) {
      return res.status(400).json({ message: 'producto_id es obligatorio' });
    }

    if (cantidad === undefined || cantidad === null) {
      return res.status(400).json({ message: 'La cantidad es obligatoria' });
    }

    const cantNum = Number(cantidad);
    if (!Number.isInteger(cantNum) || cantNum <= 0) {
      return res.status(400).json({ message: 'La cantidad debe ser un número entero positivo' });
    }

    const reposition = await repositionModel.createReposition({
      producto_id: Number(producto_id),
      cantidad: cantNum,
      usuario_id: req.user.id,
    });
    res.status(201).json({ message: 'Reposición creada correctamente', reposition });
  } catch (error) {
    console.error('Error en createReposition:', error.message || error);
    res.status(500).json({ message: error.message || 'Error al crear reposición' });
  }
}

async function deleteReposition(req, res) {
  try {
    const deleted = await repositionModel.deleteReposition(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Reposición no encontrada' });
    }

    res.json({ message: 'Reposición eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al eliminar reposición' });
  }
}

module.exports = {
  getRepositions,
  getReposition,
  createReposition,
  deleteReposition,
};
