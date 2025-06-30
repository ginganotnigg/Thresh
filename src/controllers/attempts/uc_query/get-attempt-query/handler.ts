import { db } from "../../../../configs/orm/kysely/db";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { DomainError } from "../../../../shared/errors/domain.error";
import { GetAttemptQueryParam } from "./param";
import { GetAttemptQueryResponse } from "./response";

export class GetAttemptQueryHandler extends QueryHandlerBase<
	GetAttemptQueryParam,
	GetAttemptQueryResponse
> {
	async handle(): Promise<GetAttemptQueryResponse> {
		const attemptId = this.getId();
		if (!attemptId) {
			throw new DomainError("Attempt ID is required");
		}

		let query = db
			.selectFrom("Attempts")
			.where("Attempts.id", "=", attemptId)
			.innerJoin("Tests", "Attempts.testId", "Tests.id")
			.selectAll(["Attempts", "Tests"])
			.select([
				"Attempts.id as id",
				"Attempts.createdAt as createdAt",
				"Attempts.updatedAt as updatedAt",
				"Tests.createdAt as TestCreatedAt",
				"Tests.updatedAt as TestUpdatedAt",
			])
			.select((eb) => [
				eb
					.selectFrom("AttemptsAnswerQuestions")
					.where("AttemptsAnswerQuestions.attemptId", "=", attemptId)
					.select(eb => [
						eb.fn.count("AttemptsAnswerQuestions.id").as("answered"),
					]).as("answered"),
				eb
					.selectFrom("AttemptsAnswerQuestions")
					.innerJoin("Questions", "AttemptsAnswerQuestions.questionId", "Questions.id")
					.where("AttemptsAnswerQuestions.attemptId", "=", attemptId)
					.whereRef("AttemptsAnswerQuestions.pointsReceived", "=", "Questions.points")
					.select(eb => [
						eb.fn.count("AttemptsAnswerQuestions.id").as("answeredCorrect"),
					]).as("answeredCorrect"),
				eb
					.selectFrom("AttemptsAnswerQuestions")
					.where("AttemptsAnswerQuestions.attemptId", "=", attemptId)
					.select(eb => [
						eb.fn.sum("AttemptsAnswerQuestions.pointsReceived").as("pointsReceived"),
					]).as("pointsReceived"),
			])

		const res = await query.executeTakeFirst();
		if (!res) {
			throw new DomainError("Attempt not found");
		}

		const response: GetAttemptQueryResponse = {
			id: res.id,
			candidateId: res.candidateId,
			testId: res.testId!,
			createdAt: res.createdAt!,
			updatedAt: res.updatedAt!,
			hasEnded: Boolean(res.hasEnded),
			order: res.order,
			secondsSpent: res.secondsSpent,
			status: res.status,
			_aggregate: {
				answered: Number(res.answered),
				answeredCorrect: Number(res.answeredCorrect),
				points: Number(res.pointsReceived),
			},
			_include: {
				test: {
					id: res.testId!,
					authorId: res.authorId!,
					title: res.title!,
					description: res.description!,
					language: res.language!,
					minutesToAnswer: res.minutesToAnswer!,
					mode: res.mode!,
					createdAt: res.TestCreatedAt!,
					updatedAt: res.TestUpdatedAt!,
				},
			}
		};
		return response;
	}
}