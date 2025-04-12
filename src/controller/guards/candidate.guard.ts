import { ChuoiContainer } from "../../library/caychuoijs/utils/container";
import { Role } from "./role";
import { RoleGuardBaseHandler } from "./role-guard.base";

export class CandidateGuard extends RoleGuardBaseHandler {
	constructor() {
		super(Role.CANDIDATE);
	}
}

ChuoiContainer.register(CandidateGuard);