const express = require('express');
const testController = require('../controllers/test_controller');
const tryCatch = require('./helpers/error_handler');

const router = express.Router();

router.post('/create', tryCatch(testController.createTest));
router.put('/:testId/edit/detail', tryCatch(testController.updateTest));
router.delete('/:testId', tryCatch(testController.deleteTest));
router.post('/:testId/create/question', tryCatch(testController.createQuestion));
router.put('/:testId/edit/question', tryCatch(testController.updateQuestion));
router.delete('/:testId/question/:questionId', tryCatch(testController.deleteQuestion));
router.get('/:testId/submission/page', tryCatch(testController.getAllAttempts));
router.get('/:testId/submission/overview', tryCatch(testController.getTestById));
router.get('/:candidateId/submission/:attemptId/detail', tryCatch(testController.getCandidateAttempts));
router.get('/:testId/question', tryCatch(testController.getQuestions));

module.exports = router;