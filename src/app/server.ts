import express, { json, Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { ProcessModule } from "../modules/do/process.module";
import { ManageModule } from "../modules/manage/manage.module";
import { ModuleBase } from "../library/cayduajs/module/module.base";
import { HistoryModule } from "../modules/history/history.module";
import { Chuoi } from "../library/caychuoijs";
import { AllExceptionFilter } from "../common/controller/defaults/all-exception.filter";
import { LoggerMiddleware } from "../common/controller/defaults/logger.middleware";
import { UserPipe } from "../common/controller/pipes/user.pipe";
import { TagsModule } from "../modules/tags/tags.module";

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
	app.get('/ping', (req, res) => { res.send('server is alive'); });

	// =====================
	// Config Global Middlewares
	// =====================

	Chuoi.init(app, {
		basePath: '/api',
		title: "API",
		version: "1.0.0",
	});

	Chuoi.middleware(
		LoggerMiddleware,
		UserPipe,
	);

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
		new TagsModule(),
		new ProcessModule(io),
		new ManageModule(),
		new HistoryModule(),
	];
	for (const m of modules) {
		await m.initialize();
	}

	// =====================
	// Final
	// =====================

	Chuoi.final(AllExceptionFilter);
	Chuoi.log((message, isWarning) => {
		if (isWarning) {
			console.warn(message);
		} else {
			console.log(`\x1b[32m ${message} \x1b[0m`);
		}
	});

	Chuoi.doc();

	return server;
}