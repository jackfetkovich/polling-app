const mongoose = require('mongoose');
const Filter = require('bad-words');
const filter = new Filter();

const choiceSchema = new mongoose.Schema({
  text: {
    type: String, 
    required: [true, 'An answer choice must contain text']
  },
  count: {
    type: Number,
    default: 0
  }
})

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A poll must have a title']
  },
  choices: [choiceSchema]
});

pollSchema.pre('save', function(next){
  this.title = filter.clean(this.title);
  this.choices.forEach(choice => {
    choice.text = filter.clean(choice.text);
  });

  next();
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;

