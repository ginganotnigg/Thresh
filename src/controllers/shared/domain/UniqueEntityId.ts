import { v4 as uuidv4 } from 'uuid';

export class IdentityUtils {
	static create(): string {
		const id = uuidv4();
		return id;
	}
}
