const productModel = require('../models/productModel');

async function getProducts(req, res) {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
}

async function getProduct(req, res) {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
}

async function createProduct(req, res) {
  try {
    const { nombre, descripcion, precio, stock, stock_minimo } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre del producto es obligatorio' });
    }

    if (precio === undefined || precio === null || Number(precio) < 0) {
      return res.status(400).json({ message: 'El precio debe ser un valor mayor o igual a 0' });
    }

    if (stock === undefined || stock === null || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ message: 'El stock debe ser un número entero mayor o igual a 0' });
    }

    if (stock_minimo === undefined || stock_minimo === null || !Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0) {
      return res.status(400).json({ message: 'El stock mínimo debe ser un número entero mayor o igual a 0' });
    }

    const product = await productModel.createProduct({
      nombre: nombre.trim(),
      descripcion: descripcion || '',
      precio: Number(precio),
      stock: Number(stock),
      stock_minimo: Number(stock_minimo),
    });

    res.status(201).json({ message: 'Producto creado correctamente', product });
  } catch (error) {
    console.error(error);
    if (error.code === '23505' || error.message?.includes('duplicate')) {
      return res.status(409).json({ message: 'Ya existe un producto con ese nombre' });
    }
    res.status(500).json({ message: error.message || 'Error al crear producto' });
  }
}

async function updateProduct(req, res) {
  try {
    const { nombre, precio, stock, stock_minimo } = req.body;

    if (nombre !== undefined && !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre del producto no puede estar vacío' });
    }

    if (precio !== undefined && (Number(precio) < 0)) {
      return res.status(400).json({ message: 'El precio debe ser mayor o igual a 0' });
    }

    if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({ message: 'El stock debe ser un número entero mayor o igual a 0' });
    }

    if (stock_minimo !== undefined && (!Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0)) {
      return res.status(400).json({ message: 'El stock mínimo debe ser un número entero mayor o igual a 0' });
    }

    const data = { ...req.body, usuario_id: req.user.id };
    const product = await productModel.updateProduct(req.params.id, data);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente', product });
  } catch (error) {
    console.error(error);
    if (error.code === '23505' || error.message?.includes('duplicate')) {
      return res.status(409).json({ message: 'Ya existe un producto con ese nombre' });
    }
    res.status(500).json({ message: error.message || 'Error al actualizar producto' });
  }
}

async function deleteProduct(req, res) {
  try {
    const deleted = await productModel.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
