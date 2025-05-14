import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { DomainError } from "../../../../controller/errors/domain.error";

export async function queryAttempt(attemptId: string): Promise<AttemptInfo> {
	const attempt = await Attempt.findByPk(attemptId, {
		include: [
			{
				model: Test,
			},
		]
	});

	if (!attempt) {
		throw new DomainError(`Attempt with id ${attemptId} not found`);
	}

	return {
		...attempt.toJSON(),
	};
}