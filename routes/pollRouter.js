const express = require('express');
const pollController = require('../controllers/pollController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(pollController.getPolls).post(authController.protect ,pollController.createPoll);
router.route('/:id').get(pollController.getPoll).patch(authController.protect, pollController.respondToPoll);

module.exports = router;