import { DomainError } from "../../../../shared/controller/errors/domain.error";
import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import ExamParticipants from "../../../../domain/models/exam_participants";
import ExamTest from "../../../../domain/models/exam_test";
import Test from "../../../../domain/models/test";
import { ExamPolicy } from "../../../../domain/policy/exam.policy";
import { AttemptRepo } from "../../../../domain/repo/attempt/attempt.repo";

export class AttemptsOfExamWrite {
	private readonly examPolicy: ExamPolicy;

	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) {
		this.examPolicy = new ExamPolicy(this.test, this.credentials);
	}

	static async load(
		testId: string,
		credentials: CredentialsMeta,
	): Promise<AttemptsOfExamWrite> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: ExamTest,
				required: true,
				include: [{
					model: ExamParticipants,
					where: {
						candidateId: credentials.userId,
					},
				}]
			}],
		});
		if (!test) {
			throw new DomainError(`Test not found`);
		}
		return new AttemptsOfExamWrite(test, credentials);
	}

	async start() {
		this.examPolicy.checkAllowedToStart();
		await AttemptRepo.start({
			testId: this.test.id,
			candidatesId: this.credentials.userId,
		});
	}
}