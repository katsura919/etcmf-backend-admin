const mongoose = require('mongoose');

// Updated schema to use built-in timestamps
const penaltySchema = new mongoose.Schema({
  violationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Violation',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Penalty', penaltySchema);
