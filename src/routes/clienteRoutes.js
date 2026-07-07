const express = require('express');
const { getByCI, create, search } = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/search', authMiddleware, search);
router.get('/:ci', authMiddleware, getByCI);
router.post('/', authMiddleware, create);

module.exports = router;
