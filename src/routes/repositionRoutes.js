const express = require('express');
const { getRepositions, getReposition, createReposition, updateReposition, deleteReposition } = require('../controllers/repositionController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getRepositions);
router.get('/:id', authMiddleware, getReposition);
router.post('/', authMiddleware, createReposition);
router.put('/:id', authMiddleware, updateReposition);
router.delete('/:id', authMiddleware, deleteReposition);

module.exports = router;
