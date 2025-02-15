const express = require('express');
const testController = require('../controllers/test_controller');
const tryCatch = require('./helpers/error_handler');

const router = express.Router();

router.get('/:testId/attempts/page', tryCatch(testController.getTestDetails));
router.get('/:testId/attempts/data', tryCatch(testController.getTestAttempts));
router.get('/attempts/:attemptId', tryCatch(testController.getAttemptPage));
router.get('/attempts/:attemptId/answers', tryCatch(testController.getAttemptDetails));
router.get('/:testId/do/page', tryCatch(testController.getQuestions));
router.post('/:testId/do/submit', tryCatch(testController.submitTest));

module.exports = router;