const express = require('express');
const testController = require('../controllers/test_controller');
const tryCatch = require('./helpers/error_handler');
const moduleConfig = require('../modules/test-process/module');

const router = express.Router();

router.get('/tests/:testId/attempts/page', tryCatch(testController.getTestDetails));
router.get('/tests/:testId/attempts/data', tryCatch(testController.getTestAttempts));
router.get('/tests/attempts/:attemptId', tryCatch(testController.getAttemptPage));
router.get('/tests/attempts/:attemptId/answers', tryCatch(testController.getAttemptDetails));

module.exports = router;