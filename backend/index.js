// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const registrationRoutes = require('./routes/registrationRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const gcsRoutes  = require('./routes/gcsRoutes');
const courseRoutes =  require('./routes/courseRoutes');
const paymentRoutes =  require('./routes/phonePayRoutes');
const userCourse =  require('./routes/userCourseRoutes');
const contactRoutes =  require('./routes/ContactRoutes');
const path = require('path');

const app = express();

// Connect to MongoDB 
connectDB();

app.use((req, res, next) => {
    if (req.url.includes('/Image/')) {
        res.setHeader('Cache-Control', 'public, max-age=2592000'); // Cache for 30 days
    }
    next();
});

app.use(cors({
    "origin" : "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.use(bodyParser.json()); // Add this line to parse JSON data


// Routes 
app.use('/auth', registrationRoutes);
app.use('/api', cloudinaryRoutes);
app.use('/api', gcsRoutes);
app.use('/api', courseRoutes);
app.use('/api', paymentRoutes);
app.use('/api', userCourse);
app.use('/api', contactRoutes);


// Serve static files
app.use(express.static(path.join(__dirname, "../build")));

app.get("/*",function (req,res) {
    res.sendFile(
        path.join(__dirname, "../build/index.html"),
        function(err) {
            if (err) {
                res.status(500).send(err)
            }
        }
    );
})

app.use("/*", function (req, res, next) {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }
    next();
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
