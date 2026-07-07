const productModel = require('../models/productModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var cloudinary;
try { cloudinary = require('../config/cloudinary'); } catch (e) { cloudinary = null; }

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'frontend', 'uploads', 'products');
const USE_CLOUDINARY = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product_${req.params.id}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Use: JPG, JPEG, PNG, WEBP'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

function deleteLocalFile(filepath) {
  try {
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  } catch (e) { /* ignore */ }
}

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Debe seleccionar una imagen' });
    }

    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      deleteLocalFile(req.file.path);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    var imagen;
    if (USE_CLOUDINARY) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'inventario/productos',
        public_id: `product_${req.params.id}`,
        overwrite: true,
      });
      imagen = result.secure_url;
      deleteLocalFile(req.file.path);
    } else {
      imagen = `/uploads/products/${req.file.filename}`;
    }

    // Delete old image if exists
    if (product.imagen) {
      if (USE_CLOUDINARY) {
        try {
          await cloudinary.uploader.destroy('inventario/productos/product_' + req.params.id);
        } catch (e) { /* ignore */ }
      } else {
        deleteLocalFile(path.join(UPLOAD_DIR, path.basename(product.imagen)));
      }
    }

    await productModel.updateProductImage(req.params.id, imagen);
    res.json({ message: 'Imagen subida correctamente', imagen });
  } catch (error) {
    if (req.file) deleteLocalFile(req.file.path);
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al subir imagen' });
  }
}

async function deleteImage(req, res) {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (product.imagen) {
      if (USE_CLOUDINARY && product.imagen.includes('cloudinary')) {
        try {
          await cloudinary.uploader.destroy('inventario/productos/product_' + req.params.id);
        } catch (e) { /* ignore */ }
      } else {
        deleteLocalFile(path.join(UPLOAD_DIR, path.basename(product.imagen)));
      }
    }

    await productModel.updateProductImage(req.params.id, null);
    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar imagen' });
  }
}

async function deleteProduct(req, res) {
  try {
    // Delete associated image if product exists
    try {
      const prod = await productModel.getProductById(req.params.id);
      if (prod && prod.imagen) {
        if (USE_CLOUDINARY && prod.imagen.includes('cloudinary')) {
          try { await cloudinary.uploader.destroy('inventario/productos/product_' + req.params.id); } catch (e) { /* ignore */ }
        } else {
          deleteLocalFile(path.join(UPLOAD_DIR, path.basename(prod.imagen)));
        }
      }
    } catch (e) { /* ignore image cleanup errors */ }

    const deleted = await productModel.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(409).json({ message: 'No se puede eliminar el producto porque tiene ventas, reposiciones u otros registros asociados' });
    }
    res.status(500).json({ message: error.message || 'Error al eliminar producto' });
  }
}
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
      return res.status(400).json({ message: 'El stock debe ser un n\u00famero entero mayor o igual a 0' });
    }

    if (stock_minimo === undefined || stock_minimo === null || !Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0) {
      return res.status(400).json({ message: 'El stock m\u00ednimo debe ser un n\u00famero entero mayor o igual a 0' });
    }

    const product = await productModel.createProduct({
      nombre: nombre.trim(),
      codigo: req.body.codigo || null,
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
      return res.status(400).json({ message: 'El nombre del producto no puede estar vac\u00edo' });
    }

    if (precio !== undefined && (Number(precio) < 0)) {
      return res.status(400).json({ message: 'El precio debe ser mayor o igual a 0' });
    }

    if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({ message: 'El stock debe ser un n\u00famero entero mayor o igual a 0' });
    }

    if (stock_minimo !== undefined && (!Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0)) {
      return res.status(400).json({ message: 'El stock m\u00ednimo debe ser un n\u00famero entero mayor o igual a 0' });
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

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
  upload,
};
