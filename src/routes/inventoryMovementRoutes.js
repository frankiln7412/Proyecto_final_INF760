const express = require('express');
const { getInventoryMovements, getInventoryCostHistory, createInventoryMovement } = require('../controllers/inventoryMovementController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getInventoryMovements);
router.get('/historial', authMiddleware, getInventoryCostHistory);
router.post('/', authMiddleware, createInventoryMovement);

module.exports = router;