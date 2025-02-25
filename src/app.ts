import { config } from "dotenv";
config();
import cors from "cors";
import express from "express";
import http from "http";
import syncSequelize from "./configs/sequelize/init";

const PORT = process.env.PORT || 8080;

// Start the server when all promises are resolved
const app = express();
const httpServer = http.createServer(app);

Promise.allSettled([
	syncSequelize()
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
