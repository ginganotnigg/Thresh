/**
 * @typedef { import('socket.io').Namespace } Namespace
 */

const service = require('./test-process.service');

// Todo: extract candidateId from request

const candidateId = "C#0T001";

/**
 * @param {Namespace} namespace 
 */
module.exports = (namespace) => {
	namespace.on('connection', (socket) => {
		console.log(`Client connected: ${socket.id}`);

		socket.on('disconnect', () => {
			console.log(`Client disconnected: ${socket.id}`);
		});

		socket.on('register-process', async (testId) => {
			const attempt = await service.getOngoingTest(testId, candidateId);
			if (!attempt) {
				return;
			}
			await socket.join(attempt.ID);
		});

		service.onTestProcessEvaluated((attemptId) => {
			namespace.to(attemptId).emit('timeout');
			console.log(`Test process evaluated: ${attemptId}`);
		});

		service.onTestProcessSync((attemptId, timeLeft) => {
			namespace.to(attemptId).emit('sync', timeLeft);
			console.log(`Test process sync: ${attemptId}`);
		});
	})
}
