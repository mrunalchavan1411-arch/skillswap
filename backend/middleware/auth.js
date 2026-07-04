// middleware/auth.js
// Yeh middleware har protected route pe check karta hai ki valid login token hai ya nahi

const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  // Header se token nikalte hain: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer xxxx" se xxxx nikalna

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user ki info request me attach kar dete hain
    next(); // age badho
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

module.exports = authMiddleware;
