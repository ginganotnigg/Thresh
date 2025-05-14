import http from "http";
import { ModuleBase } from "../library/cayduajs/module/module.base";
import { AttemptsModule } from "../modules/attempts/module";
import { Chuoi } from "../library/caychuoijs";
import { env } from "../configs/env";
import { AllExceptionFilter } from "../controller/defaults/all-exception.filter";
import { LoggerMiddleware } from "../controller/defaults/http-logger.mdw";
import { UserPipe } from "../controller/pipes/user.pipe";
import { securityDocument } from "../controller/documents/security";
import app from "./servers/app";
import io from "./servers/io";
import { ExamModule } from "../modules/exam/module";
import { PracticeModule } from "../modules/pratice/module";
import { DecoderMiddleware } from "../controller/defaults/decoder.mdw";

export async function main() {
	Chuoi.init(app, {
		basePath: '/api',
		title: "API",
		version: "1.0.0",
	});

	Chuoi.middleware(
		LoggerMiddleware,
		DecoderMiddleware,
		UserPipe,
	);

	// =====================
	// Modules
	// =====================

	const modules: ModuleBase[] = [
		new AttemptsModule(),
		new ExamModule(),
		new PracticeModule(),
	];
	for (const m of modules) {
		await m.initialize();
	}

	// =====================
	// Documentation
	// =====================

	if (env.endpointLogging) {
		Chuoi.logRouterStack((message, isWarning) => {
			if (isWarning) {
				console.warn(message);
			} else {
				console.log(`\x1b[32m ${message} \x1b[0m`);
			}
		});
	}

	if (env.restApiDocumentation) {
		Chuoi.generateApiDocumentation(securityDocument);
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

	return { socketServer, restServer };
}