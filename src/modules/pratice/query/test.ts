import Test from "../../../domain/models/test";
import User from "../../../domain/models/user";
import { DomainErrorResponse } from "../../../controller/errors/domain.error";
import { TestId } from "../../../domain/schema/id.schema";
import { TestInfo } from "../../../domain/schema/info.schema";

export async function queryTest(param: TestId): Promise<TestInfo> {
	const { testId } = param;

	const test = await Test.findByPk(testId, {
		include: [{ model: User }]
	});

	if (!test) {
		throw new DomainErrorResponse(`Test with ID ${testId} not found`);
	}

	return {
		...test.toJSON(),
		author: {
			id: test.Author!.id,
			name: test.Author!.name,
			avatar: test.Author?.avatar ?? undefined,
		},
	};
}