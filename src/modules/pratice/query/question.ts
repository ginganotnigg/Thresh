import { DomainError } from "../../../controller/errors/domain.error";
import { TestQuery } from "../../../domain/core/query/test.query";
import checkSelfTest from "../domain/check-self-test";

export default async function querySelfQuestion(questionId: number, authorId: string) {
	const question = await TestQuery.getQuestion({ questionId });
	const testId = question.testId;
	try {
		await checkSelfTest(testId, authorId);
	} catch (error) {
		throw new DomainError(`Not found question with ID ${questionId} of test with ID ${testId} for author with ID ${authorId}`);
	}
}