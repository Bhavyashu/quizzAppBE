const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middlewares/auth');
const { verifyUser } = require('../middlewares/utils');
// Import user controller
const _controller = require('../controllers/user');

// User registration route
router.post('/register',verifyUser, _controller.register);

// User login route
router.post('/login', _controller.login);

// User profile route (protected by JWT)
router.get('/profile', verifyAccessToken, _controller.profile);
router.post('/addLanguage', verifyAccessToken, _controller.addLanguage);

module.exports = router;
