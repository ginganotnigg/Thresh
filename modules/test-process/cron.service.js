const cron = require('node-cron');
const TestEvaluationService = require('./test-process.service');

// Run every minute
cron.schedule('* * * * *', async () => {
	await TestEvaluationService.evaluateTestProcess();
});