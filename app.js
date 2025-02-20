// @ts-check

require("dotenv").config();
const sequelize = require("./utils/database/database");
require('./utils/database/association')();
const cors = require('cors');
const express = require("express");
const http = require("http");
const { childRouterFactory } = require("./utils/factory/router.factory");
// const winston = require('winston');

const PORT = process.env.PORT || 8080;

const promiseSequelize = sequelize
	.sync({ alter: true })
	.then(() => {
		console.log("Sequelize synchronized!");
	})
	.catch((err) => {
		console.error("Unable to create tables, shutting down...", err);
		process.exit(1);
	});

// Configure winston logger
// const logger = winston.createLogger({
//   level: 'error',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'error.log' })
//   ]
// });


// Start the server when all promises are resolved
const app = express();
const httpServer = http.createServer(app);

Promise.allSettled([
	promiseSequelize
]).then(() => {
	app.use(cors({
		origin: process.env.CORS_ORIGIN || '*',
	}));
	const apiRouter = require("./servers/rest")(app);
	const ioServer = require("./servers/socket")(httpServer);

	// Modules integration
	// Show all routes and paths for easy management
	require("./modules/test-process/module")(apiRouter, ioServer.of("/test-process"));
}).then(() => {
	httpServer.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}).catch((err) => {
	console.error(err);
	console.error("Unable to start server, shutting down...");
	process.exit(1);
});
