const express = require('express');
const testController = require('../controllers/test_controller');
const tryCatch = require('./helpers/error_handler');

const router = express.Router();

router.get('/tests/list/page', tryCatch(testController.getSuggestedTags));
router.get('/tests/list/data', tryCatch(testController.getFilteredTests));

// Add full routes for demo purposes
router.get('/tests/:testId/attempts/page', tryCatch(testController.getTestDetails));
router.get('/tests/:testId/attempts/data', tryCatch(testController.getTestAttempts));
router.get('/tests/:testId/answers/:attemptId/page', tryCatch(testController.getAttemptPage));
router.get('/tests/:testId/answers/:attemptId/data', tryCatch(testController.getAttemptDetails));
router.get('/tests/:testId/do/page', tryCatch(testController.getQuestions));
router.post('/tests/:testId/do/submit', tryCatch(testController.submitTest));
router.post('/tests/create', tryCatch(testController.createTest));
router.put('/tests/:testId/edit/detail', tryCatch(testController.updateTest));
router.delete('/tests/:testId', tryCatch(testController.deleteTest));
router.post('/tests/:testId/create/question', tryCatch(testController.createQuestion));
router.put('/tests/:testId/edit/question', tryCatch(testController.updateQuestion));
router.delete('/tests/:testId/question/:questionId', tryCatch(testController.deleteQuestion));
router.get('/tests/:testId/submission/page', tryCatch(testController.getAllAttempts));
router.get('/tests/:testId/submission/overview', tryCatch(testController.getTestById));
router.get('/tests/:candidateId/submission/:attemptId/detail', tryCatch(testController.getCandidateAttempts));
router.get('/tests/:testId/question', tryCatch(testController.getQuestions));

module.exports = router;