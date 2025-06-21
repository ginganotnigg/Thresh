import { sql } from "kysely";
import { db } from "../../../../configs/orm/kysely/db";
import { paginate } from "../../../../shared/handler/query";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetTestParticipantsQuery } from "./param";
import { GetTestParticipantsResponse } from "./response";

export class GetTestParticipantsQueryHandler extends QueryHandlerBase<GetTestParticipantsQuery, GetTestParticipantsResponse> {
	async handle(param: GetTestParticipantsQuery): Promise<GetTestParticipantsResponse> {
		const testId = this.getId();
		const {
			page,
			perPage,
			sortByRank,
		} = param;

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

		if (sortByRank != null) {

		}

		const res = await paginate(query, page, perPage);
		return {
			...res,
			data: res.data.map(item => ({
				candidateId: item.candidateId,
				_aggregate: {
					averageScore: Number(item.averageScore) || 0,
					highestScore: Number(item.highestScore) || 0,
					lowestScore: Number(item.lowestScore) || 0,
					averageTime: Number(item.averageTime) || 0,
					rank: Number(item.rank) || 0,
					totalAttempts: Number(item.totalAttempts) || 0,
				}
			})),
		}
	}
}