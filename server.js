// server.js (Express setup)
require('dotenv').config(); // Load environment variables
const express = require('express'); // Import express
const multer = require('multer'); // Import multer for handling file uploads
const path = require('path'); // Import path module for handling file paths
const mongoose = require('mongoose'); // Import mongoose for MongoDB interaction
const cors = require('cors'); // Import cors for enabling Cross-Origin Resource Sharing
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails
const twilio = require('twilio'); // Import Twilio for sending SMS
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe setup
const connectDB = require('./configuration/db'); // Update with the correct path to db config
const productController = require('./controllers/productController'); // Import your product controller

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Require the Product model
const Product = require('./models/productModel'); // Adjust the path as necessary

// Enable CORS
app.use(cors());

// Connect to the database
connectDB(); // Connects to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/productsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(express.json()); // Parses JSON requests

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'), // Specify upload directory
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // Specify file naming convention
});
const upload = multer({ storage });

// Serve static images from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Serve uploaded files

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use(express.static('public')); // Serve static files from 'public' folder

// Route to handle image upload and product details using the product controller
app.post('/api/products', upload.single('image'), productController.addProduct);

// Payment Handling with Stripe
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // amount in cents
            currency,
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).send({ error: 'Payment creation failed' });
    }
});

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Twilio configuration
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to send receipt email
function sendReceiptEmail(customerEmail, adminEmail, paymentAmount) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${customerEmail}, ${adminEmail}`,
        subject: 'Payment Receipt',
        html: `<p>Thank you for your payment of $${paymentAmount}!</p><p>Your transaction was successful.</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending email: ${error}`);
        } else {
            console.log(`Receipt email sent: ${info.response}`);
        }
    });
}

// Function to send receipt SMS
function sendReceiptSMS(phoneNumber, paymentAmount) {
    twilioClient.messages.create({
        body: `Thank you for your payment of $${paymentAmount}! Your transaction was successful.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
    })
    .then((message) => console.log(`SMS sent: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error}`));
}

// Endpoint to handle payment success
app.post('/payment-success', (req, res) => {
    const { customerEmail, adminEmail, phoneNumber, paymentAmount } = req.body;
    sendReceiptEmail(customerEmail, adminEmail, paymentAmount);
    sendReceiptSMS(phoneNumber, paymentAmount);
    res.status(200).send('Receipts sent to both customer and admin.');
});

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
