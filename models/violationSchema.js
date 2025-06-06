const mongoose = require('mongoose');

// Updated schema to use built-in timestamps
const violationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Violation', violationSchema);
