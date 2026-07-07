const express = require('express');
const { createSale, getSalesReport, getSalesByClient, getLibroDiario, getLibroMensual, getDashboard, getSaleDetail, anularSale } = require('../controllers/saleController');
const authMiddleware = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');

const router = express.Router();

router.post('/', authMiddleware, createSale);
router.get('/reportes', authMiddleware, getSalesReport);
router.get('/libro-diario', authMiddleware, getLibroDiario);
router.get('/libro-mensual', authMiddleware, getLibroMensual);
router.get('/por-cliente', authMiddleware, getSalesByClient);
router.get('/dashboard', authMiddleware, authorizeRoles('PROPIETARIO'), getDashboard);
router.get('/:id', authMiddleware, getSaleDetail);
router.post('/:id/anular', authMiddleware, anularSale);

module.exports = router;
