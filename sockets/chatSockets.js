const Message = require('../models/messageModel');

const getRoomId = (studentId, teacherId) => {
  return `room-${studentId}-${teacherId}`;
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('joinRoom', async ({ studentId, teacherId }) => {
      const roomId = getRoomId(studentId, teacherId);
      socket.join(roomId);

      const messages = await Message.findAll({
        where: { roomId },
        order: [['timestamp', 'ASC']]
      });

      socket.emit('messageHistory', messages);
    });

    socket.on('sendMessage', async ({ studentId, teacherId, message, sender }) => {
      const roomId = getRoomId(studentId, teacherId);

      console.log('Message incoming: ', message);
      
      const newMessage = await Message.create({
        studentId,
        teacherId,
        timestamp: new Date(),
        message,
        roomId,
        sender
      });

      io.to(roomId).emit('message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};