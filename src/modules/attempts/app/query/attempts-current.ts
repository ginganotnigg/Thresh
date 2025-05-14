import { DomainError } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { AttemptsCurrentQuery } from "../../schema";

export async function queryAttemptsCurrent(params: AttemptsCurrentQuery): Promise<AttemptInfo> {
	const { testId, candidateId } = params;
	const test = await Test.findByPk(testId);
	if (!test) {
		throw new DomainError("Test not found");
	}

	const attempts = await Attempt.findAll({
		where: {
			testId,
			candidateId,
			hasEnded: false,
		},
		include: [
			{
				model: Test,
			},
		],
	});
	if (attempts.length === 0) {
		throw new DomainError("No current attempt found for this test and candidate");
	}
	if (attempts.length > 1) {
		throw new DomainError("Multiple current attempts found for this test and candidate");
	}
	const attempt = attempts[0];
	return {
		...attempt.toJSON(),
	}
}