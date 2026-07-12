const mongoose = require('mongoose');

// Define the Transaction schema
const transactionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Online'],
    required: true
  },
  paymentId:{
    type:String,
    required: true
  },
  amount:{
    type:String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  subscribedAllCourse:{
    type: Boolean,
    default: false
  },
  internshipSlug: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  }
});

// Create a Transaction model from the schema
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
