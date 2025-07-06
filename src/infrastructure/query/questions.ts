import { db } from "../../configs/orm/kysely/db";
import { QuestionLoad } from "../../domain/_mappers/QuestionMapper";

export const queryQuestions = async (params: {
	testId?: string;
	questionIds?: number[];
	attemptId?: string;
}): Promise<QuestionLoad[]> => {
	const { testId, questionIds, attemptId } = params;
	let query = await db
		.selectFrom("Questions")
		.leftJoin("MCQQuestions", "Questions.id", "MCQQuestions.questionId")
		.leftJoin("LAQuestions", "Questions.id", "LAQuestions.questionId")
		.selectAll("Questions")
		.select([
			"MCQQuestions.questionId as mcqQuestionId",
			"MCQQuestions.correctOption as correctOption",
			"MCQQuestions.options as options",
			"LAQuestions.questionId as laQuestionId",
			"LAQuestions.correctAnswer as correctAnswer",
			"LAQuestions.extraText as extraText",
			"LAQuestions.imageLinks as imageLinks",
		])
		;

	if (testId) {
		query = query.where("Questions.testId", "=", testId);
	}
	if (questionIds && questionIds.length > 0) {
		query = query.where("Questions.id", "in", questionIds);
	}
	if (attemptId) {
		query = query
			.innerJoin("AttemptsAnswerQuestions", "Questions.id", "AttemptsAnswerQuestions.questionId")
			.where("AttemptsAnswerQuestions.attemptId", "=", attemptId)
			;
	}

	const questions = await query.execute();
	const mappedQuestions: QuestionLoad[] = questions.map((question): QuestionLoad => {
		return {
			id: question.id,
			text: question.text,
			type: question.type,
			points: question.points,
			detail: (question.mcqQuestionId != null
				? {
					type: "MCQ",
					correctOption: question.correctOption!,
					options: (question.options as string[]) || [],
				}
				: {
					type: "LONG_ANSWER",
					correctAnswer: question.correctAnswer!,
					extraText: question.extraText,
					imageLinks: (question.imageLinks as string[]) || [],
				}
			),
		};
	});

	return mappedQuestions;
};
