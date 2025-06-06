const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  contactNo: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  picture: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, 
}
);

module.exports = mongoose.model('Officer', officerSchema);
