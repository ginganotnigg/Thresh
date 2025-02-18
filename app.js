require("dotenv").config();
const sequelize = require("./utils/database/database");
require('./utils/database/association')();
const cors = require('cors');

const express = require("express");
const http = require("http");
const app = express();

// const winston = require('winston');

sequelize
	.sync({ alter: true }) // Set force: true to drop and recreate tables on every sync
	// .sync({ force: true }) // Set force: true to drop and recreate tables on every sync
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

app.use(cors({
	origin: process.env.CORS_ORIGIN || '*',
}));

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8080;

require("./servers/rest")(app);
require("./servers/socket")(httpServer);

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});