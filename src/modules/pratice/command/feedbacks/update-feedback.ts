import { z } from "zod";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import Feedback from "../../../../domain/models/feedback";
import { DomainError } from "../../../../controller/errors/domain.error";
import { FeedbackProblemsEnum } from "../../../../domain/models/feedback";

export const UpdateFeedbackSchema = z.object({
	rating: z.number().min(1).max(10).optional(),
	problems: z.array(z.nativeEnum(FeedbackProblemsEnum)).optional(),
	comment: z.string().optional(),
});

export type UpdateFeedback = z.infer<typeof UpdateFeedbackSchema>;

export async function commandUpdateFeedback(params: UpdateFeedback & { practiceTestId: string }): Promise<{ success: boolean }> {
	const {
		practiceTestId,
		...updateData
	} = params;

	const transaction = await sequelize.transaction();
	try {
		const feedback = await Feedback.findByPk(practiceTestId, { transaction });

		if (!feedback) {
			await transaction.rollback();
			throw new DomainError(`Feedback with id ${practiceTestId} not found`);
		}

		await feedback.update(updateData, { transaction });

		await transaction.commit();
		return { success: true };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}