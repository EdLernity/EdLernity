const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateUserId = async () => {
    let isUnique = false;
    let userId;

    while (!isUnique) {
        // Generate a unique 8-digit numeric user ID
        userId = Math.floor(10000000 + Math.random() * 90000000);

        // Check if the generated userId already exists in the database
        const existingUser = await userModel.findOne({ userId });

        // If not found, set isUnique to true to break out of the loop
        isUnique = !existingUser;
    }

    return userId;
};

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        // Check if any of the required fields are missing
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        // Check if the email already exists
        const existingUserByEmail = await userModel.findOne({ email });

        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a unique numeric user ID
        const userId = await generateUserId();

        const newUser = new userModel({
            userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Error registering user' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Find the user by email
        const user = await userModel.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ success: false, message: 'Email is not registered' });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }

        // If email and password are valid, generate a JWT token
        const token = jwt.sign({ userId: user.userId, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
        

        // Send the token in the response
        return res.json({ success: true, token });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { registerUser, loginUser };
