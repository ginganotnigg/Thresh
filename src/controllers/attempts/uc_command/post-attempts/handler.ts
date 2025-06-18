import { CommandHandlerBase } from "../../../shared/base/usecase.base";
import { TestAttemptsRepo } from "../../infra/TestAttemptsRepo";
import { PostAttemptsBody } from "./body";

export class PostAttemptsHandler extends CommandHandlerBase<PostAttemptsBody> {
	async handle(params: PostAttemptsBody): Promise<void> {
		const { testId } = params;
		const { userId } = this.getCredentials();
		const testAgg = await TestAttemptsRepo.getTest(testId);
		testAgg.addNewAttempt(userId);
		await TestAttemptsRepo.save(testAgg);
	}
}