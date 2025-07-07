import { AttemptRepo } from "../../../../infrastructure/repo/AttemptRepo";
import { ScoreAttemptQueryService } from "../../services/ScoreLongAnswerService";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";

export class PatchAttemptSubmitHandler extends CommandHandlerBase<void> {
	private static readonly processingAttempts: Set<string> = new Set();

	async handle(): Promise<void> {
		const attemptId = this.getId();

		if (PatchAttemptSubmitHandler.processingAttempts.has(attemptId)) {
			console.warn(`Attempt ${attemptId} is already being processed.`);
			return;
		}

		console.log(`Processing attempt ${attemptId}...`);
		PatchAttemptSubmitHandler.processingAttempts.add(attemptId);

		const credential = this.getCredentials();
		const repo = new AttemptRepo();

		const agg = await repo.getById(attemptId);
		const result = await ScoreAttemptQueryService.score(agg);
		agg.submit(credential, result.questions, result.testLanguage);
		await repo.save(agg);

		PatchAttemptSubmitHandler.processingAttempts.delete(attemptId);
		console.log(`Attempt ${attemptId} processed successfully.`);
	}
}