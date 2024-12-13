const express = require('express');
const questionController = require('../controllers/question_controller');

const router = express.Router();

router.get('/:id', questionController.getQuestions); // Get questions by test ID
router.post('/', questionController.createQuestion); // Create a new question
router.put('/:id', questionController.updateQuestion); // Update an existing question
router.delete('/:id', questionController.deleteQuestion); // Delete a question

module.exports = router;
