const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  municipalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Municipal',
    required: true,
  },
  penaltyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Penalty',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Violation', violationSchema);
