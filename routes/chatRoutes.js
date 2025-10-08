const express = require('express');
const { getMessages } = require('../controllers/chatController');
const { canAccessRoomFromRoute } = require('../utils/roomAccess');

const router = express.Router();

router.get('/messages/:roomId', async (req, res, next) => {
  const { roomId } = req.params;
  const allowed = await canAccessRoomFromRoute(req.chatUser, roomId);
  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return getMessages(req, res, next);
});

module.exports = router;
