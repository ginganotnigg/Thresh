import Test from "../../../../domain/models/test";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { Paged, Paging } from "../../../../controller/schemas/base";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import ExamTest from "../../../../domain/models/exam_test";
import { DomainError } from "../../../../controller/errors/domain.error";
import { TestAttemptsQueryRepo } from "../../../../domain/repo/attempt/test-attemps.query-repo";
import { AttemptsOfTestAggregate, AttemptsOfTestQuery, AttemptsOfCandidateInTestAggregate } from "../../schema/of-test.schema";
import { AttemptsQueryRepo } from "../../../../domain/repo/attempt/attempts.query-repo";
import ExamParticipants from "../../../../domain/models/exam_participants";

export class AttemptsOfExamRead {
	private readonly attemptsQueryRepo: AttemptsQueryRepo;
	private readonly testAttemptsQueryRepo: TestAttemptsQueryRepo;

	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) {
		this.attemptsQueryRepo = new AttemptsQueryRepo();
		this.testAttemptsQueryRepo = new TestAttemptsQueryRepo(this.test);
	}

	static async load(testId: string, credentials: CredentialsMeta): Promise<AttemptsOfExamRead> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: ExamTest,
				required: true,
				include: [{
					model: ExamParticipants,
					where: {
						candidateId: credentials.userId,
					},
				}],
			}]
		});
		if (!test) {
			throw new DomainError(`Exam test not found`);
		}
		return new AttemptsOfExamRead(test, credentials);
	}

	private isAllowedToSeeOtherResults(): boolean {
		return (
			this.test.ExamTest!.isAllowedToSeeOtherResults === true ||
			this.credentials.userId === this.test.authorId
		);
	}

	async getSelfAttempts(params: AttemptsOfTestQuery): Promise<Paged<AttemptInfo>> {
		const res = await this.attemptsQueryRepo.getAttemptsQuery({
			candidateId: this.credentials.userId,
			testId: this.test.id,
			...params,
		})
		return res;
	}

	async getAttemptsOfTest(params: AttemptsOfTestQuery): Promise<Paged<AttemptInfo>> {
		if (!this.isAllowedToSeeOtherResults()) {
			throw new DomainError(`You are not allowed to see other results`);
		}
		const res = await this.attemptsQueryRepo.getAttemptsQuery({
			testId: this.test.id,
			...params,
		})
		return res;
	}

	async getAttemptsAggregate(): Promise<AttemptsOfTestAggregate> {
		if (!this.isAllowedToSeeOtherResults()) {
			throw new DomainError(`You are not allowed to see other results`);
		}
		return await this.testAttemptsQueryRepo.getAttemptsOfTestAggregate();
	}

	async getAttemptsOfCandidateInTest(candidateId: string, params: AttemptsOfTestQuery): Promise<Paged<AttemptInfo>> {
		if (
			candidateId !== this.credentials.userId &&
			this.isAllowedToSeeOtherResults() === false
		) {
			throw new DomainError(`You are not allowed to see other results`);
		}
		const res = await this.attemptsQueryRepo.getAttemptsQuery({
			...params,
			candidateId: candidateId,
			testId: this.test.id,
		});
		return res;
	}

	async getAttemptsOfCandidateInTestAggregate(candidateId: string): Promise<AttemptsOfCandidateInTestAggregate> {
		if (
			candidateId !== this.credentials.userId &&
			this.isAllowedToSeeOtherResults() === false
		) {
			throw new DomainError(`You are not allowed to see other results`);
		}
		return await this.testAttemptsQueryRepo.getAttemptsOfCandidateInTestAggregate(candidateId);
	}

	async getNumberOfSelfAttempts(): Promise<number> {
		return await this.testAttemptsQueryRepo.getNumberOfSelfAttempts(this.credentials.userId);
	}

	async getParticipantsAggregate(paging: Paging): Promise<Paged<AttemptsOfCandidateInTestAggregate>> {
		if (!this.isAllowedToSeeOtherResults()) {
			throw new DomainError(`You are not allowed to see other results`);
		}
		return await this.testAttemptsQueryRepo.getParticipantsAggregate({
			page: paging.page,
			perPage: paging.perPage,
		});
	}
}

