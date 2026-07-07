const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadImage, deleteImage, upload } = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getProducts);
router.get('/:id', authMiddleware, getProduct);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.post('/:id/imagen', authMiddleware, upload.single('imagen'), uploadImage);
router.delete('/:id/imagen', authMiddleware, deleteImage);

module.exports = router;
