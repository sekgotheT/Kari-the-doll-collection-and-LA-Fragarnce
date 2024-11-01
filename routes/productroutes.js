// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const { getProducts, addProduct } = require('../controllers/productController');
const router = express.Router();

// Middleware to log request details for debugging
router.use((req, res, next) => {
  console.log(`${req.method} request to ${req.originalUrl}`);
  next();
});

// Configure multer for image uploads
const upload = multer({ dest: 'public/uploads/' }); // Ensure this directory exists

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
// Updated to handle image uploads
router.post('/uploadProduct', upload.single('image'), async (req, res) => {
  try {
    // Create a product object with the request body and image path
    const newProduct = {
      name: req.body.name,
      price: req.body.price,
      imagePath: req.file.path // Save the uploaded image path
    };

    const createdProduct = await addProduct(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ message: 'Failed to add product.' });
  }
});

// Export the router
module.exports = router;
