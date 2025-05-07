import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import AttemptsAnswerQuestions from "../../../../domain/models/attempts_answer_questions";

export async function commandAnswerAttempt(attemptId: string, questionId: number, chosenOption?: number): Promise<void> {
	const transaction = await sequelize.transaction();

	try {
		const attempt = await Attempt.findByPk(attemptId, { transaction });
		if (!attempt) {
			throw new DomainError("Attempt not found");
		}
		if (attempt.hasEnded) {
			throw new DomainError("Attempt already submitted");
		}

		if (chosenOption == null) {
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