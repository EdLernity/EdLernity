// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

// Connect to MongoDB
connectDB();


app.use(cors());
app.use(bodyParser.json()); // Add this line to parse JSON data

// Routes 
app.use('/api', registrationRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
