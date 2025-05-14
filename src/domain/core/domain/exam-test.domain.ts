import { Op } from "sequelize";
import { DomainError } from "../../../controller/errors/domain.error";
import { AttemptCore, ExamTestCore } from "../../schema/core.schema";
import ExamTest from "../../models/exam_test";
import { AttemptRepo } from "../repo/attempt.repo";

export class ExamTestDomain {
	private constructor(
		private readonly candidateId: string,
		private readonly examTest: ExamTestCore,
		private readonly password: string | null = null,
		private readonly currentAttempt: AttemptCore | null = null,
		private readonly numberOfPreviousAttempts: number = 0,
	) { }

	static async load({
		testId,
		candidateId,
	}: {
		testId: string;
		candidateId: string;
	}): Promise<ExamTestDomain> {
		const examTest = await ExamTest.findByPk(testId);
		if (examTest == null) {
			throw new DomainError("No exam test found");
		}
		const attempt = await AttemptRepo.loadCurrentAttempt(examTest.testId, candidateId);
		return new ExamTestDomain(
			candidateId,
			{
				...examTest.get(),
				hasPassword: examTest.password != null,
			},
			examTest.password,
			attempt,
			attempt ? attempt.order : 0
		);
	}

	hasJoined(): boolean {
		if (this.currentAttempt == null) {
			return true;
		}
		return false;
	}

	async join(password: string | null | undefined): Promise<void> {
		const now = new Date();
		if (this.examTest.openDate > now) {
			throw new DomainError("Exam test is not open yet");
		}
		if (this.examTest.closeDate < now) {
			throw new DomainError("Exam test is already closed");
		}
		if (this.examTest.numberOfAttemptsAllowed > 0 &&
			this.numberOfPreviousAttempts >= this.examTest.numberOfAttemptsAllowed) {
			throw new DomainError("Candidate has reached the maximum number of attempts allowed");
		}
		if (this.password != null && this.password !== password) {
			throw new DomainError("Invalid password");
		}
		await AttemptRepo.createAttempt({
			testId: this.examTest.testId,
			candidateId: this.candidateId,
		});
	}
}