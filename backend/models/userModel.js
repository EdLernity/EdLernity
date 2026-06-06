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
        default:""
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        default:""
    },
    password: {
        type: String,
    },
    isGoogleAuth:{
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
