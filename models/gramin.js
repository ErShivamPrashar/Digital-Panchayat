const mongoose = require('mongoose');

const graminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,   
  },
   village: {
    type: String,
    required: true
  },
   ward: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},{timestamps:true});

const Gramin = mongoose.model('Gramin', graminSchema);

module.exports = Gramin;
