const mongoose = require('mongoose');
const { ensureCertificateIndexes } = require('../utils/ensureCertificateIndexes');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // No need for useNewUrlParser and useUnifiedTopology
        });

        await ensureCertificateIndexes(conn.connection).catch((err) => {
            console.error('Certificate index migration failed:', err.message);
        });

        //console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
