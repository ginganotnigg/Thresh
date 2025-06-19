import { TestAggregate } from "../../../../domain/test-agg/TestAggregate";
import { TestRepo } from "../../../../infrastructure/repo/TestRepo";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { PostTestBody } from "./body";

export class PostTestHandler extends CommandHandlerBase<PostTestBody, { testId: string }> {
	async handle(params: PostTestBody): Promise<{ testId: string; }> {
		const { questions, ...testDto } = params;
		const repo = new TestRepo();
		const agg = TestAggregate.create(testDto, questions);
		await repo.save(agg);
		return { testId: agg.id };
	}
}