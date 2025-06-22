import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { TestAttemptsRepo } from "../../../../infrastructure/repo/TestAttemptsRepo";
import { PostAttemptsBody } from "./body";

export class PostAttemptsHandler extends CommandHandlerBase<PostAttemptsBody, { attemptId: string }> {
	async handle(params: PostAttemptsBody): Promise<{ attemptId: string }> {
		const { testId } = params;
		const { userId } = this.getCredentials();
		const repo = new TestAttemptsRepo();
		const testAgg = await repo.getTest(testId);
		const attemptId = testAgg.addNewAttempt(userId);
		await repo.save(testAgg);
		return { attemptId, }
	}
}