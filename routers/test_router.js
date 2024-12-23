const express = require('express');
const testController = require('../controllers/test_controller');

const router = express.Router();

router.get('/list/page', testController.getSuggestedTags);
router.get('/list/data', testController.getFilteredTests);
router.get('/:testId/attempts/page', testController.getTestDetails);
router.get('/:testId/attempts/data', testController.getTestAttempts);
router.get('/:testId/answers/:attemptId/page', testController.getAttemptPage);
router.get('/:testId/answers/:attemptId/data', testController.getAttemptDetails);
router.get('/:testId/do/page', testController.getQuestions);
router.post('/:testId/do/submit', testController.submitTest);

router.post('/create', testController.createTest);
router.put('/:testId/edit/detail', testController.updateTest);
router.delete('/:testId', testController.deleteTest);
router.post('/:testId/create/question', testController.createQuestion);
router.put('/:testId/edit/question/:questionId', testController.updateQuestion);
router.delete('/:testId/question/:questionId', testController.deleteQuestion);
router.get('/:testId/submission/page', testController.getAllAttempts);
router.get('/:testId/submission/overview', testController.getTestById);
router.get('/:candidateId/submission/detail', testController.getCandidateAttempts);
router.get('/:testId/question', testController.getQuestions);

module.exports = router;