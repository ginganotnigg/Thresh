import { TestModeType } from "../../../domain/enum";
import { PolicyError } from "../../shared/errors/policy.error";
import { CredentialsMeta } from "../../shared/schemas/meta";
import { GetAttemptsQueryParam } from "../uc_query/get-attempts-query/param";

export class GetAttemptsQueryPolicy {
	constructor(
		private readonly credentials: CredentialsMeta,
		private readonly params: GetAttemptsQueryParam,
	) { }

	verify(): void {
		if (this.params.self === "1") {
			return;
		}
	}
}

// Self => Pass
// Not self 