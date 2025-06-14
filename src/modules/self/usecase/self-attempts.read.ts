import { FindAndCountOptions } from "sequelize";
import { DomainError } from "../../../controllers/shared/errors/domain.error";
import { Paged } from "../../../shared/controller/schemas/base";
import { CredentialsMeta } from "../../../controllers/shared/schemas/meta";
import Attempt from "../../../infrastructure/models/attempt";
import Test from "../../../infrastructure/models/test";
import { AttemptWithTest } from "../../attempts/schema/history.schema";
import { AttemptsOfCandidateQuery } from "../../attempts/schema/history.schema";
import { AttemptsQueryRepo } from "../../../infrastructure/read/attempts.query-repo";
import { AttemptAggregate } from "../../attempts/schema/of-test.schema";
import { AttemptQueryRepo } from "../../../infrastructure/read/attempt.query-repo";
import { AnswerCore } from "../../../shared/resource/attempt.schema";

export class SelfAttemptsRead {
	private readonly attemptsQueryRepo: AttemptsQueryRepo;

	private constructor(
		private readonly credentials: CredentialsMeta,
	) {
		this.attemptsQueryRepo = new AttemptsQueryRepo();
	}

	static create(credentials: CredentialsMeta): SelfAttemptsRead {
		return new SelfAttemptsRead(credentials);
	}

	private async checkSelf(attemptId: string): Promise<Attempt> {
		const attempt = await Attempt.findByPk(attemptId, {
			include: [{
				model: Test,
			}],
		});
		if (!attempt || attempt.hasEnded === false) {
			throw new DomainError("Attempt not found or has not ended");
		}
		if (attempt.candidateId !== this.credentials.userId) {
			throw new DomainError("You are not the owner of this attempt");
		}
		return attempt;
	}

	async getAttemptsWithTest(params: AttemptsOfCandidateQuery): Promise<Paged<AttemptWithTest>> {
		const query: FindAndCountOptions<Attempt> = this.attemptsQueryRepo.buildAttemptsQuery(params);
		const { rows, count } = await Attempt.findAndCountAll(query);
		const attempts = rows.map((attempt) => {
			const attemptJson = attempt.toJSON();
			const testJson = attempt.Test!.toJSON();
			return {
				...attemptJson,
				test: {
					...testJson,
					authorId: testJson.authorId,
					createdAt: testJson.createdAt,
					updatedAt: testJson.updatedAt,
				},
			};
		});
		return {
			page: params.page,
			perPage: params.perPage,
			total: count,
			totalPages: Math.ceil(count / params.perPage),
			data: attempts,
		};
	}

	async getAttemptWithTest(attemptId: string): Promise<AttemptWithTest> {
		const attempt = await this.checkSelf(attemptId);
		return {
			...attempt.toJSON(),
			test: attempt.Test!.toJSON(),
		};
	}

	async getAttemptAggregate(attemptId: string): Promise<AttemptAggregate> {
		const attempt = await this.checkSelf(attemptId);
		return await new AttemptQueryRepo(attempt).getAttemptAggregate();
	}

	async getAttemptAnswers(attemptId: string): Promise<AnswerCore[]> {
		const attempt = await this.checkSelf(attemptId);
		return await new AttemptQueryRepo(attempt).getAttemptAnswers();
	}
}