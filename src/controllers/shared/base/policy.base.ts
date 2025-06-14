import { CredentialsMeta } from "../schemas/meta";

export abstract class PolicyBase {
	protected constructor() { }
	abstract verify(): void;
}

export abstract class CredentialsPolicyBase extends PolicyBase {
	protected constructor(
		protected readonly credentials: CredentialsMeta,
	) { super(); }
}