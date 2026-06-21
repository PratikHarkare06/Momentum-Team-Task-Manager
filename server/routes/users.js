const express = require('express');
const router = express.Router();
const { getUsers, inviteUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// GET /api/users — returns all users for team management
router.get('/', protect, getUsers);
// POST /api/users/invite — invites a new member and emits websocket event
router.post('/invite', protect, inviteUser);

module.exports = router;
