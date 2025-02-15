require("dotenv").config();
const sequelize = require("./utils/database");

const express = require("express");
const http = require("http");
const app = express();

// const winston = require('winston');

sequelize
	.sync() // Set force: true to drop and recreate tables on every sync
	.then(() => {
		console.log("Database & tables created!");
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

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8080;

require("./servers/rest")(app);
require("./servers/socket")(httpServer);

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});