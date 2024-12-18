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

router.post('/', testController.createTest);
router.put('/:testId', testController.updateTest);
router.delete('/:testId', testController.deleteTest);
router.get('/versions/:testId', testController.getTestVersions);

module.exports = router;