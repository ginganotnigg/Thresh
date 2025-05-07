import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { DomainError } from "../../../../controller/errors/domain.error";

export async function queryAttempt(id: string): Promise<AttemptInfo> {
	const attempt = await Attempt.findByPk(id, {
		include: [
			{
				model: Test,
				include: ["Author"],
			},
			"Candidate",
		]
	});

	if (!attempt) {
		throw new DomainError(`Attempt with id ${id} not found`);
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