import express, { json, Router, Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { ProcessModule } from "../modules/do/process.module";
import { ManageModule } from "../modules/manage/manage.module";
import { ModuleBase } from "../library/cayduajs/module/module.base";
import { HistoryModule } from "../modules/history/history.module";
import swaggerMiddleware from "../configs/swagger/mdw";
import { configGlobalApp } from "./config-global-app";

export async function configApplication() {

	// =====================
	// Express
	// =====================

	const app = express();
	app.use(json());
	app.use(cors({ origin: "*" }));

	// Defaut headers
	app.use((req: Request, res: Response, next: NextFunction) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-role-id');
		next();
	});

	// =====================
	// Config Global Middlewares
	// =====================

	configGlobalApp(app);

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
		new ProcessModule(io),
		new ManageModule(),
		new HistoryModule()
	];
	for (const m of modules) {
		await m.initialize();
	}

	// =====================
	// Under testing
	// =====================

	swaggerMiddleware(app);

	return server;
}