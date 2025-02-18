const tryCatch = require('../../routers/helpers/error_handler');
const service = require('./test-process.service');

// Todo: extract candidateId from request
const candidateId = "C#0T001";

// TestAttempt

async function getOngoingTest(req, res) {
	const { testId } = req.params;
	const current = await service.getOngoingTest(testId, candidateId);
	return res.json(current);
}

async function postStartNew(req, res) {
	const { testId } = req.params;
	await service.startNew(testId, candidateId);
	return res.status(201).end();
}

// TestDo

async function getOngoingTestToDo(req, res) {
	const { testId } = req.params;
	const attemptDetail = await service.getOngoingTestToDo(testId, candidateId);
	return res.json(attemptDetail);
}

async function postSubmit(req, res) {
	const { testId } = req.params;
	const { answers } = req.body;
	await service.submit(testId, candidateId, answers);
	return res.status(201).end();
}

const router = require('express').Router();

router.get('/:testId/current/', tryCatch(getOngoingTest));
router.post('/:testId/current/new', tryCatch(postStartNew));
router.get('/:testId/current/do', tryCatch(getOngoingTestToDo));
router.post('/:testId/current/submit', tryCatch(postSubmit));

module.exports = router;