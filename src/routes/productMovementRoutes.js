const express = require('express');
const { getMovements, getMovementsSummary, getInventoryReport } = require('../controllers/productMovementController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getMovements);
router.get('/resumen', authMiddleware, getMovementsSummary);
router.get('/reporte', authMiddleware, getInventoryReport);

module.exports = router;
