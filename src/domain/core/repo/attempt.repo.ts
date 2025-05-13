import sequelize from "../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../controller/errors/domain.error";
import Attempt from "../../models/attempt";
import AttemptsAnswerQuestions from "../../models/attempts_answer_questions";
import Test from "../../models/test";
import { AttemptCore } from "../../schema/core.schema";
import { AttemptId } from "../../schema/id.schema";
import { attemptEmitter } from "../../../modules/attempt/init/emitter";

export class AttemptRepo {
	static async createAttempt(params: {
		testId: string;
		candidateId: string;
	}): Promise<AttemptId> {
		const { testId, candidateId } = params;
		const transaction = await sequelize.transaction();
		try {
			const test = await Test.findByPk(testId, { transaction });
			if (!test) {
				throw new DomainError("Test not found");
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

			const attempt = await Attempt.create({
				order: numberOfPreviousAttempts + 1,
				testId: testId,
				candidateId: candidateId,
				secondsSpent: 0,
				hasEnded: false,
			});

			await transaction.commit();
			attemptEmitter.emit("ATTEMPT_CREATED", attempt.id);

			return { attemptId: attempt.id };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	static async loadCurrentAttempt(testId: string, candidateId: string): Promise<AttemptCore | null> {
		const test = await Test.findByPk(testId);
		if (!test) {
			throw new DomainError("Test not found");
		}

		const attempts = await Attempt.findAll({
			where: {
				testId,
				candidateId,
				hasEnded: false,
			},
		});
		if (attempts.length === 0) {
			return null;
		}
		if (attempts.length > 1) {
			throw new DomainError("Multiple current attempts found for this test and candidate");
		}
		const attempt = attempts[0];
		return {
			...attempt.toJSON(),
		}
	}

	static async upsertOrDeleteAnswer({
		attemptId,
		questionId,
		chosenOption,
	}: {
		attemptId: string;
		questionId: number;
		chosenOption: number | null | undefined;
	}): Promise<void> {
		const transaction = await sequelize.transaction();
		try {
			if (chosenOption == null || chosenOption == undefined) {
				await AttemptsAnswerQuestions.destroy({
					where: {
						attemptId: attemptId,
						questionId: questionId,
					},
					transaction,
				});
			}
			else {
				await AttemptsAnswerQuestions.upsert({
					attemptId: attemptId,
					questionId: questionId,
					chosenOption: chosenOption,
				}, { transaction });
			}
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	static async updateAttempt(attemptCore: AttemptCore): Promise<void> {
		const transaction = await sequelize.transaction();
		try {
			const attempt = await Attempt.findByPk(attemptCore.id, { transaction });
			if (!attempt) {
				throw new DomainError("Attempt not found");
			}
			await attempt.update({
				...attemptCore,
			}, { transaction });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}