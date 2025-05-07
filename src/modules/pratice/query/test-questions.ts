import Question from "../../../domain/models/question";
import { DomainError } from "../../../controller/errors/domain.error";
import { TestId } from "../../../domain/schema/id.schema";
import { QuestionCore } from "../../../domain/schema/core.schema";

export async function queryTestQuestions(param: TestId): Promise<QuestionCore[]> {
	const { testId } = param;

	const questions = await Question.findAll({
		where: {
			testId: testId
		},
		order: [['id', 'ASC']]
	});

	if (!questions || questions.length === 0) {
		throw new DomainError(`No questions found for test with ID ${testId}`);
	}

	return questions;
}