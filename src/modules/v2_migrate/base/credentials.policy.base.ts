import { CredentialsMeta } from "../../../shared/controller/schemas/meta";
import { PolicyBase } from "./policy.base";

export abstract class CredentialsPolicyBase extends PolicyBase {
	protected constructor(
		protected readonly credentials: CredentialsMeta,
	) { super(); }
}