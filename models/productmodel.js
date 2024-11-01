const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true } // Use imageUrl consistently
});

// Check if the model already exists to avoid overwriting
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Export the Product model
module.exports = Product;
