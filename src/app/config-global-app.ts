import { Application } from "express";
import { ChuoiController } from "../library/caychuoijs/router.i";
import { AllExceptionFilter } from "../common/controller/defaults/all-exception.filter";
import { LoggerMiddleware } from "../common/controller/defaults/logger.middleware";
import { UserPipe } from "../common/controller/pipes/user.pipe";

export function configGlobalApp(app: Application) {
	ChuoiController.init(app, {
		basePath: '/api',
	});

	ChuoiController.middleware(
		LoggerMiddleware,
		UserPipe
	);
	ChuoiController.final(new AllExceptionFilter());
}