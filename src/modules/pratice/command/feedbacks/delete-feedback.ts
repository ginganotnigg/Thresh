import { z } from "zod";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import Feedback from "../../../../domain/models/feedback";
import { DomainError } from "../../../../controller/errors/domain.error";

export const DeleteFeedbackSchema = z.object({
	id: z.string(),
});

export type DeleteFeedback = z.infer<typeof DeleteFeedbackSchema>;

export async function commandDeleteFeedback(params: DeleteFeedback): Promise<{ success: boolean }> {
	const { id } = params;

	const transaction = await sequelize.transaction();
	try {
		const feedback = await Feedback.findByPk(id, { transaction });

		if (!feedback) {
			await transaction.rollback();
			throw new DomainError(`Feedback with id ${id} not found`);
		}

		await feedback.destroy({ transaction });

		await transaction.commit();
		return { success: true };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}