import { TestRepo } from "../../../../infrastructure/repo/TestRepo";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { DomainError } from "../../../../shared/errors/domain.error";

export class DeleteTestHandler extends CommandHandlerBase<void, { success: boolean }> {
	async handle(): Promise<{ success: boolean; }> {
		const testId = this.getId();
		const repo = new TestRepo();

		// Check if test exists and has attempts
		const existingAgg = await repo.getById(testId);
		if (!existingAgg) {
			throw new DomainError("Test not found");
		}

		// The domain logic in TestAggregate should prevent deletion if there are attempts
		// But we'll also check at the repository level during deletion
		await repo.delete(testId);

		return { success: true };
	}
}
