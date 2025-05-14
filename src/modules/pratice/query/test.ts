import Test from "../../../domain/models/test";
import PracticeTest from "../../../domain/models/practice_test";
import Feedback from "../../../domain/models/feedback";
import { TestPracticeInfo } from "../../../domain/schema/info.schema";

export async function querySelfTest(testId: string, authorId: string): Promise<TestPracticeInfo> {
	const test = await Test.findByPk(testId, {
		include: [{
			model: PracticeTest,
			required: true,
			include: [{
				model: Feedback,
				required: false,
			}],
		}],
	});
	if (!test) {
		throw new Error(`Test with ID ${testId} not found`);
	}
	if (test.authorId !== authorId) {
		throw new Error(`Test with ID ${testId} does not belong to author with ID ${authorId}`);
	}
	return {
		...test.toJSON(),
		...test.PracticeTest!.toJSON(),
		feedback: test.PracticeTest?.Feedback,
	}
}
