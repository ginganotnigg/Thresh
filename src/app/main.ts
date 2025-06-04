import http from "http";
import { ModuleBase } from "../library/cayduajs/module/module.base";
import { AttemptsModule } from "../modules/attempts/module";
import { Chuoi } from "../library/caychuoijs";
import { env } from "../configs/env";
import { AllExceptionFilter } from "../shared/controller/defaults/all-exception.filter";
import { LoggerMiddleware } from "../shared/controller/defaults/http-logger.mdw";
import { securityDocument } from "../shared/controller/documents/security";
import app from "./servers/app";
import io from "./servers/io";
import { ExamModule } from "../modules/exam/module";
import { PracticeModule } from "../modules/pratice/module";
import { DecoderMiddleware } from "../shared/controller/defaults/decoder.mdw";
import { TestModule } from "../modules/self/module";

export async function main() {
	Chuoi.init(app, {
		basePath: '/api',
		title: "API",
		version: "1.0.0",
	});

	Chuoi.middleware(
		DecoderMiddleware,
		LoggerMiddleware,
	);

	// =====================
	// Modules
	// =====================

	const modules: ModuleBase[] = [
		new AttemptsModule(),
		new ExamModule(),
		new PracticeModule(),
		new TestModule(),
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