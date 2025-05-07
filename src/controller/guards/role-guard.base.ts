import { Request } from "express";
import { ChuoiGuardBase } from "../../library/caychuoijs/main/contracts";
import { env } from "../../configs/env";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { ForbidenError } from "../errors/forbidden.error";

export abstract class RoleGuardBase extends ChuoiGuardBase {
	protected abstract checkRole(role: number): boolean;

	check(req: Request): void {
		if (env.noAuth == true) {
			return;
		}
		if (
			req.header('x-role-id') === undefined ||
			isNaN(parseInt(req.header('x-role-id')!, 10))
		) {
			throw new UnauthorizedError();
		}
		const role = parseInt(req.header('x-role-id')!, 10);
		if (!this.checkRole(role)) {
			throw new ForbidenError();
		}
	}
} 