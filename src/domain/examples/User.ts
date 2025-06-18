// Example usage of the DDD base classes

import { AggregateRoot, DomainEvent, ValueObject, UniqueEntityId } from '../../controllers/shared/domain';

// Example Value Object
export class Email extends ValueObject {
	private constructor(private readonly value: string) {
		super();
	}

	static create(email: string): Email {
		if (!this.isValidEmail(email)) {
			throw new Error('Invalid email format');
		}
		return new Email(email);
	}

	private static isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	get getValue(): string {
		return this.value;
	}

	protected getEqualityComponents(): readonly unknown[] {
		return [this.value];
	}
}

// Example Domain Event
export class UserCreatedEvent extends DomainEvent {
	public readonly eventType = 'UserCreated';

	constructor(
		public readonly userId: string,
		public readonly email: string
	) {
		super();
	}
}

// Example Aggregate Root
export class User extends AggregateRoot<string> {
	private constructor(
		id: string,
		private _email: Email,
		private _name: string,
		private _createdAt: Date
	) {
		super(id);
	}

	static create(email: string, name: string): User {
		const userId = new UniqueEntityId().value;
		const emailVO = Email.create(email);
		const user = new User(userId, emailVO, name, new Date());

		// Add domain event
		user.addDomainEvent(new UserCreatedEvent(userId, email));

		return user;
	}

	static fromPersistence(
		id: string,
		email: string,
		name: string,
		createdAt: Date
	): User {
		const emailVO = Email.create(email);
		return new User(id, emailVO, name, createdAt);
	}

	get email(): Email {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	public changeName(newName: string): void {
		if (!newName || newName.trim().length === 0) {
			throw new Error('Name cannot be empty');
		}
		this._name = newName;
	}

	public changeEmail(newEmail: string): void {
		const emailVO = Email.create(newEmail);
		this._email = emailVO;
	}
}
