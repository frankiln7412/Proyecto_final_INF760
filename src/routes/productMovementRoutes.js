const express = require('express');
const { getMovements, getMovementsSummary } = require('../controllers/productMovementController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getMovements);
router.get('/resumen', authMiddleware, getMovementsSummary);

module.exports = router;
