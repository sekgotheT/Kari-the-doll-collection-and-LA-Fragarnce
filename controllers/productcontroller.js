const Product = require('../models/productModel');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new product
exports.addProduct = async (req, res) => {
    const { name, price, description } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Get the image URL from multer's file object

    // Basic validation
    if (!name || !price || !description || !imageUrl) {
        return res.status(400).json({ message: 'All fields are required: name, price, description, and image.' });
    }

    try {
        const newProduct = new Product({ name, price, description, imageUrl });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
