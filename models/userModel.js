const mongoose = require('mongoose');
const Filter = require('bad-words');
const bcrypt = require('bcryptjs');
const filter = new Filter();

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		min: [6, 'Username must be at least 6 characters long'],
		validate: {
			validator: function (username) {
				return !filter.isProfane(username);
			},
			message: 'Username cannot contain profanity',
		},
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function (email) {
				return /.+@[a-z]+\.(com|net|org|edu)/.test(email);
			},
			message: 'Invalid Email',
		},
	},
	password: {
		type: String,
		required: true,
		min: [8, 'Password must be at least 8 characters long'],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: true,
		validate: {
			validator: function (passwordConfirm) {
				return passwordConfirm === this.password;
			},
			message: 'Passwords do not match',
		},
	},
	passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;

	next();
});

userSchema.pre('save', function (next) {
	if (this.isModified('password')) {
		this.passwordChangedAt = Date.now() - 1000;
	}

	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	password
) {
	return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > JWTTimestamp;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
