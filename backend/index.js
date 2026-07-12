// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet')
const registrationRoutes = require('./routes/registrationRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const gcsRoutes  = require('./routes/gcsRoutes');
const courseRoutes =  require('./routes/courseRoutes');
const courseaccessRoutes =  require('./routes/courseAccessRoutes');
const userCourse =  require('./routes/userCourseRoutes');
const contactRoutes =  require('./routes/ContactRoutes');
const path = require('path');
const enrollment = require('./routes/enroll.routes');
const internshipAdminRoutes = require('./routes/internshipAdmin.routes');
const internshipTrainerRoutes = require('./routes/internshipTrainer.routes');
const crmRoutes = require('./routes/crm.routes');
const careersRoutes = require('./routes/careers.routes');
const { ensureCareersReady } = require('./utils/careersProgramService');
const courseModel = require('./models/userCourseSchema');

const app = express();

// Connect to MongoDB 
connectDB();
ensureCareersReady().catch((err) => console.error("Careers program seed failed:", err));

app.use((req, res, next) => {
    if (req.url.includes('/Image/')) {
        res.setHeader('Cache-Control', 'public, max-age=2592000'); // Cache for 30 days
    }
    next();
});

const corsOptions = {
    origin: [
        'https://www.edlernity.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://monopoly-autistic-cadmium.ngrok-free.dev',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(helmet());
app.use(cors(corsOptions));

app.use(bodyParser.json()); // Add this line to parse JSON data


// Routes 
app.use('/auth', registrationRoutes);
app.use('/api', cloudinaryRoutes);
app.use('/api', gcsRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/course-access', courseaccessRoutes);
app.use('/api/v1/enroll', enrollment);
app.use('/api/v1/internship-admin', internshipAdminRoutes);
app.use('/api/v1/internship-trainer', internshipTrainerRoutes);
app.use('/api/v1/crm', crmRoutes);
app.use('/api/v1/careers', careersRoutes);
app.use('/api/v1/certificates', require('./routes/certificateVerify.routes'));
app.use('/api/v1/onboard', require('./routes/onboard.routes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', contactRoutes);

app.get("/", (req, res) => {
    res.send("Edlernity-Backend-env");
});

const verifySecretKey = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send({ message: 'Authorization header is missing' });
    }
  
    const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer <token>"
    const secretKey = "j770iz5#nb$j0+0n240t#k2je#6mu1m4#60sxj&ff3-u+1*-4#"; // Replace with your actual secret key
  
    if (token !== secretKey) {
      return res.status(403).send({ message: 'Invalid secret key' });
    }
  
    next();
  };

app.get("/payments",verifySecretKey, async (req, res) => {
    const { date } = req.query;
  
    if (!date) {
      return res.status(400).send({ message: "Date is required" });
    }
  
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
  
    try {
      const userCourses = await courseModel.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
        paid: true,
      }).populate("userId transactionId");
  
      const payments = userCourses.map((uc) => ({
        name: uc.userId.firstName+" "+uc.userId.lastName,
        paymentId: uc.transactionId.paymentId,
        email: uc.userId.email,
        phoneNumber: uc.userId.phone,
        amount: uc.transactionId.amount,
        date: uc.transactionId.timestamp,
      }));
  
      res.status(200).send(payments);
    } catch (error) {
      console.error("Error fetching payment information:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

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
