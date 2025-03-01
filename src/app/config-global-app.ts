import { Application } from "express";
import { Chuoi } from "../library/caychuoijs";
import { AllExceptionFilter } from "../common/controller/defaults/all-exception.filter";
import { LoggerMiddleware } from "../common/controller/defaults/logger.middleware";
import { UserPipe } from "../common/controller/pipes/user.pipe";

export function configGlobalApp(app: Application) {
	Chuoi.init(app, {
		basePath: '/api',
	});

	Chuoi.middleware(
		LoggerMiddleware,
		UserPipe
	);
	Chuoi.final(new AllExceptionFilter());
}