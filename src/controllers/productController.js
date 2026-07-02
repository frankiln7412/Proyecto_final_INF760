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

    if (!nombre || precio === undefined || stock === undefined || stock_minimo === undefined) {
      return res.status(400).json({ message: 'Nombre, precio, stock y stock_minimo son obligatorios' });
    }

    const product = await productModel.createProduct({
      nombre,
      descripcion: descripcion || '',
      precio,
      stock,
      stock_minimo,
    });

    res.status(201).json({ message: 'Producto creado correctamente', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
}

async function updateProduct(req, res) {
  try {
    const data = { ...req.body, usuario_id: req.user.id };
    const product = await productModel.updateProduct(req.params.id, data);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente', product });
  } catch (error) {
    console.error(error);
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
