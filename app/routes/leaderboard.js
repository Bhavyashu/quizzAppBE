const express = require('express');
const router = express.Router();
const _controller = require('../controllers/leaderboard.js');
const { verifyAccessToken } = require('../middlewares/auth.js');

router.get('/global',verifyAccessToken ,_controller.globalBoard);
router.get('/language',verifyAccessToken, _controller.languageBoard);

module.exports = router;