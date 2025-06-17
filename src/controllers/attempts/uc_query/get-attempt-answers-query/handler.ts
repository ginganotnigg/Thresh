import { db } from "../../../../configs/orm/kysely/db";
import { QuestionTypeType } from "../../../../domain/enum";
import { QueryHandlerBase } from "../../../shared/base/usecase.base";
import { GetAttemptAnswersQueryParam } from "./param";
import { GetAttemptAnswersResponse } from "./response";

export class GetAttemptAnswersQueryHandler extends QueryHandlerBase<GetAttemptAnswersQueryParam, GetAttemptAnswersResponse> {
	async handle(params: GetAttemptAnswersQueryParam): Promise<GetAttemptAnswersResponse> {
		const attemptId = this.getId();
		let query = db
			.selectFrom("AttemptsAnswerQuestions as aaq")
			.where("aaq.AttemptId", "=", attemptId)
			.leftJoin("AttemptsAnswerMCQQuestions as mcqa", "mcqa.attemptAnswerQuestionId", "aaq.id")
			.leftJoin("AttemptsAnswerLAQuestions as laqa", "laqa.attemptAnswerQuestionId", "aaq.id")
			.selectAll("aaq")
			.select([
				"mcqa.attemptAnswerQuestionId as mcqa_AttemptAnswerQuestionId",
				"mcqa.chosenOption as chosenOption",
				"laqa.attemptAnswerQuestionId as laqa_AttemptAnswerQuestionId",
				"laqa.answer as answer",
			])
			;

		const res = await query.execute();
		const response: GetAttemptAnswersResponse = res.map(r => {
			const questionType: QuestionTypeType =
				r.laqa_AttemptAnswerQuestionId != null
					? "LONG_ANSWER"
					: r.mcqa_AttemptAnswerQuestionId != null
						? "MCQ"
						: "MCQ"; // Default to MCQ if neither is present
			return {
				id: r.id,
				attemptId: r.AttemptId!,
				questionId: r.QuestionId!,
				pointReceived: r.pointsReceived!,
				createdAt: r.createdAt!,
				updatedAt: r.updatedAt!,
				child: {
					type: questionType,
					...(questionType === "MCQ"
						? {
							chosenOption: r.chosenOption!,
						}
						: questionType === "LONG_ANSWER"
							? {
								answer: r.answer!,
							}
							: {
								chosenOption: 0, // Default value for MCQ
							}),
				},

			}
		});
		return response;
	}
}

