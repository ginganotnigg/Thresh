import { RetryableCommandHandlerBase } from "../../../../shared/handler/retryable-command.base";
import { AttemptRepo } from "../../../../infrastructure/repo/AttemptRepo";
import { PatchAttemptScoreBody } from "./body";
import { retryConfig } from "../../../../shared/config/retry.config";

export class PatchAttemptScoreHandler extends RetryableCommandHandlerBase<PatchAttemptScoreBody, void> {
	async handle(body: PatchAttemptScoreBody): Promise<void> {
		const attemptId = this.getId();
		const { evaluations } = body;
		const repo = new AttemptRepo();

		await this.executeWithRetry(async () => {
			const agg = await repo.getById(attemptId);
			for (const evaluation of evaluations) {
				agg.updateAnswerEvaluation(evaluation.points, evaluation.answerId);
			}
			agg.forceScore();
			await repo.save(agg);
		});
	}
}
