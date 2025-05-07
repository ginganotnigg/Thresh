import { DomainErrorResponse } from "../../../controller/errors/domain.error";
import Attempt from "../../../domain/models/attempt";
import { AttemptComputeQuery, AttemptComputeResponse } from "../schema/controller-schema";

export async function queryAttemptCompute(attemptId: string, query: AttemptComputeQuery): Promise<AttemptComputeResponse> {
	const { timeLeft } = query;
	const res: AttemptComputeResponse = {};
	if (timeLeft != null && timeLeft === true) {
		const attempt = await Attempt.findByPk(attemptId, {
			include: ["Test"],
		});
		if (!attempt) {
			throw new DomainErrorResponse(`Attempt with ID ${attemptId} not found`);
		}
		if (attempt.hasEnded === true) {
			throw new DomainErrorResponse(`Attempt with ID ${attemptId} has already ended`);
		}
		const now = new Date();
		const startTime = attempt.createdAt.getTime();
		const endTime = attempt.Test!.minutesToAnswer * 60 * 1000 + startTime;
		const timeLeft = endTime - now.getTime();
		res.timeLeft = timeLeft > 0 ? timeLeft : 0;
	}
	return res;
}