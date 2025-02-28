import { Application, Request, Response, NextFunction } from 'express';
import { LoggerMiddleware } from '../common/controller/pipes/logger.pipe';
import { ErrorHandlerMiddleware } from '../common/controller/middlewares/errors/error.handler';
import { UserPipe } from '../common/controller/pipes/user.pipe';

export function configGlobalRouterAfter(app: Application) {
	const errorHandler = new ErrorHandlerMiddleware();
	app.use((err: any, req: Request, res: Response, next: NextFunction) => { errorHandler.handle(err, req, res, next); });
}

export function configGlobalRouterBefore(app: Application) {
	const loggerMdw = new LoggerMiddleware();
	const userMdw = new UserPipe();
	app.use(loggerMdw.handle);
	app.use(userMdw.handle);
}