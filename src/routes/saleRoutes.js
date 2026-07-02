const express = require('express');
const { createSale, getSalesReport, getDashboard } = require('../controllers/saleController');
const authMiddleware = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');

const router = express.Router();

router.post('/', authMiddleware, createSale);
router.get('/reportes', authMiddleware, getSalesReport);
router.get('/dashboard', authMiddleware, authorizeRoles('PROPIETARIO'), getDashboard);

module.exports = router;
