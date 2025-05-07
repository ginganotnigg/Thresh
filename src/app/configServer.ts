import express, { json, Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import { CurrentModule } from "../modules/current/current.module";
import { PracticeModule } from "../modules/pratice/module";
import { ModuleBase } from "../library/cayduajs/module/module.base";
import { HistoryModule } from "../modules/attempt/module";
import { Chuoi } from "../library/caychuoijs";
import { env } from "../configs/env";
import { configSocket } from "./configSocket";
import { AllExceptionFilter } from "../controller/defaults/all-exception.filter";
import { LoggerMiddleware } from "../controller/defaults/http-logger.middleware";
import { UserPipe } from "../controller/pipes/user.pipe";
import { securityDocument } from "../controller/documents/security";

export async function configServer() {
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
	// Socket IO
	// =====================

	const io = configSocket();

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
	// Modules
	// =====================

	const modules: ModuleBase[] = [
		new CurrentModule(io),
		new PracticeModule(),
		new HistoryModule(),
	];
	for (const m of modules) {
		await m.initialize();
	}

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
		Chuoi.doc(securityDocument);
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

	io.attach(socketServer);
	socketServer.listen(+env.socketPort, () => {
		console.log(`Socket server running on port: ${env.socketPort}`);
	});
	restServer.listen(+env.port, () => {
		console.log(`Rest server running on port: ${env.port}`);
	});


	return { socketServer, restServer, app };
}