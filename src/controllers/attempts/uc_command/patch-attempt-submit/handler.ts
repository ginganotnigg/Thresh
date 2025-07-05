import { RetryableCommandHandlerBase } from "../../../../shared/handler/retryable-command.base";
import { AttemptRepo } from "../../../../infrastructure/repo/AttemptRepo";
import { AnswerQueueService } from "../../services/AnswerQueueService";
import { AnswerQueueService2 } from "../../services/AnswerQueueService2";

export class PatchAttemptSubmitHandler extends RetryableCommandHandlerBase<void> {
	async handle(): Promise<void> {
		console.log("[Req ##] Handling attempt submission");

		const attemptId = this.getId();
		const credential = this.getCredentials();
		// const answerQueue = AnswerQueueService.getInstance();
		const answerQueue = AnswerQueueService2.getInstance();
		await answerQueue.waitForPendingAnswers(attemptId);

		// Create repository instance once outside the retry loop
		const repo = new AttemptRepo();

		await this.executeWithRetry(async () => {
			const agg = await repo.getById(attemptId);

			agg.submit(credential);
			await repo.save(agg);
		});

		console.log(`[$$ Resp] Attempt ${attemptId} submitted successfully`);
	}
}