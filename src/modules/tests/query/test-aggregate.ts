import { DomainError } from "../../../controller/errors/domain.error";
import Question from "../../../domain/models/question";
import Test from "../../../domain/models/test";
import { TestAggregateQuery, TestAggregateResponse } from "../schema";

export async function queryTestAggregate(testId: string, query: TestAggregateQuery): Promise<TestAggregateResponse> {
	const { numberOfQuestions, totalPoints } = query;
	const test = await Test.findOne({ where: { id: testId } });
	if (!test) throw new DomainError("Test not found");

	const res: TestAggregateResponse = {};
	if (numberOfQuestions && numberOfQuestions === true) {
		const numberOfQuestions = await Question.count({
			where: {
				testId: test.id
			}
		});
		res.numberOfQuestions = numberOfQuestions;
	}

	if (totalPoints && totalPoints === true) {
		const totalPoints = await Question.sum("points", {
			where: {
				testId: test.id
			}
		});
		res.totalPoints = totalPoints;
	}
	return res;
}