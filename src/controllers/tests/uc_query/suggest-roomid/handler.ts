import { db } from "../../../../configs/orm/kysely/db";
import { DomainError } from "../../../../shared/errors/domain.error";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { UniqueExamCheck } from "../../services/unique-exam-check";

export class SuggestRoomIdHandler extends QueryHandlerBase<{
	startDate: Date;
	endDate: Date;
}, { roomId: string }> {
	async handle(param: {
		startDate: Date;
		endDate: Date;
	}): Promise<{ roomId: string }> {
		const { startDate, endDate } = param;
		let roomId: string;
		let maxAttempts = 10; // Limit to avoid infinite loop

		while (true) {
			roomId = `${Math.random().toString(36).substring(2, 15)}`;
			const isRoomIdUnique = await UniqueExamCheck.isRoomIdUnique(
				roomId,
				startDate,
				endDate,
			);

			if (isRoomIdUnique === true) {
				// If no existing exam uses this roomId, we can use it
				break;
			}
			else if (maxAttempts-- <= 0) {
				// If we reach the maximum attempts, throw an error
				throw new DomainError("Unable to suggest a unique roomId after multiple attempts.");
			}
		}

		return { roomId };
	}
}