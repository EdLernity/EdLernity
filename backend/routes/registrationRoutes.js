const express = require('express');
const router = express.Router();
const app = express();

const registrationController = require('../controllers/registrationController');


//register User
router.post('/register', registrationController.registerUser);
router.post('/login', registrationController.loginUser);

// app.get("/", (req, res)=>{
//     res.send("<h1> server is working</h1>")
//  })

module.exports = router;