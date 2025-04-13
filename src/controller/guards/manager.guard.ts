import { ChuoiContainer } from "../../library/caychuoijs/utils/container";
import { Role } from "./role";
import { RoleGuardBase as RoleGuardBase } from "./role-guard.base";

export class ManagerGuard extends RoleGuardBase {
	protected checkRole(role: number): boolean {
		return role === Role.MANAGER;
	}
}

ChuoiContainer.register(ManagerGuard);