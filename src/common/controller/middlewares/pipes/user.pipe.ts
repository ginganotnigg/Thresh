import { Request, Response, NextFunction, RequestHandler } from "express";
import { MiddlewareBase } from "../../base/middleware.base";
import { RequestWithUser } from "../../base/middleware";
import { UnauthorizedErrorResponse } from "../../errors/unauthorized.error";
import { validateHelperString } from "../../helpers/validation.helper";

export class UserPipe extends MiddlewareBase {
	handle: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
		const userId = req.header('x-user-id');
		if (userId === undefined || validateHelperString(userId, false)) {
			throw new UnauthorizedErrorResponse();
		}
		(req as RequestWithUser).user = {
			id: userId
		};
		next();
	};
}