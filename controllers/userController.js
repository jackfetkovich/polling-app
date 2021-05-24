const express = require('express');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		status: 'sucess',
		data: {
			users,
		},
	});
});

exports.getUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	res.status(200).json({
		status: 'sucess',
		data: {
			user,
		},
	});
});
