const express = require('express');
const { getAlerts, getAlert, createAlert, updateAlert, deleteAlert } = require('../controllers/alertController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getAlerts);
router.get('/:id', authMiddleware, getAlert);
router.post('/', authMiddleware, createAlert);
router.put('/:id', authMiddleware, updateAlert);
router.delete('/:id', authMiddleware, deleteAlert);

module.exports = router;
