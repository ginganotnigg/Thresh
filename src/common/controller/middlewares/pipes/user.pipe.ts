import { Request, Response, NextFunction, RequestHandler } from "express";
import { MiddlewareBase } from "../../base/middleware.base";
import { UnauthorizedErrorResponse } from "../../errors/unauthorized.error";
import { validateHelperString } from "../../helpers/validation.helper";

type User = {
	id: string;
}

interface RequestWithUser extends Request {
	user: User;
}

export class UserPipe extends MiddlewareBase {
	handle: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
		let userId = req.header('x-user-id');
		if (process.env.NO_AUTH == 'true') {
			userId = '1';
		}
		if (userId != null) {
			this.set(req, { id: userId });
		}
		next();
	};

	static retrive(req: Request): User {
		const user = (req as RequestWithUser).user;
		if (user) {
			return user;
		}
		// Auto parse user id from header => Easy to forget => May auto-parse many times => Performance issue
		throw new UnauthorizedErrorResponse();
	}

	private set(req: Request, user: User): void {
		(req as RequestWithUser).user = user;
	}
}

export const userPipe = new UserPipe();