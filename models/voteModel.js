
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User',
  }
});


module.exports = voteSchema;