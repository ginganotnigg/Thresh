import { DomainError } from "./domain.error";

export class PolicyError extends DomainError {
	constructor(message: string) {
		super(`Policy violated: ${message}`);
	}
}