import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { TestAttemptsRepo } from "../../../../infrastructure/repo/TestAttemptsRepo";
import { PostAttemptsBody } from "./body";

export class PostAttemptsHandler extends CommandHandlerBase<PostAttemptsBody> {
	async handle(params: PostAttemptsBody): Promise<void> {
		const { testId } = params;
		const { userId } = this.getCredentials();
		const repo = new TestAttemptsRepo();
		const testAgg = await repo.getTest(testId);
		testAgg.addNewAttempt(userId);
		await repo.save(testAgg);
	}
}