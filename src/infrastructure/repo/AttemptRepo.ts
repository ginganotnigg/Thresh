import { db } from "../../configs/orm/kysely/db";
import sequelize from "../../configs/orm/sequelize/sequelize";
import Attempt from "../models/attempt";
import { DomainError } from "../../shared/errors/domain.error";
import { AttemptAggregate } from "../../domain/AttemptAggregate";
import { AttemptPersistence } from "../../domain/mappers/AttemptMapper";

export class AttemptRepo {
	static async getById(attemptId: string): Promise<AttemptAggregate> {
		const attempt = await db
			.selectFrom("Attempts")
			.where("id", "=", attemptId)
			.selectAll()
			.executeTakeFirst()
			;
		if (!attempt) {
			throw new DomainError(`Attempt with id ${attemptId} not found`);
		}
		const persistence: AttemptPersistence = {
			id: attempt.id,
			candidateId: attempt.candidateId,
			testId: attempt.TestId!,
			hasEnded: attempt.hasEnded === 1,
			order: attempt.order,
			secondsSpent: attempt.secondsSpent,
			status: attempt.status,
			createdAt: attempt.createdAt!,
			updatedAt: attempt.updatedAt!,
		}
		const agg = AttemptAggregate.fromPersistence(persistence);
		return agg;
	}

	static async save(agg: AttemptAggregate): Promise<void> {
		const persistence = agg.getPersistenceData();
		const transaction = await sequelize.transaction();
		try {
			const [count] = await Attempt.update({
				candidateId: persistence.candidateId,
				testId: persistence.testId,
				hasEnded: persistence.hasEnded,
				order: persistence.order,
				secondsSpent: persistence.secondsSpent,
				status: persistence.status,
			}, {
				where: { id: persistence.id },
				transaction,
			});
			if (count === 0) {
				throw new DomainError(`Attempt with id ${persistence.id} not found`);
			}
			await transaction.commit();
		}
		catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}