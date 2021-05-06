const express = require('express');
const pollController = require('../controllers/pollController')

const router = express.Router();

router.route('/').get(pollController.getPolls).post(pollController.createPoll);
router.route('/:id').get(pollController.getPoll).patch(pollController.respondToPoll);

module.exports = router;