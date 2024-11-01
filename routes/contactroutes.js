// routes/contactRoutes.js
const express = require('express');
const { submitContactForm } = require('../controllers/contactController');
const router = express.Router();

// Middleware to log request details
router.use((req, res, next) => {
  console.log(`${req.method} request to ${req.originalUrl}`);
  next();
});

// Middleware for basic input validation
const validateContactForm = (req, res, next) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }
  next();
};

// POST route to submit contact form
router.post('/', validateContactForm, async (req, res) => {
  try {
    await submitContactForm(req.body);
    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error("Error submitting contact form:", error.message);
    res.status(500).json({ message: 'Failed to submit contact form.' });
  }
});

module.exports = router;
