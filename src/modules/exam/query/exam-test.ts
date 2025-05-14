import { DomainError } from "../../../controller/errors/domain.error";
import ExamTest from "../../../domain/models/exam_test";
import Test from "../../../domain/models/test";
import { ExamTestInfo } from "../../../domain/schema/info.schema";

export async function queryExamTest(testId: string): Promise<ExamTestInfo> {
	const test = await Test.findByPk(testId, {
		include: [{
			model: ExamTest,
			required: true,
		}]
	});
	if (!test) {
		throw new DomainError("Test not found");
	}
	return {
		...test.get(),
		...test.ExamTest!.get(),
		hasPassword: test.ExamTest!.password !== null,
	}
}