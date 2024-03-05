const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,   
    },
    phone: {
        type: Number,
        required: true,
        
    },
    message: {
        type: String,
        required: true,
    },
});

const ContactModel = mongoose.model('Contact', ContactSchema);
module.exports = ContactModel;
