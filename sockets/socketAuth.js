const { verifyPrimaryToken } = require('../utils/verifyPrimaryToken');

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;
  const payload = verifyPrimaryToken(token);

  if (!payload) {
    return next(new Error('Invalid token'));
  }

  socket.data.user = payload;
  return next();
};

module.exports = { authenticateSocket };

