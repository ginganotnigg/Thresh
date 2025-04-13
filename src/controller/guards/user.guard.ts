import { ChuoiContainer } from "../../library/caychuoijs/utils/container";
import { Role } from "./role";
import { RoleGuardBase } from "./role-guard.base";

export class UserGuard extends RoleGuardBase {
	protected checkRole(role: number): boolean {
		return role === Role.CANDIDATE || role === Role.MANAGER;
	}
}

ChuoiContainer.register(UserGuard);