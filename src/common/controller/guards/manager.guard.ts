import { Role } from "./role";
import { ChuoiContainer } from "../../../library/caychuoijs/utils/container";
import { RoleGuardBaseHandler } from "./role-guard.base";

export class ManagerGuardHandler extends RoleGuardBaseHandler {
	constructor() {
		super(Role.MANAGER);
	}
}

ChuoiContainer.register(ManagerGuardHandler);