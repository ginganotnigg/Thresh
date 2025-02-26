import express, { json, Router, Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { ErrorHandlerMiddleware } from "../common/controller/middlewares/errors/error.handler";
import { ProcessModule } from "../modules/process/process.module";
import { ManageModule } from "../modules/manage/manage.module";
import { ModuleBase } from "../common/module/module.base";
import { HistoryModule } from "../modules/history/history.module";
import swaggerMiddleware from "../configs/swagger/mdw";
import { configGlobalRouterAfter as configGlobalMdwAfter, configGlobalRouterBefore } from "./config-global.mdw";

export async function configApplication() {
	const app = express();

	// =====================
	// Before Middlewares
	// =====================

	configGlobalRouterBefore(app);

	// =====================
	// Routes
	// =====================

	const router = Router();
	app.get('/ping', (req, res) => { res.send('server is alive'); });
	app.use('/api', router);

	// =====================
	// Socket.io
	// =====================

	const server = http.createServer(app);
	const io = new Server(server, {
		cors: {
			origin: process.env.CORS_ORIGIN || '*',
		}
	});

	// =====================
	// Modules
	// =====================

	const modules: ModuleBase[] = [
		new ProcessModule(router, io.of('/process')),
		new ManageModule(router),
		new HistoryModule(router)
	];
	for (const m of modules) {
		await m.initialize();
	}

	// =====================
	// After Middlewares
	// =====================

	configGlobalMdwAfter(app);

	// =====================
	// Under testing
	// =====================

	swaggerMiddleware(app);

	return server;
}