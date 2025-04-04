const mongoose = require('mongoose');

// Define the Municipal Schema
const municipalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the Municipal Model
const Municipal = mongoose.model('Municipal', municipalSchema);

module.exports = Municipal;
