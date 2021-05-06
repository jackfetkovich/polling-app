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
		const poll = await Poll.find({ _id: req.params.id });
		poll[0].choices.forEach(choice => {
			if(choice._id == req.body.choice){
				choice.count += 1;
			}
		})
		
		const newPoll = await Poll.findByIdAndUpdate(req.params.id, poll[0], {new: true})
		
		res.status(201).json({
			status: 'sucess',
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
