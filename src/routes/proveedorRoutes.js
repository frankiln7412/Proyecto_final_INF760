const express = require('express');
const {
  getProveedores, getProveedor, createProveedor, updateProveedor, deleteProveedor,
} = require('../controllers/proveedorController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getProveedores);
router.get('/:id', authMiddleware, getProveedor);
router.post('/', authMiddleware, createProveedor);
router.put('/:id', authMiddleware, updateProveedor);
router.delete('/:id', authMiddleware, deleteProveedor);

module.exports = router;
