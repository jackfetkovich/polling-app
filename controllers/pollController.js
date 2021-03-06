const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/pollModel');
const catchAsync = require('../utils/catchAsync');

exports.getPolls = async (req, res, next) => {
	try {
		const polls = await Poll.find();

		res.status(200).json({
			status: 'success',
			data: {
				polls,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			error: e,
		});
	}
};

exports.createPoll = async (req, res, next) => {
	try {
		const newPoll = await Poll.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				newPoll,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			error: e,
		});
	}
};

exports.getPoll = async (req, res, next) => {
	try {
		const poll = await Poll.find({ _id: req.params.id });
		res.status(200).json({
			status: 'success',
			data: {
				poll,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			error: e,
		});
	}
};

exports.respondToPoll = catchAsync(async (req, res, next) => {
	
		const { choice } = req.body;
		const poll = await Poll.findById(req.params.id);
		poll.removePreviousVotes(req.user.id);
		poll.choices.id(choice).votes.push({ user: req.user.id });
		await poll.save();
		
		res.status(200).json({
			status: 'success',
			data: {
				poll,
			},
		});

});
