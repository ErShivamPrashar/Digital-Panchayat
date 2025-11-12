const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
 
  userId: {
    type: String, 
  },
  
  name: {
    type: String,
    required: true, 
  },
  
  email: {
    type: String,
    required: true,   
  },

  ward: {
    type: Number,
    required: true
  },

  problem: {
    type: String,
    required: true, 
  },

  village: {
    type: String,
    required: true, 
  },
    status: {
      type: String,
      enum: ["Pending", "accept", "inProcess", "closed"],
      default: "Pending",
    },
},{timestamps:true});

const Post = mongoose.model('Post', problemSchema);

module.exports = Post;
