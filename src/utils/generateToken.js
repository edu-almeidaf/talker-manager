const createToken = require('crypto-token');

const generateToken = () => {
  const token = createToken(16);
  return token;
};

module.exports = generateToken;