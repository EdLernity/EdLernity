const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
const {MONGODB_URI:url} = require('../utils/config')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://edlernity:edlernity123@cluster0.3hyvi76.mongodb.net/Edlernity?retryWrites=true&w=majority", {
            // No need for useNewUrlParser and useUnifiedTopology
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
