const express = require('express');
const { getCostHistory } = require('../controllers/productCostHistoryController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getCostHistory);

module.exports = router;
