const mongoose = require('mongoose');
const voteSchema = require('./voteModel.js');
const choiceSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		votes: [voteSchema],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

choiceSchema.virtual('numVotes').get(function () {
	return this.votes.length;
});

module.exports = choiceSchema;
