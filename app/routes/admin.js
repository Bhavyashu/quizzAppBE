const express = require('express');
const router = express.Router();
const _controller = require('../controllers/admin');

router.get('/getLanguages', _controller.getLanguages);
router.get('/getExercises', _controller.getExercises);
router.get('/getQuestions', _controller.getQuestions);
router.post('/addLanguage',_controller.addLanguages);
router.post('/addExercise',_controller.addExercises);
router.post('/addQuestions',_controller.addQuestions);
module.exports = router;