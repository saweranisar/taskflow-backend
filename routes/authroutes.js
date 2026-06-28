const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

// Protected route - sirf logged in user access kar sakta hai
router.get('/profile', protect, (req, res) => {
    res.json({ message: 'Welcome!', userId: req.user.userId });
});
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;