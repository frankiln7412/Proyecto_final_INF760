const supplyModel = require('../models/supplyModel');

async function getSupplies(req, res) {
  try {
    const supplies = await supplyModel.getAllSupplies();
    res.json(supplies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener insumos' });
  }
}

async function getSupply(req, res) {
  try {
    const supply = await supplyModel.getSupplyById(req.params.id);
    if (!supply) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    res.json(supply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener insumo' });
  }
}

async function createSupply(req, res) {
  try {
    const { nombre, cantidad, unidad_medida, precio } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre del insumo es obligatorio' });
    }

    if (!unidad_medida || !unidad_medida.trim()) {
      return res.status(400).json({ message: 'La unidad de medida es obligatoria' });
    }

    if (cantidad === undefined || cantidad === null || !Number.isInteger(Number(cantidad)) || Number(cantidad) < 0) {
      return res.status(400).json({ message: 'La cantidad debe ser un número entero mayor o igual a 0' });
    }

    if (precio === undefined || precio === null || Number(precio) < 0) {
      return res.status(400).json({ message: 'El precio debe ser mayor o igual a 0' });
    }

    const supply = await supplyModel.createSupply({
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
      unidad_medida: unidad_medida.trim(),
      precio: Number(precio),
    });
    res.status(201).json({ message: 'Insumo creado correctamente', supply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al crear insumo' });
  }
}

async function updateSupply(req, res) {
  try {
    const { nombre, cantidad, unidad_medida, precio } = req.body;

    if (nombre !== undefined && !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre del insumo no puede estar vacío' });
    }

    if (unidad_medida !== undefined && !unidad_medida.trim()) {
      return res.status(400).json({ message: 'La unidad de medida no puede estar vacía' });
    }

    if (cantidad !== undefined && (!Number.isInteger(Number(cantidad)) || Number(cantidad) < 0)) {
      return res.status(400).json({ message: 'La cantidad debe ser un número entero mayor o igual a 0' });
    }

    if (precio !== undefined && Number(precio) < 0) {
      return res.status(400).json({ message: 'El precio debe ser mayor o igual a 0' });
    }

    const data = { ...req.body, usuario_id: req.user.id };
    const supply = await supplyModel.updateSupply(req.params.id, data);
    if (!supply) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    res.json({ message: 'Insumo actualizado correctamente', supply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al actualizar insumo' });
  }
}

async function deleteSupply(req, res) {
  try {
    const deleted = await supplyModel.deleteSupply(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    res.json({ message: 'Insumo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar insumo' });
  }
}

module.exports = {
  getSupplies,
  getSupply,
  createSupply,
  updateSupply,
  deleteSupply,
};
