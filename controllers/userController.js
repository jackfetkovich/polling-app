const express = require('express');
const User = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find();

		res.status(200).json({
			status: 'sucess',
			data: {
				users,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			message: e.message,
		});
	}
};

exports.getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).json({
			status: 'sucess',
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
