const express = require('express');
const {
    createTest,
    deleteTest,
    updateTest,
    getTestById,
    getTestVersions,
    getTests,
    submitTest,
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} = require('../controllers/main_controller');

const router = express.Router();

// Test routes
router.post('/test/create', createTest);
router.post('/test/delete/:id', deleteTest);
router.post('/test/update/:id', updateTest);
router.get('/test/get/:id', getTestById);
router.get('/test/version/:id', getTestVersions);
router.get('/test/list', getTests);
router.post('/test/submit', submitTest);

// Question routes
router.get('/question/list/:id', getQuestions);
router.post('/question/create', createQuestion);
router.post('/question/update/:id', updateQuestion);
router.post('/question/delete/:id', deleteQuestion);

module.exports = router;
