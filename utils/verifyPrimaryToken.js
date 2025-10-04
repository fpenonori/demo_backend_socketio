const jwt = require('jsonwebtoken');

const loadVerificationOptions = () => {

  if (process.env.PRIMARY_JWT_SECRET) {
    return {
      key: process.env.PRIMARY_JWT_SECRET,
      options: {},
    };
  }

  return null;
};

const verifyPrimaryToken = (token) => {
  if (!token) {
    return null;
  }

  const verification = loadVerificationOptions();
  if (!verification) {
    console.warn('Primary token verification is not configured');
    return null;
  }

  try {
    const decoded = jwt.verify(token, verification.key, verification.options);
    return decoded;
  } catch (error) {
    console.error('Primary token verification failed', error);
    return null;
  }
};

module.exports = { verifyPrimaryToken };

