// server.js (Express setup)
const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configuration/db'); // Updated to match your directory structure

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB(); // This function will connect to MongoDB

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Replaces body-parser for JSON parsing

// Set up database connection using environment variables
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/productsDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Product schema and model
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String, // Storing image path
});

const Product = mongoose.model('Product', productSchema);

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Route to handle product upload
app.post('/uploadProduct', upload.single('image'), async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            image: req.file.path,
        });

        await newProduct.save();
        res.status(200).send('Product uploaded successfully');
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).send('Error uploading product');
    }
});

// Serve static images from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use(express.static('public'));

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Path to save images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });


// Route to handle image upload and product details
app.post('/uploadProduct', upload.single('image'), (req, res) => {
    const { name, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    // Save product data to database or in-memory storage
    const newProduct = { name, price, image };

    // Assume you save the product somewhere, e.g., a database
    // Return a response indicating success
    res.send('Product uploaded successfully');
});

// Root Route for health check or basic response
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
