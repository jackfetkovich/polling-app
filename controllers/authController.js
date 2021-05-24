const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = async (req, res, next) => {
	try {
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
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			message: e.message,
		});
	}
};
