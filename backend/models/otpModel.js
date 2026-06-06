const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 5 }, // Code expires after 5 minutes (300 seconds)
  used: {type: Boolean, default:false},
});

const otpModel = mongoose.model('verification', otpSchema);

module.exports = otpModel;
 