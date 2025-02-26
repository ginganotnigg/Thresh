import { Request, Response, NextFunction, RequestHandler } from "express";
import { MiddlewareBase } from "../../base/middleware.base";
import { logHttpRequest } from "../../../../configs/logger/winston";

export class LoggerMiddleware extends MiddlewareBase {
	handle: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
		logHttpRequest(`[${req.method}] ${req.url}`, { body: req.body, query: req.query, params: req.params });
		next();
	};
}