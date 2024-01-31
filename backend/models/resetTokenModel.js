const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
    userId: {type: String},
    email: { type: String, require: true },
    token: { type: String,  require: true },
    expires: {type: String ,required: true},
    verified: {type: Boolean}
})

const ResetToken = mongoose.model("ResetToken",resetTokenSchema);
module.exports= ResetToken;