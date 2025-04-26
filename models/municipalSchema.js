const mongoose = require('mongoose');


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
  timestamps: true, 
});


const Municipal = mongoose.model('Municipal', municipalSchema);

module.exports = Municipal;
