import { TestQuery } from "../../../domain/core/query/test.query";
import { QuestionNoAnswer } from "../../../domain/schema/variants.schema";
import checkSelfTest from "../domain/check-self-test";

export async function querySelfQuestions(testId: string, authorId: string): Promise<QuestionNoAnswer[]> {
	await checkSelfTest(testId, authorId);
	return await TestQuery.getTestQuestions(testId);
}