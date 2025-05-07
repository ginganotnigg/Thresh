import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import User from "../../../../domain/models/user";
import { emitter } from "../../controller/emitter";
import { CreateAttemptBody } from "../../schema/controller-schema";

export async function commandCreateAttempt(params: CreateAttemptBody): Promise<void> {
	const { testId, candidateId } = params;
	const transaction = await sequelize.transaction();
	try {
		const test = await Test.findByPk(testId);
		if (!test) {
			throw new DomainError("Test not found");
		}
		const candidate = await User.findByPk(candidateId);
		if (!candidate) {
			throw new DomainError("Candidate not found");
		}

		const numberOfPreviousAttempts = await Attempt.count({
			where: {
				testId: testId,
				candidateId: candidateId,
			},
		});

		const attempt = await Attempt.create({
			order: numberOfPreviousAttempts + 1,
			testId: testId,
			candidateId: candidateId,
			secondsSpent: 0,
			hasEnded: false,
		});

		await transaction.commit();
		emitter.emit("ATTEMPT_CREATED", attempt.id);
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}