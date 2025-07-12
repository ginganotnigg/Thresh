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
		const credential = this.getCredentials();

		if (!attemptId) {
			throw new DomainError("Attempt ID is required");
		}

		let query = db
			.selectFrom("Attempts as a")
			.where("a.id", "=", attemptId)
			.innerJoin("Tests as t", "a.testId", "t.id")
			.selectAll(["a"])
			.select([
				"t.authorId",
				"t.id as testId",
				"t.title",
				"t.description",
				"t.language",
				"t.minutesToAnswer",
				"t.mode",
				"t.createdAt as TestCreatedAt",
				"t.updatedAt as TestUpdatedAt",
			])
			.select((eb) => [
				eb
					.selectFrom("AttemptsAnswerQuestions as aaq")
					.where("aaq.attemptId", "=", attemptId)
					.select(eb => [
						eb.fn.count("aaq.id").as("answered"),
					]).as("answered"),
				eb
					.selectFrom("AttemptsAnswerQuestions as aaq")
					.innerJoin("Questions as q", "aaq.questionId", "q.id")
					.where("aaq.attemptId", "=", attemptId)
					.whereRef("aaq.pointsReceived", "=", "q.points")
					.select(eb => [
						eb.fn.count("aaq.id").as("answeredCorrect"),
					]).as("answeredCorrect"),
				eb
					.selectFrom("AttemptsAnswerQuestions as aaq")
					.where("aaq.attemptId", "=", attemptId)
					.select(eb => [
						eb.fn.sum("aaq.pointsReceived").as("pointsReceived"),
					]).as("pointsReceived"),
			])

		const res = await query.executeTakeFirst();
		if (!res) {
			throw new DomainError("Attempt not found");
		}

		// Not the author
		if (credential.userId !== res.authorId) {
			// Not the one who took the attempt
			if (credential.userId !== res.candidateId) {
				const hasMadeAttempt = await db
					.selectFrom("Attempts")
					.where("candidateId", "=", credential.userId)
					.where("testId", "=", res.testId)
					.select("id")
					.executeTakeFirst()
					;
				if (!hasMadeAttempt) {
					throw new DomainError("You can only view other people's attempts if you have made an attempt on this test.");
				}
			}
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