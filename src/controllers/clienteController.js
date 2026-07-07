const clienteModel = require('../models/clienteModel');

async function getByCI(req, res) {
  try {
    const { ci } = req.params;
    if (!ci || ci.trim() === '') {
      return res.status(400).json({ message: 'CI es obligatorio' });
    }
    const cliente = await clienteModel.findByCI(ci.trim());
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar cliente' });
  }
}

async function create(req, res) {
  try {
    const { ci, nombre } = req.body;
    if (!ci || !nombre || ci.trim() === '' || nombre.trim() === '') {
      return res.status(400).json({ message: 'CI y nombre son obligatorios' });
    }

    const existing = await clienteModel.findByCI(ci.trim());
    if (existing) {
      return res.status(409).json({ message: 'El cliente ya existe', cliente: existing });
    }

    const cliente = await clienteModel.create({ ci: ci.trim(), nombre: nombre.trim() });
    res.status(201).json({ message: 'Cliente registrado correctamente', cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar cliente' });
  }
}

async function search(req, res) {
  try {
    const { nombre } = req.query;
    if (!nombre || nombre.trim() === '') {
      return res.json([]);
    }
    const clientes = await clienteModel.searchByNombre(nombre.trim());
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar clientes' });
  }
}

module.exports = { getByCI, create, search };
