const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.get('/', userController.getAllUsers );
router.get('/:id', userController.getUser);

module.exports = router;

