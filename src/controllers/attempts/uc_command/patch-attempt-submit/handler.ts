import { AttemptRepo } from "../../../../infrastructure/repo/AttemptRepo";
import { ScoreAttemptQueryService } from "../../services/ScoreLongAnswerService";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";

export class PatchAttemptSubmitHandler extends CommandHandlerBase<void> {
	async handle(): Promise<void> {
		const attemptId = this.getId();
		const credential = this.getCredentials();

		const repo = new AttemptRepo();

		const agg = await repo.getById(attemptId);
		const result = await ScoreAttemptQueryService.score(agg);
		agg.submit(credential, result.questions, result.testLanguage);
		await repo.save(agg);
	}
}