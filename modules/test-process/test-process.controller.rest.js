// @ts-check

/**
 * @typedef {import('express').Router} Router
 */

const { tryCatchRouterWarpper: tryCatchRouterFactory } = require('../../utils/factory/router.factory');

const candidateId = "C#0T001";

/**
 * @param {Router} router 
 * @param {import('./commands/command')} command 
 * @param {import('./queries/query')} query 
 */
function controller(router, command, query) {
	tryCatchRouterFactory(router, "get", '/tests/:testId/current', async (req, res, next) => {
		const { testId } = req.params;
		const current = await query.getInProgressAttemptSmall(testId, candidateId);
		return res.json(current);
	});

	tryCatchRouterFactory(router, "post", '/tests/:testId/current/new', async (req, res, next) => {
		const { testId } = req.params;
		await command.startNew(testId, candidateId);
		return res.status(201).end();
	});

	tryCatchRouterFactory(router, "get", '/tests/:testId/current/do', async (req, res, next) => {
		const { testId } = req.params;
		const attemptDetail = await query.getInProgressAttemptToDo(testId, candidateId);
		return res.json(attemptDetail);
	});

	tryCatchRouterFactory(router, "post", '/tests/:testId/current/answer', async (req, res, next) => {
		const { testId } = req.params;
		const { questionId, optionId } = req.body;
		await command.answer({ testId, questionId, optionId }, candidateId);
		return res.status(201).end();
	});

	tryCatchRouterFactory(router, "post", '/tests/:testId/current/submit', async (req, res, next) => {
		const { testId } = req.params;
		await command.submit(testId, candidateId);
		return res.status(201).end();
	});
}

module.exports = controller;