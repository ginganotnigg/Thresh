import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { AttemptRepo } from "../../../../infrastructure/repo/AttemptRepo";

export class PatchAttemptSubmitHandler extends CommandHandlerBase<void> {
	async handle(): Promise<void> {
		const attemptId = this.getId();
		const credential = this.getCredentials();
		const repo = new AttemptRepo();
		const agg = await repo.getById(attemptId);
		agg.submit(credential);
		await repo.save(agg);
	}
}