import express, { json, Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { ProcessModule } from "../modules/current/process.module";
import { ManageModule } from "../modules/manage/manage.module";
import { ModuleBase } from "../library/cayduajs/module/module.base";
import { HistoryModule } from "../modules/history/history.module";
import { Chuoi } from "../library/caychuoijs";
import { AllExceptionFilter } from "../common/controller/defaults/all-exception.filter";
import { LoggerMiddleware } from "../common/controller/defaults/logger.middleware";
import { UserPipe } from "../common/controller/pipes/user.pipe";
import { TagsModule } from "../modules/tags/tags.module";
import { env } from "./env";

export async function configApplication() {
	// =====================
	// Environment
	// =====================

	for (const key in env) {
		if (env.hasOwnProperty(key)) {
			console.log(`${key}: ${env[key as keyof typeof env]}`);
		}
	}

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
	// Servers
	// =====================

	const ioServer = new Server({
		cors: {
			origin: env.corsOrigin,
		}
	});

	// =====================
	// Modules
	// =====================

	const modules: ModuleBase[] = [
		new TagsModule(),
		new ProcessModule(ioServer),
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

	// =====================
	// Server listen
	// =====================

	const socketServer = http.createServer(app);
	const restServer = http.createServer(app);

	ioServer.attach(socketServer);
	socketServer.listen(+env.socketPort, () => {
		console.log(`Socket server running on port: ${env.socketPort}`);
	});
	restServer.listen(+env.port, () => {
		console.log(`Rest server running on port: ${env.port}`);
	});

	// =====================
	// Documentation
	// =====================

	if (env.endpointLogging) {
		Chuoi.log((message, isWarning) => {
			if (isWarning) {
				console.warn(message);
			} else {
				console.log(`\x1b[32m ${message} \x1b[0m`);
			}
		});
	}

	if (env.restApiDocumentation) {
		Chuoi.doc();
	}

	return { socketServer, app };
}