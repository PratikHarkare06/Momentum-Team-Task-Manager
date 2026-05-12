const express = require('express');
const router = express.Router();
const { signup, login, getMe, getUsers, firebaseAuth } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/firebase', firebaseAuth);  // Firebase token exchange

// Protected routes
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

module.exports = router;
