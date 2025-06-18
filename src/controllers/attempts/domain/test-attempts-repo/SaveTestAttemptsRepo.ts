import { db } from "../../../../configs/orm/kysely/db";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import Attempt from "../../../../infrastructure/models/attempt";
import { TestAttemptsAggregate } from "../test-attempts-agg/TestAttemptsAggregate";

export class SaveTestAttemptsRepo {
	static async saveTest(test: TestAttemptsAggregate): Promise<void> {
		const { newAttempt, modifedAttmepts, deletedAttempts } = test.getPersistenceData();
		const transaction = await sequelize.transaction();
		try {
			if (newAttempt) {
				await Attempt.create(newAttempt, { transaction });
			}
			if (modifedAttmepts.length > 0) {
				await Attempt.bulkCreate(modifedAttmepts, {
					updateOnDuplicate: ["candidateId", "hasEnded", "order", "secondsSpent", "status"],
					transaction,
				});
			}
			if (deletedAttempts.length > 0) {
				await Attempt.destroy({
					where: { id: deletedAttempts },
					transaction,
				});
			}
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}