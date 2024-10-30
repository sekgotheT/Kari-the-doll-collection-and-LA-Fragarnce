exports.submitContactForm = (req, res) => {
    const { name, email, message } = req.body;
    try {
        // In a real application, save the form data or send an email
        res.status(200).json({ message: 'Contact form submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
