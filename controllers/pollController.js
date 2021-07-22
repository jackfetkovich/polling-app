const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/pollModel');

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

exports.respondToPoll = async (req, res, next) => {
	try {
		console.log('hit func');
		const { user, choice } = req.body;
		const poll = await Poll.findById(req.params.id);
		console.log('Found Poll');

		poll.choices.id(choice).votes.push({ user });
		console.log('pushed choice');

		await poll.save();
		console.log('saved');

		res.status(200).json({
			status: 'success',
			data: {
				poll,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
			error: e.message,
		});
	}
};
