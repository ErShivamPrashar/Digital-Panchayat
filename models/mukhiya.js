const mongoose = require('mongoose');

const mukhiyaSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,   
  },
  password: {
    type: String,
    required: true
  }
},{timestamps:true});

const Mukhiya = mongoose.model('Mukhiya', mukhiyaSchema);

module.exports = Mukhiya;
