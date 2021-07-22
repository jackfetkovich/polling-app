const mongoose = require('mongoose');
const choiceSchema = require('./choiceModel');
const Filter = require('bad-words');
const filter = new Filter();

const pollSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'A poll must have a title'],
	},
	choices: [choiceSchema],
});

pollSchema.pre('save', function (next) {
	this.title = filter.clean(this.title);
	this.choices.forEach(choice => {
		choice.text = filter.clean(choice.text);
	});

	next();
});

// Make sure user hasn't voted in poll yet. If they have,
// remove their vote from their previous choice
pollSchema.methods.removePreviousVotes = function (id) {
	this.choices.forEach(choice => {
		choice.votes.forEach(vote => {
			if (vote.user == id) {
				vote.remove();
			}
		});
	});
};

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
