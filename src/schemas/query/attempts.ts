import { z } from "zod";
import { db } from "../../configs/orm/kysely/db";
import { GetAttemptsResourceResponse } from "../../controllers/attempts/uc_query/get-attempts-query/response";
import { paginate } from "../../shared/handler/query";
import { PagedSchema } from "../../shared/controller/schemas/base";
import { AttemptCoreSchema } from "../core/attempt";
import { QueryAttemptsParam } from "../params/attempts";

const QueryAttemptsResponseSchema = PagedSchema(AttemptCoreSchema);
export type QueryAttemptsResponse = z.infer<typeof QueryAttemptsResponseSchema>;

export async function queryAttempts(params: QueryAttemptsParam): Promise<QueryAttemptsResponse> {
	const {
		testId,
		candidateId,
		status,
		page,
		perPage,
		sortByPoints,
		sortByCreatedAt,
		sortBySecondsSpent,
	} = params;

	let query = db
		.selectFrom("Attempts")
		.leftJoin("Tests as t", "t.id", "Attempts.testId")
		.selectAll(["Attempts"])
		.select([
			"t.id as testId",
			"t.authorId",
			"t.title",
			"t.description",
			"t.minutesToAnswer",
			"t.language",
			"t.createdAt as TestCreatedAt",
			"t.updatedAt as TestUpdatedAt",
			"t.mode",
		])
		.select(eb => [
			eb.selectFrom("AttemptsAnswerQuestions as aaq")
				.whereRef("aaq.attemptId", "=", "Attempts.id")
				.select(eb => [
					eb.fn.count<number>("aaq.id").as("answered")
				]).as("answered")
			,
			eb.selectFrom("AttemptsAnswerQuestions as aaq")
				.innerJoin(
					"Questions as q",
					(join) => join
						.onRef("q.id", "=", "aaq.questionId")
						.onRef("q.points", "=", "aaq.pointsReceived")
				)
				.select(eb => [
					eb.fn.count<number>("aaq.attemptId").as("answeredCorrect")
				]).as("answeredCorrect")
		])
		.leftJoin(eb => eb
			.selectFrom("AttemptsAnswerQuestions as aaq")
			.select(eb => [
				"aaq.attemptId",
				eb.fn.sum<number>("aaq.pointsReceived").as("points")
			])
			.groupBy("aaq.attemptId")
			.as("attemptPoints")
			, join => join
				.onRef("Attempts.id", "=", "attemptPoints.attemptId")
		)
		.select("attemptPoints.points")

	if (testId) {
		query = query.where("Attempts.testId", "=", testId);
	}
	if (candidateId) {
		query = query.where("Attempts.candidateId", "=", candidateId);
	}
	if (status) {
		query = query.where("Attempts.status", "=", status);
	}
	if (sortByPoints) {
		query = query.orderBy("attemptPoints.points", sortByPoints);
	}
	if (sortByCreatedAt) {
		query = query.orderBy("Attempts.createdAt", sortByCreatedAt);
	}
	if (sortBySecondsSpent) {
		query = query.orderBy("Attempts.secondsSpent", sortBySecondsSpent);
	}

	const result = await paginate(query, page, perPage);
	const raw = result.data;

	const data: GetAttemptsResourceResponse["data"] = raw.map(r => {
		const attemptData: GetAttemptsResourceResponse["data"][number] = {
			id: r.id!,
			order: r.order,
			testId: r.testId!,
			candidateId: r.candidateId,
			hasEnded: r.hasEnded === 1,
			status: r.status,
			secondsSpent: r.secondsSpent,
			createdAt: r.createdAt!,
			updatedAt: r.updatedAt!,
			_aggregate: {
				points: Number(r.points) ?? 0,
				answered: Number(r.answered) ?? 0,
				answeredCorrect: Number(r.answeredCorrect) ?? 0,
			},
			_include: {
				test: {
					id: r.testId!,
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