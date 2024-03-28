const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the certificate
const certificateSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required:true,
  },
  uuid: {
    type: String,
    uniqe:true,
    required: true
  }
},{timestamps:true});

// Create a model using the schema
const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
