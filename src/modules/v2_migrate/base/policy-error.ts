import { DomainError } from "../../../shared/controller/errors/domain.error";

export class PolicyError extends DomainError {
	constructor(message: string) {
		super(`Policy violated: ${message}`);
	}
}