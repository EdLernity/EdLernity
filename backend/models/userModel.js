const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: Number,
        unique: true,
    },
    password: {
        type: String,
    },
    googleAuth:{
        type: Boolean,
    default: false,
    },
    isVerified:{
        type: Boolean,
    default: false,
    },
    IsBlocked:{
        type:Boolean,
        default:false
      },
},{timestamps:true});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
