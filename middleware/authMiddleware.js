const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

// Middleware xác thực token
exports.verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.user_id);
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Middleware kiểm tra role admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

// Middleware kiểm tra role user
exports.isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Forbidden: User access required' });
  }
  next();
};