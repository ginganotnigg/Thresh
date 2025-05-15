import Test from "../../models/test";
import { AttemptsOfCandidateInTestAggregate, AttemptsOfTestAggregate } from "../../../modules/attempts/schema/test.schema";
import { db } from "../../../configs/orm/kysely/db";

export class TestAttemptsQueryRepo {
	constructor(
		private readonly test: Test,
	) { }

	async getAttemptsOfTestAggregate(): Promise<AttemptsOfTestAggregate> {
		// Create the base query
		let query = db.selectFrom("Attempts")
			.select((eb) => [
				eb.fn.avg('score').as('averageScore'),
				eb.fn.max('score').as('highestScore'),
				eb.fn.min('score').as('lowestScore'),
				eb.fn.avg('secondsSpent').as('averageTime'),
				eb.fn.count('id').as('totalAttempts'),
				eb.fn.count('candidateId').distinct().as('totalParticipants'),
			])
			.where('testId', '=', this.test.id);
		const result = await query.executeTakeFirst();

		return {
			totalParticipants: Number(result?.totalParticipants ?? 0),
			totalAttempts: Number(result?.totalAttempts ?? 0),
			averageScore: Number(result?.averageScore ?? 0),
			highestScore: Number(result?.highestScore ?? 0),
			lowestScore: Number(result?.lowestScore ?? 0),
			averageTime: Number(result?.averageTime ?? 0),
		};
	}

	async getAttemptsOfCandidateInTestAggregate(candidateId: string): Promise<AttemptsOfCandidateInTestAggregate> {
		// Create the base query
		let query = db.selectFrom("Attempts")
			.select((eb) => [
				eb.fn.avg('score').as('averageScore'),
				eb.fn.max('score').as('highestScore'),
				eb.fn.min('score').as('lowestScore'),
				eb.fn.avg('secondsSpent').as('averageTime'),
				eb.fn.count('id').as('totalAttempts'),
			])
			.where('testId', '=', this.test.id)
			.where('candidateId', '=', candidateId);

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
			rank: candidateRank ?? 0,
			totalAttempts: Number(result?.totalAttempts ?? 0),
			averageScore: Number(result?.averageScore ?? 0),
			highestScore: Number(result?.highestScore ?? 0),
			lowestScore: Number(result?.lowestScore ?? 0),
			averageTime: Number(result?.averageTime ?? 0),
		};
	}
}


export type AttemptsQueryParams = {
	sort: string[];
	page: number;
	perPage: number;
	candidateId?: string | undefined;
	testId?: string | undefined;
	authorId?: string | undefined;
};