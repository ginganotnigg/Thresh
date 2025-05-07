import { DomainError } from "../../../controller/errors/domain.error";
import Question from "../../../domain/models/question";
import Test from "../../../domain/models/test";
import { TestAggregateQuery, TestAggregateResponse } from "../schema";

export async function queryTestAggregate(testId: string, query: TestAggregateQuery): Promise<TestAggregateResponse> {
	const { numberOfQuestions } = query;
	const test = await Test.findOne({ where: { id: testId } });
	if (!test) throw new DomainError("Test not found");
	const res: TestAggregateResponse = {};
	if (query.numberOfQuestions && numberOfQuestions === true) {
		const numberOfQuestions = await Question.count({ where: { testId: test.id } });
		res.numberOfQuestions = numberOfQuestions;
	}
	return res;
}