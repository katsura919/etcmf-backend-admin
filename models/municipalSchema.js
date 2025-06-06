const mongoose = require('mongoose');


const schema = new mongoose.Schema({
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


const Municipal = mongoose.model('Municipal', schema);

module.exports = Municipal;
