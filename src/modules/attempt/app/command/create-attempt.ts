import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import User from "../../../../domain/models/user";
import { AttemptId } from "../../../../domain/schema/id.schema";
import { emitter } from "../../controller/emitter";
import { CreateAttemptBody } from "../../schema/controller-schema";

export async function commandCreateAttempt(params: CreateAttemptBody): Promise<AttemptId> {
	const { testId, candidateId } = params;
	const transaction = await sequelize.transaction();
	try {
		const test = await Test.findByPk(testId, { transaction });
		if (!test) {
			throw new DomainError("Test not found");
		}

		const candidate = await User.findByPk(candidateId, { transaction });
		if (!candidate) {
			throw new DomainError("Candidate not found");
		}

		const currentAttempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				hasEnded: false,
			},
			transaction,
		});
		if (currentAttempt) {
			throw new DomainError("Candidate already has an ongoing attempt for this test");
		}

		const numberOfPreviousAttempts = await Attempt.count({
			where: {
				testId: testId,
				candidateId: candidateId,
			},
		});

		console.log("numberOfPreviousAttempts", numberOfPreviousAttempts);

		const attempt = await Attempt.create({
			order: numberOfPreviousAttempts + 1,
			testId: testId,
			candidateId: candidateId,
			secondsSpent: 0,
			hasEnded: false,
		});

		await transaction.commit();
		emitter.emit("ATTEMPT_CREATED", attempt.id);

		return { attemptId: attempt.id };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}