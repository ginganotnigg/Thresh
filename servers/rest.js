/** 
 * @typedef {import('express').Express} Express
 */

const express = require('express');
const Routers = require("../routers/main_router.js");

/**
 * @param {Express} app 
 */
module.exports = (app) => {

	// Json parser
	app.use(express.json());

	// API routes
	app.get('/ping', (req, res) => { res.send('pong'); });
	app.use('/api', Routers);

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
}