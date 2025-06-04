import Test from "../models/test";
import { AttemptsOfCandidateInTestAggregate, AttemptsOfTestAggregate } from "../../modules/attempts/schema/of-test.schema";
import { db } from "../../configs/orm/kysely/db";
import { Paged } from "../../shared/controller/schemas/base";
import { sql } from "kysely";

export class TestAttemptsQueryRepo {
	constructor(
		private readonly test: Test,
	) { }

	async getNumberOfSelfAttempts(candidateId: string): Promise<number> {
		let query = db.selectFrom("Attempts")
			.select((eb) => [
				eb.fn.count('id').as('totalAttempts'),
			])
			.where('testId', '=', this.test.id)
			.where('candidateId', '=', candidateId);

		const result = await query.executeTakeFirst();
		return Number(result?.totalAttempts ?? 0);
	}

	async getParticipantsAggregate({
		page,
		perPage,
	}: {
		page: number;
		perPage: number;
	}): Promise<Paged<AttemptsOfCandidateInTestAggregate>> {
		const offset = (page - 1) * perPage;
		let _query = db.selectFrom("ExamParticipants")
			.leftJoin("Attempts", (join) => join
				.onRef('ExamParticipants.candidateId', '=', 'Attempts.candidateId')
				.onRef('ExamParticipants.testId', '=', 'Attempts.testId')
				.on('Attempts.testId', '=', this.test.id)
			)
			.select((eb) => [
				"ExamParticipants.candidateId",
				"ExamParticipants.testId",
				eb.fn.count('Attempts.id').as('totalAttempts'),
				eb.fn.avg('Attempts.score').as('averageScore'),
				eb.fn.max('Attempts.score').as('highestScore'),
				eb.fn.min('Attempts.score').as('lowestScore'),
				eb.fn.avg('Attempts.secondsSpent').as('averageTime'),
			])
			.where('ExamParticipants.testId', '=', this.test.id)
			.where("Attempts.hasEnded", "=", 1)
			.groupBy(['ExamParticipants.candidateId', 'ExamParticipants.testId'])
			.orderBy("highestScore", 'desc')
			.limit(perPage)
			.offset(offset);

		const query = db.selectFrom(_query.as('ExamParticipants'))
			.select([
				'ExamParticipants.averageScore',
				'ExamParticipants.highestScore',
				'ExamParticipants.lowestScore',
				'ExamParticipants.averageTime',
				'ExamParticipants.totalAttempts',
				'ExamParticipants.testId',
				'ExamParticipants.candidateId',
				sql<number>`ROW_NUMBER() OVER (PARTITION BY ExamParticipants.testId ORDER BY ExamParticipants.highestScore DESC)`.as('rank'),
			])

		const queryCount = db.selectFrom("ExamParticipants")
			.leftJoin("Attempts", (join) => join
				.onRef('ExamParticipants.candidateId', '=', 'Attempts.candidateId')
				.onRef('ExamParticipants.testId', '=', 'Attempts.testId')
				.on('Attempts.testId', '=', this.test.id)
			)
			.select((eb) => [
				eb.fn.count('Attempts.id').as('totalAttempts'),
			])
			.where('ExamParticipants.testId', '=', this.test.id)
			.groupBy(['ExamParticipants.candidateId', 'ExamParticipants.testId']);


		const countResult = await queryCount.executeTakeFirst();
		const totalCount = Number(countResult?.totalAttempts ?? 0);
		const result = await query.execute();

		return {
			page,
			perPage,
			totalPages: Math.ceil(totalCount / perPage),
			total: totalCount,
			data: result.map((item) => ({
				candidateId: item.candidateId,
				rank: Number(item.rank ?? 0),
				averageScore: Number(item.averageScore ?? 0),
				highestScore: Number(item.highestScore ?? 0),
				lowestScore: Number(item.lowestScore ?? 0),
				averageTime: Number(item.averageTime ?? 0),
				totalAttempts: Number(item.totalAttempts ?? 0),
			})),
		}
	}

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
			.where('testId', '=', this.test.id)
			.where('hasEnded', '=', 1);
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
			.where('candidateId', '=', candidateId)
			.where('hasEnded', '=', 1);

		const result = await query.executeTakeFirst();

		// Get candidate rank if candidateId is provided
		let candidateRank: number = 0;
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
		return {
			candidateId: candidateId,
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