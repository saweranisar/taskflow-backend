const express = require('express');
const router = express.Router({ mergeParams: true });
const protect = require('../middleware/authMiddleware');
const { createList, getLists, deleteList } = require('../controllers/listController');

router.post('/', protect, createList);
router.get('/', protect, getLists);
router.delete('/:id', protect, deleteList);

module.exports = router;