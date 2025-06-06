const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  officerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Officer',
    required: true,
  },
  trafficViolationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrafficViolation',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Dismissed'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
