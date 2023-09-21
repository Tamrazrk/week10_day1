const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/question/:id', quizController.getQuestion);
router.post('/check-answer/:id', quizController.checkAnswer);

module.exports = router;
