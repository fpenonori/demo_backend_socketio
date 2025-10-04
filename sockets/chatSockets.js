const Message = require('../models/messageModel');
const { canAccessRoom, extractUserId } = require('../utils/roomAccess');

const getRoomId = (studentId, teacherId) => `room-${studentId}-${teacherId}`;

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected', extractUserId(socket.data.user));

    socket.on('joinRoom', async ({ studentId, teacherId }) => {
      if (!canAccessRoom(socket.data.user, studentId, teacherId)) {
        return socket.emit('error', { message: 'Unauthorized room join' });
      }

      const roomId = getRoomId(studentId, teacherId);
      socket.join(roomId);

      const messages = await Message.findAll({
        where: { roomId },
        order: [['timestamp', 'ASC']],
      });

      socket.emit('messageHistory', messages);
    });

    socket.on('sendMessage', async ({ studentId, teacherId, message }) => {
      if (!canAccessRoom(socket.data.user, studentId, teacherId)) {
        return socket.emit('error', { message: 'Unauthorized room message' });
      }

      if (!message || !message.trim()) {
        return;
      }

      const roomId = getRoomId(studentId, teacherId);

      const newMessage = await Message.create({
        studentId,
        teacherId,
        timestamp: new Date(),
        message,
        roomId,
        sender: extractUserId(socket.data.user),
      });

      io.to(roomId).emit('message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', extractUserId(socket.data.user));
    });
  });
};

