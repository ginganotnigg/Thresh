import { Role } from "./role";
import { ChuoiContainer } from "../../../library/caychuoijs/utils/container";
import { RoleGuardBaseHandler } from "./role-guard.base";

export class CandidateGuardHandler extends RoleGuardBaseHandler {
	constructor() {
		super(Role.CANDIDATE);
	}
}

ChuoiContainer.register(CandidateGuardHandler);