import { DomainError } from "../../../controller/errors/domain.error";
import Test from "../../../domain/models/test";

export default async function checkSelfTest(testId: string, authorId: string): Promise<void> {
	const test = await Test.findOne({
		where: {
			id: testId,
			authorId: authorId,
		}
	});
	if (!test) {
		throw new DomainError(`Not found test with ID ${testId} for author with ID ${authorId}`);
	}
}