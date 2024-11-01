// routes/orderRoutes.js
const express = require('express');
const { placeOrder } = require('../controllers/orderController');
const router = express.Router();

// Middleware to log request details
router.use((req, res, next) => {
  console.log(`${req.method} request to ${req.originalUrl}`);
  next();
});

// Middleware for input validation
const validateOrder = (req, res, next) => {
  const { items, customerInfo, paymentDetails } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required.' });
  }
  if (!customerInfo || !customerInfo.name || !customerInfo.address || !customerInfo.email) {
    return res.status(400).json({ message: 'Complete customer information is required.' });
  }
  if (!paymentDetails || !paymentDetails.method || !paymentDetails.amount) {
    return res.status(400).json({ message: 'Valid payment details are required.' });
  }
  
  next();
};

// POST route to place an order
router.post('/', validateOrder, async (req, res) => {
  try {
    const orderResponse = await placeOrder(req.body);
    res.status(200).json({ message: 'Order placed successfully', order: orderResponse });
  } catch (error) {
    console.error("Error placing order:", error.message);
    res.status(500).json({ message: 'Failed to place order.' });
  }
});

module.exports = router;
