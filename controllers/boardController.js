const Board = require('../models/Board');

// Naya board banana
const createBoard = async(req, res) => {
    try {
        const { title, description, background } = req.body;

        const board = await Board.create({
            title,
            description,
            background,
            owner: req.user.userId,
            members: [req.user.userId]
        });

        res.status(201).json({ message: 'Board created', board });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Apne saare boards dekhna
const getBoards = async(req, res) => {
    try {
        const boards = await Board.find({
            members: req.user.userId
        }).populate('owner', 'name email');

        res.status(200).json(boards);

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Board delete karna
const deleteBoard = async(req, res) => {
    try {
        const board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Sirf owner delete kar sakta hai
        if (board.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await board.deleteOne();
        res.status(200).json({ message: 'Board deleted' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createBoard, getBoards, deleteBoard };