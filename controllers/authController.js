const util = require('util');
const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	const user = await User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = signToken(user._id);

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	// Extracts username and password from request
	const { username, password } = req.body;

	// Makes sure that a username and password were both entered
	if (!username || !password) {
		return next(new AppError('Please enter username and password', 400));
	}

	// Find the user in database (make sure password comes with it for comparison)
	const user = await User.findOne({ username }).select('+password');

	// Make sure the user exists and their password is correct
	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect username or password', 401));
	}

	// If everything checks out, sign off on the token
	const token = signToken(user._id);

	//Send back the token
	res.status(200).json({
		status: 'success',
		token,
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}


	if(!token){
		return next(new AppError('You are not logged in. Please log in and try again', 403));
	}
	const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const freshUser = await User.findById(decoded.id);

	if(!freshUser){
		return next(new AppError('The user belonging to this token no longer exists. Please log in again', 400));
	}

	if(freshUser.changedPasswordAfter(decoded.iat)){
		return next(new AppError('User has changed password since token was issued. Please log in again', 400));
	}

	req.user = freshUser;

	next();

});
