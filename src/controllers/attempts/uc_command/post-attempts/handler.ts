import { db } from "../../../../configs/orm/kysely/db";
import { CommandHandlerBase } from "../../../shared/base/usecase.base";
import { DomainError } from "../../../shared/errors/domain.error";
import { GetTestAttemptsRepo } from "../../domain/test-attempts-repo/GetTestAttemptsRepo";
import { SaveTestAttemptsRepo } from "../../domain/test-attempts-repo/SaveTestAttemptsRepo";
import { PostAttemptsBody } from "./body";

export class PostAttemptsHandler extends CommandHandlerBase<PostAttemptsBody> {
	async handle(params: PostAttemptsBody): Promise<void> {
		const { testId } = params;
		const { userId } = this.getCredentials();
		const testAgg = await GetTestAttemptsRepo.getTest(testId);
		testAgg.addNewAttempt(userId);
		await SaveTestAttemptsRepo.saveTest(testAgg);
	}
}