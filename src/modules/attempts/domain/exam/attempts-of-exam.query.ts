import Test from "../../../../domain/models/test";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { Paged, PagingSchema } from "../../../../controller/schemas/base";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import ExamTest from "../../../../domain/models/exam_test";
import { DomainError } from "../../../../controller/errors/domain.error";
import { AttemptQuery } from "../common/attemps.query";
import { z } from "zod";

/**
 * Query class for attempts that has ended
 * @param attempt Attempt object
 * @throws DomainError if attempt is not ended
 */
export class AttemptsOfExamQuery {
	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) { }

	static async create(testId: string, credentials: CredentialsMeta): Promise<AttemptsOfExamQuery> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: ExamTest,
				required: true,
			}]
		});
		if (!test) {
			throw new DomainError(`Test not found`);
		}

		return new AttemptsOfExamQuery(test, credentials);
	}

	private isAllowedToSeeOtherResults(): boolean {
		return (
			this.test.ExamTest!.isAllowedToSeeOtherResults === true ||
			this.credentials.userId === this.test.authorId
		);
	}

	async getSelfAttempts(params: AttemptsOfExamQueryParams): Promise<Paged<AttemptInfo>> {
		const res = await AttemptQuery.getAttemptsQuery({
			candidateId: this.credentials.userId,
			testId: this.test.id,
			...params,
		})
		return res;
	}

	async getCandidatesAttempts(params: AttemptsOfExamQueryParams): Promise<Paged<AttemptInfo>> {
		if (!this.isAllowedToSeeOtherResults()) {
			throw new DomainError(`You are not allowed to see other results`);
		}
		const res = await AttemptQuery.getAttemptsQuery({
			testId: this.test.id,
			...params,
		})
		return res;
	}

	async getAttemptsAggregate(): Promise<AttemptsAggregate> {
		if (!this.isAllowedToSeeOtherResults()) {
			throw new DomainError(`You are not allowed to see other results`);
		}

		return {
			candidateRank: 0,
		}
	}
}

export const AttemptsOfExamQuerySchema = PagingSchema.extend({
	sort: z.array(z.string()),
});

export const AttemptsAggregateSchema = z.object({
	candidateRank: z.number().optional(),
});

type AttemptsOfExamQueryParams = z.infer<typeof AttemptsOfExamQuerySchema>;
type AttemptsAggregate = z.infer<typeof AttemptsAggregateSchema>;