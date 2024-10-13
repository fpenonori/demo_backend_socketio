const Message = require('../models/messageModel');

// Utility function to create a unique room ID
const getRoomId = (studentId, teacherId) => {
  return `room-${studentId}-${teacherId}`;
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    // Join a room
    socket.on('joinRoom', async ({ studentId, teacherId }) => {
      const roomId = getRoomId(studentId, teacherId);
      socket.join(roomId);

      // Retrieve past messages and send them to the client
      const messages = await Message.findAll({
        where: { roomId },
        order: [['timestamp', 'ASC']]
      });

      socket.emit('messageHistory', messages);
    });

    // Send a message to the room
    socket.on('sendMessage', async ({ studentId, teacherId, message }) => {
      const roomId = getRoomId(studentId, teacherId);

      // Save the message in the database
      const newMessage = await Message.create({
        studentId,
        teacherId,
        message,
        roomId
      });

      // Broadcast the message to the room
      io.to(roomId).emit('message', newMessage.message);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
