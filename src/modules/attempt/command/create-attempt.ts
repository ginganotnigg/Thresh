import sequelize from "../../../configs/orm/sequelize/sequelize";
import Attempt from "../../../domain/models/attempt";
import { CreateAttemptBody } from "../schema/controller-schema";

export async function commandCreateAttempt(params: CreateAttemptBody): Promise<void> {
	const { testId, candidateId } = params;
	const transaction = await sequelize.transaction();
	try {
		const numberOfPreviousAttempts = await Attempt.count({
			where: {
				testId: testId,
				candidateId: candidateId,
			},
		});

		await Attempt.create({
			order: numberOfPreviousAttempts + 1,
			testId: testId,
			candidateId: candidateId,
			secondsSpent: 0,
			hasEnded: false,
		});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}