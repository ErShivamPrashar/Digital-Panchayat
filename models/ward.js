const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,   
  },
  password: {
    type: String,
    required: true
  },
   ward: {
    type: Number,
    required: true
  }
},{timestamps:true});

const Ward = mongoose.model('Ward', wardSchema);

module.exports = Ward;
