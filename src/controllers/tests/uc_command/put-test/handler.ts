import { TestRepo } from "../../../../infrastructure/repo/TestRepo";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { DomainError } from "../../../../shared/errors/domain.error";
import { PutTestBody } from "./body";

export class PutTestHandler extends CommandHandlerBase<PutTestBody & { testId: string }, { success: boolean }> {
	async handle(params: PutTestBody): Promise<{ success: boolean; }> {
		const testId = this.getId();
		const { questions, ...testDto } = params;
		const repo = new TestRepo();

		// Get existing test
		const existingAgg = await repo.getById(testId);
		if (!existingAgg) {
			throw new DomainError("Test not found");
		}

		// Update the test data and questions
		existingAgg.update(testDto);
		existingAgg.updateQuestions(questions);

		// Save the updated aggregate
		await repo.save(existingAgg);

		return { success: true };
	}
}
