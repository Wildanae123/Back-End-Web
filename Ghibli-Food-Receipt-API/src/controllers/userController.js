// src/controllers/userController.js
const { User } = require('../models'); // Make sure User model is imported

exports.getCurrentUserProfile = async (req, res, next) => {
  try {
    // The 'protect' middleware (once re-enabled and working) should have added 'req.user'
    if (!req.user || !req.user.id) {
      // This case should ideally be caught by 'protect' middleware first
      return res.status(401).json({ message: 'Not authorized, user data not found in request' });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'], // Exclude password
    });

    if (!user) {
      // This case handles if a token is valid but the user was somehow deleted from DB
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Your other placeholder functions (updateCurrentUserProfile, deleteCurrentUserAccount) remain for now
exports.updateCurrentUserProfile = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'updateCurrentUserProfile Not Implemented', userId: req.user?.id, data: req.body });
  } catch (error) {
    next(error);
  }
};

exports.deleteCurrentUserAccount = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'deleteCurrentUserAccount Not Implemented', userId: req.user?.id });
  } catch (error) {
    next(error);
  }
};