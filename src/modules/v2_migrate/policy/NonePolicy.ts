import { PolicyBase } from "../base/policy.base";

export class NonePolicy extends PolicyBase {
	verify(): Promise<void> {
		return Promise.resolve();
	}
}