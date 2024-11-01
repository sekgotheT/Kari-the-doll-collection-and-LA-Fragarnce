// routes/productRoutes.js
const express = require('express');
const { getProducts, addProduct } = require('../controllers/productController');
const router = express.Router();

// Middleware to log request details for debugging
router.use((req, res, next) => {
  console.log(`${req.method} request to ${req.originalUrl}`);
  next();
});

// GET route to retrieve all products
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: 'Failed to retrieve products.' });
  }
});

// POST route to add a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ message: 'Failed to add product.' });
  }
});

module.exports = router;
