const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const authenticateToken = (req, res, next) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
    return res.status(401).send({ message: 'Unauthorized: Token missing or invalid format' });
  }

  const token = authorizationHeader.split(' ')[1];

  jwt.verify(token, '9d9d667f8473686b29d597dd83c49195e886231d61b51bed0067db2780b2ef78', (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(403).send({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
