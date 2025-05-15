import { FindAndCountOptions } from "sequelize";
import { DomainError } from "../../../../controller/errors/domain.error";
import { Paged } from "../../../../controller/schemas/base";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AttemptWithTest } from "../../schema/history.schema";
import { AttemptsOfCandidateQuery } from "../../schema/history.schema";
import { AttemptsQueryRepo } from "../../../../domain/repo/attempt/attempts.query-repo";

export class HistoryAttemptsRead {
	private readonly attemptsQueryRepo: AttemptsQueryRepo;

	private constructor(
		private readonly credentials: CredentialsMeta,
	) {
		this.attemptsQueryRepo = new AttemptsQueryRepo();
	}

	static create(credentials: CredentialsMeta): HistoryAttemptsRead {
		return new HistoryAttemptsRead(credentials);
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
		const attempt = await Attempt.findByPk(attemptId, {
			include: [{
				model: Test,
				required: true,
			}],
		});
		if (!attempt || attempt.candidateId !== this.credentials.userId) {
			throw new DomainError(`Attempt not found or you are not the owner`);
		}
		return {
			...attempt.toJSON(),
			test: attempt.Test!.toJSON(),
		};
	}
}