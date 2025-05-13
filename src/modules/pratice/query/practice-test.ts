import Test from "../../../domain/models/test";
import PracticeTest from "../../../domain/models/practice_test";
import Feedback from "../../../domain/models/feedback";
import { TestPracticeInfo } from "../../../domain/schema/info.schema";

export async function queryPracticeTest(testId: string): Promise<TestPracticeInfo> {
	const tests = await Test.findByPk(testId, {
		include: [{
			model: PracticeTest,
			required: true,
			include: [{
				model: Feedback,
				required: false,
			}],
		}],
	});
	if (!tests) {
		throw new Error(`Test with ID ${testId} not found`);
	}
	return {
		...tests.toJSON(),
		...tests.PracticeTest!.toJSON(),
		feedback: tests.PracticeTest?.Feedback,
	}
}
