/**
 * @typedef { import('socket.io').Namespace } Namespace
 */

const service = require('./test-process.service');
const { socketErrorHandler } = require('../../servers/helpers/handle-error');

async function startTest(data) {
	const { testId, candidateId } = data;
	await service.getTestProcess(testId, candidateId);
}

async function answerQuestion(data) {
	const { testId, candidateId, questionId, optionId } = data;
	await service.answerQuestion(testId, candidateId, questionId, optionId);
}

async function finishTest(data) {
	const { testId, candidateId } = data;
	await service.finishTest(testId, candidateId);
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

		socket.on('start', socketErrorHandler(startTest));
		socket.on('answer', socketErrorHandler(answerQuestion));
		socket.on('finish', socketErrorHandler(finishTest));
	})
}
