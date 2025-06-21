import { db } from "../../../../configs/orm/kysely/db";
import { AnswerForQuestionCommon } from "../../../../schemas/common/answer-for-question-type";
import { QuestionTypeType } from "../../../../shared/enum";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetAttemptAnswersQueryParam } from "./param";
import { GetAttemptAnswersResponse } from "./response";

export class GetAttemptAnswersQueryHandler extends QueryHandlerBase<GetAttemptAnswersQueryParam, GetAttemptAnswersResponse> {
	async handle(_: GetAttemptAnswersQueryParam): Promise<GetAttemptAnswersResponse> {
		const attemptId = this.getId();
		let query = db
			.selectFrom("AttemptsAnswerQuestions as aaq")
			.where("aaq.attemptId", "=", attemptId)
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

			const child: AnswerForQuestionCommon = questionType === "MCQ" ? {
				type: "MCQ",
				chosenOption: r.chosenOption!,
			} : {
				type: "LONG_ANSWER",
				answer: r.answer!,
			}
			return {
				id: r.id,
				attemptId: r.attemptId!,
				questionId: r.questionId!,
				pointReceived: r.pointsReceived!,
				createdAt: r.createdAt!,
				updatedAt: r.updatedAt!,
				child,
			}
		});
		return response;
	}
}

