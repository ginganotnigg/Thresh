import { db } from "../../../../configs/orm/kysely/db";
import { QuestionDetailCommon } from "../../../../schemas/common/question-detail";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetTestQuestionsParam } from "./param";
import { GetTestQuestionsResponse } from "./response";

export class GetTestQuestionsHandler extends QueryHandlerBase<GetTestQuestionsParam, GetTestQuestionsResponse> {
	async handle(param: GetTestQuestionsParam): Promise<GetTestQuestionsResponse> {
		const { viewCorrectAnswer } = param;
		const testId = this.getId();
		const query = db
			.selectFrom("Questions as q")
			.where("q.testId", "=", testId)
			.leftJoin("MCQQuestions as mcq", "mcq.questionId", "q.id")
			.leftJoin("LAQuestions as laq", "laq.questionId", "q.id")
			.selectAll()
			.select(eb => [
				eb
					.selectFrom("AttemptsAnswerQuestions as aaq")
					.whereRef("aaq.questionId", "=", "q.id")
					.select(eb => [
						eb.fn.count<number>("aaq.id").as("numberOfAnswers"),
					]).as("numberOfAnswers")
				,
				eb
					.selectFrom("AttemptsAnswerQuestions as aaq")
					.whereRef("aaq.questionId", "=", "q.id")
					.whereRef("aaq.pointsReceived", "=", "q.points")
					.select(eb => [
						eb.fn.count<number>("aaq.id").as("numberOfCorrectAnswers"),
					]).as("numberOfCorrectAnswers")
				,
				eb
					.selectFrom("AttemptsAnswerQuestions as aaq")
					.whereRef("aaq.questionId", "=", "q.id")
					.select(eb => [
						eb.fn.avg<number>("aaq.pointsReceived").as("averageScore"),
					]).as("averageScore")
			])
			;
		const res = await query.execute();
		return res.map(raw => {
			let detail: QuestionDetailCommon | undefined = undefined;
			if (raw.type === "MCQ") {
				detail = {
					type: "MCQ",
					options: JSON.parse(raw.options!.toString()) as string[] || [],
					correctOption: raw.correctOption!,
				}
			}
			else {
				detail = {
					type: "LONG_ANSWER",
					correctAnswer: raw.correctAnswer!,
					extraText: raw.extraText,
					imageLinks: raw.imageLinks ? (JSON.parse(raw.imageLinks.toString()) as string[]) || [] : [],
				}
			}
			if (viewCorrectAnswer === "0") {
				if (detail.type === "MCQ") {
					detail.correctOption = null;
				}
				else {
					detail.correctAnswer = null;
				}
			}
			return {
				id: raw.id,
				testId: raw.testId!,
				text: raw.text,
				points: raw.points,
				type: raw.type,
				detail,
				_aggregate_test: {
					averageScore: raw.averageScore || 0,
					numberOfAnswers: raw.numberOfAnswers || 0,
					numberOfCorrectAnswers: raw.numberOfCorrectAnswers || 0,
				}
			}
		})
	}
}