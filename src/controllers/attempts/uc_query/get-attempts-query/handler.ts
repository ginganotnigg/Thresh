import { db } from "../../../../configs/orm/kysely/db";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetAttemptsQueryParam } from "./param";
import { GetAttemptsResourceResponse } from "./response";
import { paginate } from "../../../../shared/common/query";

export class GetAttemptsQueryHandler extends QueryHandlerBase<GetAttemptsQueryParam, GetAttemptsResourceResponse> {
	async handle(params: GetAttemptsQueryParam): Promise<GetAttemptsResourceResponse> {
		const {
			testId,
			candidateId,
			status,
			page,
			perPage,
		} = params;

		let query = db
			.selectFrom("Attempts")
			.leftJoin("Tests as t", "t.id", "Attempts.TestId")
			.select([
				"t.id as TestId",
				"t.authorId",
				"t.title",
				"t.description",
				"t.minutesToAnswer",
				"t.language",
				"t.createdAt as TestCreatedAt",
				"t.updatedAt as TestUpdatedAt",
				"t.mode",
			])
			.selectAll()
			.select(eb => [
				eb.selectFrom("AttemptsAnswerQuestions as aaq")
					.whereRef("aaq.AttemptId", "=", "Attempts.id")
					.select(eb => [
						eb.fn.count<number>("aaq.id").as("answered")
					]).as("answered")
				,
				eb.selectFrom("Questions as q")
					.whereRef("q.TestId", "=", "Attempts.TestId")
					.select(eb => [
						eb.fn.sum<number>("q.points").as("points")
					]).as("points")
				,
				eb.selectFrom("AttemptsAnswerQuestions as aaq")
					.innerJoin(
						"Questions as q",
						(join) => join
							.onRef("q.id", "=", "aaq.QuestionId")
							.onRef("q.points", "=", "aaq.pointsReceived")
					)
					.select(eb => [
						eb.fn.count<number>("aaq.AttemptId").as("answeredCorrect")
					]).as("answeredCorrect")
			])

		if (testId) {
			query = query.where("Attempts.TestId", "=", testId);
		}
		if (candidateId) {
			query = query.where("Attempts.candidateId", "=", candidateId);
		}
		if (status) {
			query = query.where("Attempts.status", "=", status);
		}

		const result = await paginate(query, page, perPage);
		const raw = result.data;

		const data: GetAttemptsResourceResponse["data"] = raw.map(r => {
			const attemptData: GetAttemptsResourceResponse["data"][number] = {
				id: r.id!,
				order: r.order,
				testId: r.TestId!,
				candidateId: r.candidateId,
				hasEnded: r.hasEnded === 1,
				status: r.status,
				secondsSpent: r.secondsSpent,
				createdAt: r.createdAt!,
				updatedAt: r.updatedAt!,
				_aggregate: {
					points: r.points ?? 0,
					answered: r.answered ?? 0,
					answeredCorrect: r.answeredCorrect ?? 0,
				},
				_include: {
					test: {
						id: r.TestId!,
						authorId: r.authorId!,
						title: r.title!,
						description: r.description!,
						minutesToAnswer: r.minutesToAnswer!,
						language: r.language!,
						createdAt: r.TestCreatedAt!,
						updatedAt: r.TestUpdatedAt!,
						mode: r.mode!,
					},
				},
			}
			return attemptData;
		});

		return {
			...result,
			data,
		};
	}
}

