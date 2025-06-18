import { CommandHandlerBase } from "../../../../shared/base/usecase.base";
import { AttemptRepo } from "../../infra/AttemptRepo";

export class PatchAttemptSubmitHandler extends CommandHandlerBase<void> {
	async handle(): Promise<void> {
		const attemptId = this.getId();
		const credential = this.getCredentials();
		const agg = await AttemptRepo.getById(attemptId);
		agg.submit(credential);
		await AttemptRepo.save(agg);
	}
}