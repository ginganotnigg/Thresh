/**
 * @typedef { import('socket.io').Namespace } Namespace
 */

const service = require('./test-process.service');
const { socketErrorHandler } = require('../../servers/helpers/handle-error');

async function getCurrentAttempt(data) {
	const { testId, candidateId } = data;
	return await service.getCurrentTestProcess(testId, candidateId);
}

async function startNewTest(data) {
	const { testId, candidateId } = data;
	return await service.startNewTestProcess(testId, candidateId);
}

async function answerQuestion(data) {
	const { testId, candidateId, questionId, optionId } = data;
	return await service.answerQuestion(testId, candidateId, questionId, optionId);
}

async function submit(data) {
	const { testId, candidateId } = data;
	return await service.evaluateTestProcess(testId, candidateId);
}

/**
 * @param {Namespace} namespace 
 */
module.exports = (namespace) => {
	namespace.on('connection', (socket) => {
		console.log(`Client connected: ${socket.id}`);

		socket.on('disconnect', () => {
			console.log(`Client disconnected: ${socket.id}`);
		});

		socket.on('current', socketErrorHandler(getCurrentAttempt));
		socket.on('new', socketErrorHandler(startNewTest));
		socket.on('answer', socketErrorHandler(answerQuestion));
		socket.on('submit', socketErrorHandler(submit));
	})
}
