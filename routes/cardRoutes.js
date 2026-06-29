const express = require('express');
const router = express.Router({ mergeParams: true });
const protect = require('../middleware/authMiddleware');
const { createCard, getCards, updateCard, deleteCard } = require('../controllers/cardController');

router.post('/', protect, createCard);
router.get('/', protect, getCards);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);

module.exports = router;