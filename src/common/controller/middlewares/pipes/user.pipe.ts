import { Request, Response, NextFunction, RequestHandler } from "express";
import { MiddlewareBase } from "../../base/middleware.base";
import { UnauthorizedErrorResponse } from "../../errors/unauthorized.error";
import { validateHelperString } from "../../helpers/validation.helper";

interface RequestWithUser extends Request {
	user: {
		id: string;
	};
}

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

	static retrive(req: Request): { id: string } {
		return (req as RequestWithUser).user;
	}
}