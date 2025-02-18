const express = require('express');
const testController = require('../controllers/test_controller');
const testProcessRouter = require('../modules/test-process/test-process.controller.rest');
const tryCatch = require('./helpers/error_handler');

const router = express.Router();

router.get('/:testId/attempts/page', tryCatch(testController.getTestDetails));
router.get('/:testId/attempts/data', tryCatch(testController.getTestAttempts));

router.use(testProcessRouter);

router.get('/attempts/:attemptId', tryCatch(testController.getAttemptPage));
router.get('/attempts/:attemptId/answers', tryCatch(testController.getAttemptDetails));

module.exports = router;