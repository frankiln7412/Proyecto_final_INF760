const express = require('express');
const { getSupplies, getSupply, createSupply, updateSupply, deleteSupply } = require('../controllers/supplyController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getSupplies);
router.get('/:id', authMiddleware, getSupply);
router.post('/', authMiddleware, createSupply);
router.put('/:id', authMiddleware, updateSupply);
router.delete('/:id', authMiddleware, deleteSupply);

module.exports = router;
