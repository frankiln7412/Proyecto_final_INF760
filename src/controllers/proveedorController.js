const proveedorModel = require('../models/proveedorModel');

async function getProveedores(req, res) {
  try {
    const proveedores = await proveedorModel.getAllProveedores();
    res.json(proveedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener proveedores' });
  }
}

async function getProveedor(req, res) {
  try {
    const proveedor = await proveedorModel.getProveedorById(req.params.id);
    if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(proveedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener proveedor' });
  }
}

async function createProveedor(req, res) {
  try {
    const { nombre, contacto, telefono, email, direccion } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre del proveedor es obligatorio' });
    }
    const proveedor = await proveedorModel.createProveedor({
      nombre: nombre.trim(),
      contacto: contacto || null,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
    });
    res.status(201).json({ message: 'Proveedor creado correctamente', proveedor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al crear proveedor' });
  }
}

async function updateProveedor(req, res) {
  try {
    const { nombre } = req.body;
    if (nombre !== undefined && !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre del proveedor no puede estar vacío' });
    }
    const proveedor = await proveedorModel.updateProveedor(req.params.id, req.body);
    if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json({ message: 'Proveedor actualizado correctamente', proveedor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al actualizar proveedor' });
  }
}

async function deleteProveedor(req, res) {
  try {
    const deleted = await proveedorModel.deleteProveedor(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al eliminar proveedor' });
  }
}

module.exports = {
  getProveedores,
  getProveedor,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
