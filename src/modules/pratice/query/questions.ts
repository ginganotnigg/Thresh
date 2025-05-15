import { TestQueryRepo } from "../../../domain/repo/test/test.query-repo";
import { QuestionToDo } from "../../../domain/schema/variants.schema";
import checkSelfTest from "../domain/check-self-test";

export async function querySelfQuestions(testId: string, authorId: string): Promise<QuestionToDo[]> {
	await checkSelfTest(testId, authorId);
	return await TestQueryRepo.getQuestions(testId);
}