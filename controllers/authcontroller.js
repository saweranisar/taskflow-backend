const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP
const signup = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check: pehle se user exist to nahi karta
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Password ko hash (encrypt) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user database mein save karna
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // JWT token banana
        const token = jwt.sign({ userId: newUser._id },
            process.env.JWT_SECRET, { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// LOGIN
const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // User dhundna email se
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Password match karna (hashed wale se compare)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // JWT token banana
        const token = jwt.sign({ userId: user._id },
            process.env.JWT_SECRET, { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { signup, login };