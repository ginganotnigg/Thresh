import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";

export async function commandSubmitAttempt(attemptId: string): Promise<void> {
	const transaction = await sequelize.transaction();
	try {
		const attempt = await Attempt.findByPk(attemptId, { transaction });
		if (!attempt) {
			throw new DomainError("Attempt not found");
		}
		if (attempt.hasEnded) {
			throw new DomainError("Attempt already submitted");
		}
		const now = new Date();
		const secondsSpent = Math.floor((now.getTime() - attempt.createdAt.getTime()) / 1000);

		await attempt.update({
			hasEnded: true,
			secondsSpent,
		}, { transaction });

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}