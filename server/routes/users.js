const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// GET /api/users — returns all users for team management
router.get('/', protect, getUsers);

module.exports = router;
