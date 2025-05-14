import Test from "../../../../domain/models/test";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { Paged, PagingSchema } from "../../../../controller/schemas/base";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import ExamTest from "../../../../domain/models/exam_test";
import { DomainError } from "../../../../controller/errors/domain.error";
import { AttemptQueryRepo } from "../common/attemps.query-repo";
import { db } from "../../../../configs/orm/kysely/db";
import { AttemptsOfExamAggregate, AttemptsOfExamQuery } from "../../schema/exam.schema";

/**
 * Query class for attempts that has ended
 * @param attempt Attempt object
 * @throws DomainError if attempt is not ended
 */
export class AttemptsOfExamRead {
	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) { }

	static async create(testId: string, credentials: CredentialsMeta): Promise<AttemptsOfExamRead> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: ExamTest,
				required: true,
			}]
		});
		if (!test) {
			throw new DomainError(`Test not found`);
		}

		return new AttemptsOfExamRead(test, credentials);
	}

	private isAllowedToSeeOtherResults(): boolean {
		return (
			this.test.ExamTest!.isAllowedToSeeOtherResults === true ||
			this.credentials.userId === this.test.authorId
		);
	}

	async getSelfAttempts(params: AttemptsOfExamQuery): Promise<Paged<AttemptInfo>> {
		const res = await AttemptQueryRepo.getAttemptsQuery({
			candidateId: this.credentials.userId,
			testId: this.test.id,
			...params,
		})
		return res;
	}

	async getCandidatesAttempts(params: AttemptsOfExamQuery): Promise<Paged<AttemptInfo>> {
		if (!this.isAllowedToSeeOtherResults()) {
			throw new DomainError(`You are not allowed to see other results`);
		}
		const res = await AttemptQueryRepo.getAttemptsQuery({
			testId: this.test.id,
			...params,
		})
		return res;
	}

	async getAttemptsAggregate(candidateId?: string): Promise<AttemptsOfExamAggregate> {
		if (!this.isAllowedToSeeOtherResults()) {
			throw new DomainError(`You are not allowed to see other results`);
		}

		// Create the base query
		let query = db.selectFrom("Attempts")
			.select((eb) => [
				eb.fn.avg('score').as('averageScore'),
				eb.fn.max('score').as('highestScore'),
				eb.fn.min('score').as('lowestScore'),
				eb.fn.avg('secondsSpent').as('averageTime'),
				eb.fn.count('id').as('totalAttempts'),
			])
			.where('testId', '=', this.test.id);

		// Conditionally add the candidateId filter
		if (candidateId) {
			query = query.where('candidateId', '=', candidateId);
		}

		const result = await query.executeTakeFirst();

		// Get candidate rank if candidateId is provided
		let candidateRank: number | undefined;
		if (candidateId) {
			const candidateScore = await db.selectFrom('Attempts')
				.select('score')
				.where('testId', '=', this.test.id)
				.where('candidateId', '=', candidateId)
				.orderBy('score', 'desc')
				.limit(1)
				.executeTakeFirst();

			if (candidateScore) {
				const betterScores = await db.selectFrom('Attempts')
					.select(({ fn }) => fn.countAll().as('count'))
					.where('testId', '=', this.test.id)
					.where('score', '>', candidateScore.score)
					.executeTakeFirst();

				candidateRank = betterScores ? (Number(betterScores.count) + 1) : 1;
			}
		}
		return {
			candidateRank,
			totalAttempts: Number(result?.totalAttempts ?? 0),
			averageScore: Number(result?.averageScore ?? 0),
			highestScore: Number(result?.highestScore ?? 0),
			lowestScore: Number(result?.lowestScore ?? 0),
			averageTime: Number(result?.averageTime ?? 0),
		};
	}
}

