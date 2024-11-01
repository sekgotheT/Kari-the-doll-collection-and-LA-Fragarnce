// configuration/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,        // Ensures use of the new URL parser
      useUnifiedTopology: true,     // Enables the new connection management engine
      useCreateIndex: true,         // Deprecation fix for index creation
      useFindAndModify: false       // Disables deprecated findAndModify()
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    
    // Retry connection after a delay
    setTimeout(connectDB, 5000); // Retry every 5 seconds if connection fails

    // Optional: Exit process on unrecoverable error
    process.exit(1);
  }
};

module.exports = connectDB;
