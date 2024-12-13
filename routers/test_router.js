const express = require('express');
const testController = require('../controllers/test_controller');

const router = express.Router();

router.get('/list', testController.getTests);
router.get('/get/:id', testController.getTestById);
router.post('/', testController.createTest);
router.put('/:id', testController.updateTest);
router.delete('/:id', testController.deleteTest);
router.get('/versions/:id', testController.getTestVersions);
router.get('/attempts/:id', testController.getTestAttempts);
router.post('/submit/:id', testController.submitTest);

module.exports = router;