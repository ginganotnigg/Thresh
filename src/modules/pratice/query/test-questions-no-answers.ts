import Question from "../../../domain/models/question";
import { QuestionNoAnswer } from "../../../domain/tests/schema/extend.schema";
import { TestId } from "../schema/query.schema";

export async function queryTestQuestionsNoAnswers(param: TestId): Promise<QuestionNoAnswer[]> {
	const { testId } = param;
	const attributes = Question.getAttributes();
	type Keys = keyof typeof attributes;
	const excludeKeys: Keys[] = ["correctOption"];

	const questions = await Question.findAll({
		where: {
			testId: testId
		},
		attributes: { exclude: excludeKeys },
		order: [['id', 'ASC']],
	});

	return questions;
}