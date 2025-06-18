import { AttemptPersistence } from "./AttemptMapper";

export type TestAttemptsPersistence = {
	testId: string;
	newAttempt: AttemptPersistence | null;
	modifedAttmepts: AttemptPersistence[];
	deletedAttempts: string[];
}