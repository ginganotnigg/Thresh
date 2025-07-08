import { sql } from "kysely";
import { db } from "../../../../configs/orm/kysely/db";
import { paginate } from "../../../../shared/handler/query";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetTestParticipantResponse } from "./response";
import { DomainError } from "../../../../shared/errors/domain.error";

export class GetTestParticipantsQueryHandler extends QueryHandlerBase<void, GetTestParticipantResponse, {
	testId: string;
	candidateId: string;
}> {
	async handle(): Promise<GetTestParticipantResponse> {
		const { testId, candidateId } = this.getId();
		const innerQuery = db
			.selectFrom('ExamParticipants as ep')
			.leftJoin('Attempts as a', join =>
				join
					.onRef('ep.candidateId', '=', 'a.candidateId')
					.onRef('ep.testId', '=', 'a.testId')
			)
			.leftJoin(
				db
					.selectFrom('AttemptsAnswerQuestions as aaq')
					.select([
						'aaq.attemptId',
						sql<number>`SUM(aaq.pointsReceived)`.as('points'),
					])
					.groupBy('aaq.attemptId')
					.as('aaqStats'),
				'aaqStats.attemptId',
				'a.id'
			)
			.where('ep.testId', '=', testId)
			.where('ep.candidateId', '=', candidateId)
			.groupBy('ep.candidateId')
			.select([
				'ep.candidateId as candidateId',
				sql<number>`COALESCE(COUNT(a.id), 0)`.as('totalAttempts'),
				sql<number>`COALESCE(MAX(aaqStats.points), 0)`.as('highestScore'),
				sql<number>`COALESCE(MIN(aaqStats.points), 0)`.as('lowestScore'),
				sql<number>`COALESCE(AVG(aaqStats.points), 0)`.as('averageScore'),
				sql<number>`COALESCE(AVG(a.secondsSpent), 0)`.as('averageTime'),
			])
			.as('stats');

		let query = db
			.selectFrom(innerQuery)
			.select([
				'candidateId',
				'totalAttempts',
				'highestScore',
				'lowestScore',
				'averageScore',
				'averageTime',
				sql<number>`RANK() OVER (ORDER BY highestScore DESC, averageTime ASC)`.as('rank'),
			]);

		const res = await query.executeTakeFirst();
		if (!res) throw new DomainError('Test participant not found');
		return {
			candidateId: res.candidateId,
			_aggregate: {
				averageScore: Number(res.averageScore) || 0,
				highestScore: Number(res.highestScore) || 0,
				lowestScore: Number(res.lowestScore) || 0,
				averageTime: Number(res.averageTime) || 0,
				rank: Number(res.rank) || 0,
				totalAttempts: Number(res.totalAttempts) || 0,
			}
		}
	}
}