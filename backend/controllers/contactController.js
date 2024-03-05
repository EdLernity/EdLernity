const ContactModel = require('../models/contactModel');

// Controller function to handle user creation
const createUserContact = async (req, res) => {
    try {
        const { name, email, subject, phone, message } = req.body;

        // Create a new user instance
        const newUserContact = new ContactModel ({
            name,
            email,
            subject,
            phone,
            message,
        });

        // Save the user to the database
        const savedUserContact = await newUserContact.save();

        res.status(201).json(savedUserContact); // Respond with the saved user object
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get all users
const getUsersContact = async (req, res) => {
    try {
        const users = await ContactModel.find(); // Retrieve all users from the database
        res.status(200).json(users); // Respond with the array of users
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUserContact,
    getUsersContact
};
