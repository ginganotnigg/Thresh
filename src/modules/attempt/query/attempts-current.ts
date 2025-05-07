import { DomainErrorResponse } from "../../../controller/errors/domain.error";
import Attempt from "../../../domain/models/attempt";
import Test from "../../../domain/models/test";
import User from "../../../domain/models/user";
import { AttemptInfo } from "../../../domain/schema/info.schema";
import { AttemptsCurrentQuery } from "../schema/controller-schema";

export async function queryAttemptsCurrent(params: AttemptsCurrentQuery): Promise<AttemptInfo> {
	const { testId, candidateId } = params;
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
		throw new DomainErrorResponse("No current attempt found for this test and candidate");
	}
	if (attempts.length > 1) {
		throw new DomainErrorResponse("Multiple current attempts found for this test and candidate");
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