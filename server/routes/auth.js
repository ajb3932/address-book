const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { login, logout, verify } = require('../controllers/authController');

// Route to login
router.post('/login', login);

// Route to logout
router.post('/logout', auth, logout);

// Route to verify token
router.get('/verify', auth, verify);

module.exports = router;