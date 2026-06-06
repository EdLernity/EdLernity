const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    tokenType:{ type: String, required: true,enum:["Password Reset","Create Account"] },
    expireAt: { type: Date, default: Date.now, index: { expires: '1h' } }
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
