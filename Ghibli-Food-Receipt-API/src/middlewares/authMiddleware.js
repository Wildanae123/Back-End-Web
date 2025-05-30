// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

// Define cookie options for clearing, mirroring how they are set
// This ensures the browser correctly identifies the cookie to clear
const cookieOptionsForClearing = {
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: 'strict',
  path: '/api/v1', // Must match the 'path' used when setting the cookie
};

exports.protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!req.user) {
      res.clearCookie('token', cookieOptionsForClearing);
      return res.status(401).json({ message: 'Not authorized, user for this token no longer exists' });
    }
    next();
  } catch (error) {
    console.error('Authentication error in protect middleware:', error.name, error.message);
    res.clearCookie('token', cookieOptionsForClearing);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized, token failed (invalid signature)' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token verification failed' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};