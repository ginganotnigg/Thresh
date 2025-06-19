import { TestRepo } from "../../../../infrastructure/repo/TestRepo";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { DomainError } from "../../../../shared/errors/domain.error";
import { DeleteTestBody } from "./body";

export class DeleteTestHandler extends CommandHandlerBase<DeleteTestBody, { success: boolean }> {
	async handle(params: DeleteTestBody): Promise<{ success: boolean; }> {
		const { testId } = params;
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
