import { Request, Response, NextFunction, RequestHandler } from "express";
import { MiddlewareBase } from "../base/middleware.base";
import { RequestWithUser } from "../base/middleware";

export class UserPipe extends MiddlewareBase {
	handle: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
		(req as RequestWithUser).user = { id: '123' };
		next();
	};
}