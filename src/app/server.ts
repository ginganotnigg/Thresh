import express, { json, Router, Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { ErrorHandlerMiddleware } from "../common/controller/middlewares/errors/error.handler";
import { ProcessModule } from "../modules/process/process.module";
import { ManageModule } from "../modules/manage/manage.module";
import { ModuleBase } from "../common/module/module.base";
import { HistoryModule } from "../modules/history/history.module";

export function configApplication() {
	const app = express();

	// =====================
	// Configurations
	// =====================

	app.use(cors({
		origin: process.env.CORS_ORIGIN || '*',
	}));
	app.use(json());

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
	modules.forEach(async (module) => {
		await module.initialize();
	});

	// =====================
	// Error handler
	// =====================

	const errorHandler = new ErrorHandlerMiddleware();
	router.use((err: any, req: Request, res: Response, next: NextFunction) => { errorHandler.handle(err, req, res, next); });

	return server;
}