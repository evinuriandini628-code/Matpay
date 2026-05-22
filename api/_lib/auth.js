const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'matpay-secret-key-change-in-production';

function verifyToken(req) {
  const authHeader = req.headers.authorization || req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { verifyToken, signToken, JWT_SECRET };
