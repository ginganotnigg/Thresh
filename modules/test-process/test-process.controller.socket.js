// @ts-check

/**
 * @typedef { import('socket.io').Namespace } Namespace
 */

// Todo: extract candidateId from request
const candidateId = "C#0T001";

/**
 * @param {Namespace} namespace
 * @param {import('./commands/command')} command 
 * @param {import('./queries/query')} query 
 */
function controller(namespace, command, query) {
	namespace.on('connection', (socket) => {
		console.log(`Client connected: ${socket.id}`);

		socket.on('disconnect', () => {
			console.log(`Client disconnected: ${socket.id}`);
		});

		// Client side

		socket.on('register', async (testId) => {
			const inprogressAttempt = await query.getInProgressAttemptSmall(testId, candidateId);
			if (inprogressAttempt == null) {
				return;
			}
			await socket.join(inprogressAttempt.ID);
		});
	});

	// Server side

	command.onTestProcessEvaluated = (attemptId) => {
		namespace.to(attemptId).emit('timeout');
		console.log(`Test process evaluated: ${attemptId}`);
	}

	command.onTestProcessSyncTime = (attemptId, timeLeft) => {
		namespace.to(attemptId).emit('sync', timeLeft);
		console.log(`Test process sync: ${attemptId} - ${timeLeft}`);
	}

	command.onTestProcessAnswered = (attemptId, choices) => {
		namespace.to(attemptId).emit('answered', choices);
		console.log(`Test process answered: ${attemptId} - ${choices}`);
	}
}

module.exports = controller;