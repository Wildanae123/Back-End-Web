// src/routes/authRoutes.js
const express = require('express');
const { register, login, guestLogin, logout } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/validationMiddleware'); // Import validation middleware

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/guest/login', guestLogin);
router.post('/logout', logout);

module.exports = router;