const mongoose = require('mongoose');

const trafficViolationSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  violationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Violation',
    required: true,
  }
});

module.exports = mongoose.model('TrafficViolation', trafficViolationSchema);
