import { DomainError } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import { AttemptComputeQuery, AttemptComputeResponse } from "../../schema";

export async function queryAttemptCompute(attemptId: string, query: AttemptComputeQuery): Promise<AttemptComputeResponse> {
	const { secondsLeft } = query;
	const res: AttemptComputeResponse = {};
	if (secondsLeft != null && secondsLeft === true) {
		const attempt = await Attempt.findByPk(attemptId, {
			include: ["Test"],
		});
		if (!attempt) {
			throw new DomainError(`Attempt with ID ${attemptId} not found`);
		}
		const now = new Date();
		const startTime = attempt.createdAt.getTime();
		const endTime = attempt.Test!.minutesToAnswer * 60 * 1000 + startTime;
		const timeLeft = endTime - now.getTime();
		res.secondsLeft = timeLeft > 0 ? (timeLeft / 1000) : 0;
	}
	return res;
}