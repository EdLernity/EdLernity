// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const registrationRoutes = require('./routes/registrationRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');

const app = express();

// Connect to MongoDB 
connectDB();


app.use(cors());
app.use(bodyParser.json()); // Add this line to parse JSON data

// Routes 
app.use('/auth', registrationRoutes);
app.use('/api', cloudinaryRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
