const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  
  name: {
    type: String,
    
  },
   role: {
    type: String,
   
  },
  email: {
    type: String,
     
  },

  Heading: {
    type: String,
    required: true, 
  },
   message: {
    type: String,
    required: true, 
  },


},{timestamps:true});

const Share = mongoose.model('Share', shareSchema);

module.exports = Share;
