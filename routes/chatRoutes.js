const express = require('express');
const { getMessages } = require('../controllers/chatController');

const router = express.Router();

// Route to get chat messages by room
router.get('/messages/:roomId', getMessages);

module.exports = router;
