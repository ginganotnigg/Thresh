import http from "http";
import { Chuoi } from "../library/caychuoijs";
import { env } from "../configs/env";
import { AllExceptionFilter } from "../shared/controller/defaults/all-exception.filter";
import { LoggerMiddleware } from "../shared/controller/defaults/http-logger.mdw";
import { securityDocument } from "../shared/controller/documents/security";
import app from "./servers/app";
import io from "./servers/io";
import { DecoderMiddleware } from "../shared/controller/defaults/decoder.mdw";
import { ControllerBase } from "../shared/controller/controller.base";
import { AttemptsController } from "../controllers/attempts/attempts.controller";
import { CandidatesController } from "../controllers/candidates/candidates.controller";
import { FeedbacksController } from "../controllers/feedback/feedback.controller";
import { TemplatesController } from "../controllers/templates/templates.controller";
import { TestsController } from "../controllers/tests/tests.controller";
import { initServices } from "./init/initServices";
import { MessageBrokerService } from "../services/MessageBrokerService";
import { ensureDatabase } from "../configs/orm/database-operations";
import sequelize from "../configs/orm/sequelize/sequelize";

export async function main() {
	await ensureDatabase();
	await sequelize.sync({ logging: false });
	await sequelize.authenticate({ logging: false });
	await initServices();

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

	const controllers: ControllerBase[] = [
		new AttemptsController(),
		new CandidatesController(),
		new FeedbacksController(),
		new TemplatesController(),
		new TestsController(),
	];
	await Promise.all(controllers.map(controller => controller.constructRouter()));

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
	io.attach(socketServer);
	// socketServer.listen(+env.socketPort, () => {
	// 	console.log(`Socket server running on port: ${env.socketPort}`);
	// });

	const restServer = http.createServer(app);
	restServer.listen(+env.port, () => {
		console.log(`Rest server running on port: ${env.port}`);
	});

	// =====================
	// Process exit handling
	// =====================

	process.on("beforeExit", async (_) => {
		await MessageBrokerService.close();
	});

	return { socketServer, restServer };
}