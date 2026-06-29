const List = require('../models/List');
const Board = require('../models/Board');

// Nai list banana
const createList = async(req, res) => {
    try {
        const { title, position } = req.body;
        const { boardId } = req.params;

        // Board exist karta hai? Check karo
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Sirf member list bana sakta hai
        if (!board.members.includes(req.user.userId)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const list = await List.create({
            title,
            position,
            board: boardId
        });

        res.status(201).json({ message: 'List created', list });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Board ki saari lists dekhna
const getLists = async(req, res) => {
    try {
        const { boardId } = req.params;

        const lists = await List.find({ board: boardId }).sort({ position: 1 });

        res.status(200).json(lists);

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// List delete karna
const deleteList = async(req, res) => {
    try {
        const list = await List.findById(req.params.id);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        await list.deleteOne();
        res.status(200).json({ message: 'List deleted' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createList, getLists, deleteList };