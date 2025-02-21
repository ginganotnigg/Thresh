import { RequestHandler } from "express";
import { MiddlewareBase } from "./middleware.base";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { middlewareInjectorInstance } from "./middleware.inject";

export enum UserRole {
	UN_AUTH = 0,
	CANDIDATE = 1,
	BUSINESS_MANAGER = 2
}

export class RoleMiddleware extends MiddlewareBase {
	constructor(
		private readonly role: UserRole = UserRole.UN_AUTH
	) {
		super();
	}

	handle: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>> = (req, res, next) => {
		if (process.env.NO_AUTH === 'true') {
			next();
		}
		else if (req.header('x-role-id') === undefined) {
			res.status(401).json({ message: 'Unauthorized' });
		}
		else if (isNaN(parseInt(req.header('x-role-id')!, 10))) {
			res.status(401).json({ message: 'Unauthorized' });
		}
		else if (parseInt(req.header('x-role-id')!, 10) !== this.role) {
			res.status(403).json({ message: 'Forbidden' });
		}
		else {
			next();
		}
	}
}

middlewareInjectorInstance.addTransient(RoleMiddleware);
