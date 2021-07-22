const mongoose = require('mongoose');
const voteSchema = require('./voteModel.js');
const choiceSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
  votes: [voteSchema]
});

module.exports = choiceSchema;