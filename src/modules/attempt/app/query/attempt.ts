import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import User from "../../../../domain/models/user";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { DomainErrorResponse } from "../../../../controller/errors/domain.error";

export async function queryAttempt(id: string): Promise<AttemptInfo> {
	const attempt = await Attempt.findByPk(id, {
		include: [
			{
				model: Test,
				include: [User],
			},
			{
				model: User,
			}
		]
	});

	if (!attempt) {
		throw new DomainErrorResponse(`Attempt with id ${id} not found`);
	}

	return {
		...attempt.toJSON(),
		test: {
			...attempt.Test!.toJSON(),
			author: attempt.Test!.Author!.toJSON(),
		},
		candidate: attempt.Candidate!.toJSON(),
	};
}