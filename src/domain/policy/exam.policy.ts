import { Transaction } from "sequelize";
import { DomainError } from "../../shared/controller/errors/domain.error";
import { CredentialsMeta } from "../../shared/controller/schemas/meta";
import Test from "../../infrastructure/models/test";
import Attempt from "../../infrastructure/models/attempt";
import { AttemptQueryRepo } from "../../infrastructure/read/attempt.query-repo";
import { AttemptsQueryRepo } from "../../infrastructure/read/attempts.query-repo";

export class ExamPolicy {
	constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) {
		if (this.test.ExamTest == null || this.test.ExamTest.ExamParticipants == null) {
			throw new DomainError(`Not fully loaded exam test`);
		}
	}

	private isAuthor(): boolean {
		return this.test.authorId === this.credentials.userId;
	}

	private isParticipant(): boolean {
		return (
			this.test.ExamTest?.ExamParticipants?.findIndex(
				(participant) => participant.candidateId === this.credentials.userId,
			) !== -1
		);
	}

	async checkAllowedToJoin(password: string | null, transaction?: Transaction): Promise<void> {
		if (this.test.ExamTest!.password != null && this.test.ExamTest!.password !== password) {
			throw new DomainError(`Password is incorrect`);
		}
		const now = new Date();
		if (this.test.ExamTest!.get("openDate") > now) {
			throw new DomainError(`Exam has not started yet`);
		}
		if (this.test.ExamTest!.get("closeDate") < now) {
			throw new DomainError(`Exam has already ended`);
		}
		const numberOfAttempts = await Attempt.count({
			where: {
				testId: this.test.id,
				candidateId: this.credentials.userId,
			},
			transaction,
		});
		if (numberOfAttempts >= this.test.ExamTest!.numberOfAttemptsAllowed) {
			throw new DomainError(`Max attempts reached`);
		}
	}

	checkAllowedToStart(): void {
		if (
			this.isAuthor() === false &&
			this.isParticipant() === false
		) {
			throw new DomainError(`You are not allowed to join this exam`);
		}
		const now = new Date();
		if (this.test.ExamTest!.get("openDate") > now) {
			throw new DomainError(`Exam has not started yet`);
		}
		if (this.test.ExamTest!.get("closeDate") < now) {
			throw new DomainError(`Exam has already ended`);
		}
	}

	checkAllowedToSeeOthers(): void {
		if (
			this.test.ExamTest!.isAllowedToSeeOtherResults === false &&
			!this.isAuthor() &&
			!this.isParticipant()
		) {
			throw new DomainError(`You are not allowed to see other results`);
		}
	}

	async checkIsAllowedToSeeQuestions(): Promise<void> {
		if (this.isAuthor()) return;
		if (this.isParticipant() === false) {
			throw new DomainError(`You are not a participant of this exam`);
		}
		const currentAttempt = await new AttemptsQueryRepo().getCurrentAttemptByTestAndCandidate(this.test.id, this.credentials.userId);
		if (currentAttempt == null) {
			throw new DomainError(`You have not started this exam yet`);
		}
	}

	checkIsSelfAttempt(attempt: Attempt): void {
		if (this.credentials.userId !== attempt.candidateId) {
			throw new DomainError(`This is not your attempt`);
		}
	}

	async checkIsAllowedToSeeCorrectAnswers(): Promise<void> {
		await this.checkIsAllowedToSeeQuestions();
		if (this.test.ExamTest!.isAnswerVisible === false) {
			throw new DomainError(`Answers are not visible`);
		}
	}

	async checkIsAllowedToDelete(): Promise<void> {
		if (this.isAuthor() === false) {
			throw new DomainError(`You are not allowed to delete this exam`);
		}
		const attempts = await Attempt.count({
			where: {
				testId: this.test.id,
			},
		});
		if (attempts > 0) {
			throw new DomainError(`You cannot delete this exam because it has attempts`);
		}
	}

	async checkIsAllowedToEdit(): Promise<void> {
		if (this.isAuthor() === false) {
			throw new DomainError(`You are not allowed to edit this exam`);
		}
		const attempts = await Attempt.count({
			where: {
				testId: this.test.id,
			},
		});
		if (attempts > 0) {
			throw new DomainError(`You cannot edit this exam because it has attempts`);
		}
	}

	checkIsAllowedToSeeExam(): void {
		if (
			this.isAuthor() === false &&
			this.isParticipant() === false
		) {
			throw new DomainError(`You are not allowed to see this exam`);
		}
	}


}
