import { DomainError } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import User from "../../../../domain/models/user";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { AttemptsCurrentQuery } from "../../schema/controller-schema";

export async function queryAttemptsCurrent(params: AttemptsCurrentQuery): Promise<AttemptInfo> {
	const { testId, candidateId } = params;
	const candidate = await User.findByPk(candidateId);
	if (!candidate) {
		throw new DomainError("Candidate not found");
	}
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
				include: ["Author"],
			},
			"Candidate",
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
		test: {
			...attempt.Test!.toJSON(),
			author: attempt.Test!.Author!.toJSON(),
		},
		candidate: attempt.Candidate!.toJSON(),
	}
}