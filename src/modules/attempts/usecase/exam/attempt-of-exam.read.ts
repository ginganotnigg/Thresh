import { DomainError } from "../../../../shared/controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AnswerCore } from "../../../../domain/schema/core.schema";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import ExamTest from "../../../../domain/models/exam_test";
import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import { AttemptAggregate } from "../../schema/of-test.schema";
import { AttemptQueryRepo } from "../../../../domain/repo/attempt/attempt.query-repo";
import ExamParticipants from "../../../../domain/models/exam_participants";
import { ExamPolicy } from "../../../../domain/policy/exam.policy";

export class AttemptOfExamRead {
	private readonly attemptQueryRepo: AttemptQueryRepo;
	private readonly examPolicy: ExamPolicy;

	private constructor(
		private readonly attempt: Attempt,
		private readonly credentials: CredentialsMeta,
	) {
		this.attemptQueryRepo = new AttemptQueryRepo(this.attempt);
		this.examPolicy = new ExamPolicy(this.attempt.Test!, this.credentials);
	}

	static async create(attemptId: string, credentials: CredentialsMeta): Promise<AttemptOfExamRead> {
		const attempt = await Attempt.findByPk(attemptId, {
			include: [{
				model: Test,
				required: true,
				include: [{
					model: ExamTest,
					required: true,
					include: [{
						model: ExamParticipants,
						where: {
							candidateId: credentials.userId,
						},
					}]
				}]
			}],
		});
		if (!attempt) {
			throw new DomainError(`Attempt for exam test not found`);
		}
		return new AttemptOfExamRead(attempt, credentials);
	}

	async getAttemptAggregate(): Promise<AttemptAggregate> {
		return this.attemptQueryRepo.getAttemptAggregate();
	}

	async getAttemptAnswers(): Promise<AnswerCore[]> {
		this.examPolicy.checkIsSelfAttempt(this.attempt);
		return this.attemptQueryRepo.getAttemptAnswers();
	}

	async getAttempt(): Promise<AttemptInfo> {
		return {
			...this.attempt.toJSON(),
		};
	}
}

