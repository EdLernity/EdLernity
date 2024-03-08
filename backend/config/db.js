const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://nikhilraj2061:Nikhil123@cluster0.vlh3ysu.mongodb.net/EdLernity", {
            // No need for useNewUrlParser and useUnifiedTopology
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
