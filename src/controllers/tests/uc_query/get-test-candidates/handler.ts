import { sql } from "kysely";
import { db } from "../../../../configs/orm/kysely/db";
import { paginate } from "../../../../shared/common/query";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetTestCandidatesQuery } from "./param";
import { GetTestCandidatesResponse } from "./response";

export class GetCanddiatesQueryHandler extends QueryHandlerBase<GetTestCandidatesQuery, GetTestCandidatesResponse> {
	async handle(param: GetTestCandidatesQuery): Promise<GetTestCandidatesResponse> {
		const testId = this.getId();
		const {
			page,
			perPage,
			sortByRank,
		} = param;

		let query = db
			.selectFrom("Attempts as a")
			.leftJoin(eb => eb
				.selectFrom("AttemptsAnswerQuestions as aaq")
				.select(eb => [
					"aaq.AttemptId",
					eb.fn.sum<number>("aaq.pointsReceived").as("points"),
				])
				.as("aaqStats")
				,
				(join) => join.onRef("aaqStats.AttemptId", "=", "a.id")
			)
			.where("a.TestId", "=", testId)
			.groupBy("a.candidateId")
			.select(eb => [
				"a.candidateId",
				eb.fn.count<number>("a.id").as("totalAttempts"),
				eb.fn.max<number>("aaqStats.points").as("highestScore"),
				eb.fn.min<number>("aaqStats.points").as("lowestScore"),
				eb.fn.avg<number>("aaqStats.points").as("averageScore"),
				eb.fn.avg<number>("a.secondsSpent").as("averageTime"),
				sql<number>`RANK() OVER (ORDER BY aaqStats.points DESC a.secondsSpent ASC)`.as("rank"),
			])
			;

		if (sortByRank != null) {
			query = query.orderBy("rank", sortByRank);
		}

		const res = await paginate(query, page, perPage);
		return {
			...res,
			data: res.data.map(item => ({
				candidateId: item.candidateId,
				_aggregate: {
					averageScore: item.averageScore ?? 0,
					highestScore: item.highestScore ?? 0,
					lowestScore: item.lowestScore ?? 0,
					averageTime: item.averageTime ?? 0,
					rank: item.rank ?? 0,
					totalAttempts: item.totalAttempts ?? 0,
				}
			}))
		}
	}
}