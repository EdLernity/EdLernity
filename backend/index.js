// index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const {MONGODB_PORT:port} = require('./utils/config')
const bodyParser = require('body-parser');

const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

// Connect to MongoDB
connectDB();


app.use(cors());
app.use(bodyParser.json());

// Routes 
app.use('/api', registrationRoutes);

const PORT = port || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
