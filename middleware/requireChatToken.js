const { verifyPrimaryToken } = require('../utils/verifyPrimaryToken');

const requireAuthenticatedUser = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  const payload = verifyPrimaryToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Invalid or missing token' });
  }

  req.chatUser = payload;
  return next();
};

module.exports = { requireAuthenticatedUser };

