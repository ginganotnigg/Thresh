const express = require('express');
const testController = require('../controllers/test_controller');
const tryCatch = require('./helpers/error_handler');

const router = express.Router();

router.get('/list/page', tryCatch(testController.getSuggestedTags));
router.get('/list/data', tryCatch(testController.getFilteredTests));

// Add full routes for demo purposes
router.get('/:testId/attempts/page', tryCatch(testController.getTestDetails));
router.get('/:testId/attempts/data', tryCatch(testController.getTestAttempts));
router.get('/:testId/answers/:attemptId/page', tryCatch(testController.getAttemptPage));
router.get('/:testId/answers/:attemptId/data', tryCatch(testController.getAttemptDetails));
router.get('/:testId/do/page', tryCatch(testController.getQuestions));
router.post('/:testId/do/submit', tryCatch(testController.submitTest));
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