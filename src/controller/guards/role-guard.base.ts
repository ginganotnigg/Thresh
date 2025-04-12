import { NextFunction, Request } from "express";
import { ChuoiGuardBase } from "../../library/caychuoijs/main/contracts";
import { env } from "../../utils/env";
import { Role } from "./role";
import { UnauthorizedErrorResponse } from "../errors/unauthorized.error";
import { ForbidenErrorResponse } from "../errors/forbidden.error";

export abstract class RoleGuardBaseHandler extends ChuoiGuardBase {
	constructor(
		private readonly role: Role
	) { super(); }

	check(req: Request, next: NextFunction): void {
		if (env.noAuth == true) {
			next();
		}
		else if (req.header('x-role-id') === undefined ||
			isNaN(parseInt(req.header('x-role-id')!, 10))
		) {
			throw new UnauthorizedErrorResponse();
		}
		else if (parseInt(req.header('x-role-id')!, 10) !== this.role) {
			throw new ForbidenErrorResponse();
		}
		else {
			next();
		}
	}
} 