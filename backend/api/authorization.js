const express = require('express');
const router = express.Router();
const { register, login, logout } = require('./auth.controller');
const authMiddleware = require('../Mid/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', authMiddleware.authenticateUser, (req, res) => {
  res.status(200).json({ isAuthenticated: true, user: req.user });
});

module.exports = router;