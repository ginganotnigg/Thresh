// @ts-check

/** 
 * @typedef {import('express').Express} Express
 * @typedef {import('express').Router} Router
 */

const express = require('express');
const Routers = require("../routers/main_router.js");

/**
 * @param {Express} app
 * @returns {Router}
 */
module.exports = (app) => {
	// Json parser
	app.use(express.json());

	const router = express.Router();
	router.get('/ping', (req, res) => { res.send('api pong'); });

	// API routes
	app.get('/ping', (req, res) => { res.send('app pong'); });
	app.use('/api', Routers);
	app.use('/api', router);

	// Error-handling middleware
	app.use((err, req, res, next) => {
		// Log the error using winston
		console.error({
			message: err.message,
			stack: err.stack,
			status: err.status || 500
		});

		// Set default error status and message
		const statusCode = err.status || 500;
		const message = err.message || 'Internal Server Error';

		// Respond to the client
		res.status(statusCode).json({
			success: false,
			error: message
		});
	});

	// 404 handler
	app.use((req, res) => {
		res.status(404).json({
			success: false,
			error: 'Not Found'
		});
	});

	console.log('REST server initialized');
	return router;
}