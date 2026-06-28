const Card = require('../models/Card');

// Naya card banana
const createCard = async(req, res) => {
    try {
        const { title, description, priority, dueDate, position } = req.body;
        const { listId, boardId } = req.params;

        const card = await Card.create({
            title,
            description,
            priority,
            dueDate,
            position,
            list: listId,
            board: boardId
        });

        res.status(201).json({ message: 'Card created', card });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// List ke saare cards dekhna
const getCards = async(req, res) => {
    try {
        const { listId } = req.params;

        const cards = await Card.find({ list: listId })
            .sort({ position: 1 })
            .populate('assignedTo', 'name email');

        res.status(200).json(cards);

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Card update karna
const updateCard = async(req, res) => {
    try {
        const card = await Card.findById(req.params.id);

        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const updatedCard = await Card.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        res.status(200).json({ message: 'Card updated', updatedCard });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Card delete karna
const deleteCard = async(req, res) => {
    try {
        const card = await Card.findById(req.params.id);

        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        await card.deleteOne();
        res.status(200).json({ message: 'Card deleted' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createCard, getCards, updateCard, deleteCard };