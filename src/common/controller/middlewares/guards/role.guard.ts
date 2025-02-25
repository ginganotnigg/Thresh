import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { MiddlewareBase } from "../../base/middleware.base";
import { middlewareInjectorInstance } from "../../helpers/middleware.inject";

export enum UserRole {
	CANDIDATE = 1,
	MANAGER = 2
}

export class RoleGuard extends MiddlewareBase {
	constructor(
		private readonly role: UserRole
	) { super(); }

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

middlewareInjectorInstance.addTransient(RoleGuard);

export const mg = middlewareInjectorInstance.getTransient(RoleGuard, UserRole.MANAGER);
export const cg = middlewareInjectorInstance.getTransient(RoleGuard, UserRole.CANDIDATE);
