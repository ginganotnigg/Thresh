import Question from "../../../domain/models/question";
import { DomainErrorResponse } from "../../../controller/errors/domain.error";
import { TestId } from "../schema/query.schema";
import { QuestionCore } from "../../../domain/tests/schema/core.schema";

export async function queryTestQuestions(param: TestId): Promise<QuestionCore[]> {
	const { testId } = param;

	const questions = await Question.findAll({
		where: {
			testId: testId
		},
		order: [['id', 'ASC']]
	});

	if (!questions || questions.length === 0) {
		throw new DomainErrorResponse(`No questions found for test with ID ${testId}`);
	}

	return questions;
}