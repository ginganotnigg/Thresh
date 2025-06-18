import { db } from "../../../../configs/orm/kysely/db";
import { QueryHandlerBase } from "../../../../shared/base/usecase.base";
import { DomainError } from "../../../../shared/errors/domain.error";
import { GetAttemptQueryParam } from "./param";
import { GetAttemptQueryResponse } from "./response";

export class GetAttemptQueryHandler extends QueryHandlerBase<
	GetAttemptQueryParam,
	GetAttemptQueryResponse
> {
	async handle(data: GetAttemptQueryParam): Promise<GetAttemptQueryResponse> {
		const attemptId = this.getId();
		if (!attemptId) {
			throw new DomainError("Attempt ID is required");
		}
		const {
			agg_answered,
			agg_answeredCorrect,
			agg_points,
			include_test,
		} = data;

		let query = db.selectFrom("Attempts")
			.where("Attempts.id", "=", attemptId)
			.selectAll("Attempts")
			.select((eb) => [
				eb
					.selectFrom("AttemptsAnswerQuestions")
					.where("AttemptsAnswerQuestions.AttemptId", "=", attemptId)
					.select(eb => [
						eb.fn.count("AttemptsAnswerQuestions.id").as("answered"),
					]).as("answered"),
				eb
					.selectFrom("AttemptsAnswerQuestions")
					.innerJoin("Questions", "AttemptsAnswerQuestions.QuestionId", "Questions.id")
					.where("AttemptsAnswerQuestions.AttemptId", "=", attemptId)
					.whereRef("AttemptsAnswerQuestions.pointsReceived", "=", "Questions.points")
					.select(eb => [
						eb.fn.count("AttemptsAnswerQuestions.id").as("answeredCorrect"),
					]).as("answeredCorrect"),
				eb
					.selectFrom("AttemptsAnswerQuestions")
					.where("AttemptsAnswerQuestions.AttemptId", "=", attemptId)
					.select(eb => [
						eb.fn.sum("AttemptsAnswerQuestions.pointsReceived").as("pointsReceived"),
					]).as("pointsReceived"),
			])

		const newQuery = query.$if(include_test === "1", (eb) => {
			return eb
				.innerJoin("Tests", "Attempts.TestId", "Tests.id")
				.selectAll("Tests")
				.select([
					"Tests.createdAt as TestCreatedAt",
					"Tests.updatedAt as TestUpdatedAt",
				]);
		});

		const res = await newQuery.executeTakeFirst();
		if (!res) {
			throw new DomainError("Attempt not found");
		}

		const response: GetAttemptQueryResponse = {
			id: res.id,
			candidateId: res.candidateId,
			testId: res.TestId!,
			createdAt: res.createdAt!,
			updatedAt: res.updatedAt!,
			hasEnded: Boolean(res.hasEnded),
			order: res.order,
			secondsSpent: res.secondsSpent,
			status: res.status,
			_aggregate: {
				answered: agg_answered === "1" ? Number(res.answered) : undefined,
				answeredCorrect: agg_answeredCorrect === "1" ? Number(res.answeredCorrect) : undefined,
				points: agg_points === "1" ? Number(res.pointsReceived) : undefined,
			},
			_include: {
				test: include_test === "1" ? {
					id: res.TestId!,
					authorId: res.authorId!,
					title: res.title!,
					description: res.description!,
					language: res.language!,
					minutesToAnswer: res.minutesToAnswer!,
					mode: res.mode!,
					createdAt: res.TestCreatedAt!,
					updatedAt: res.TestUpdatedAt!,
				} : undefined,
			}
		};
		return response;
	}
}