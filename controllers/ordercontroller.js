const Order = require('../models/orderModel');

// Place an order
exports.placeOrder = async (req, res) => {
    const { customerName, customerEmail, products, totalAmount } = req.body;
    try {
        const newOrder = new Order({ customerName, customerEmail, products, totalAmount });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
