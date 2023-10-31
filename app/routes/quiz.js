const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middlewares/auth');
const _controller = require('../controllers/quiz');

router.get('/languages', verifyAccessToken, _controller.getLanguages );
router.get('/exercises',verifyAccessToken, _controller.getExercises );
router.get('/question',verifyAccessToken, _controller.getQuestion );
router.post('/verifyAnswer', verifyAccessToken, _controller.verifyAns);

module.exports = router;
