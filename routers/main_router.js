const express = require('express');
const { getTests, getTestById, submitTest, getTestVersions } = require('../controllers/main_controller.js');

const router = express.Router();

router.get('/list', getTests);
router.get('/get/:id', getTestById);
router.post('/submit/:id', submitTest);
router.get('/version/:id', getTestVersions);

module.exports = router;