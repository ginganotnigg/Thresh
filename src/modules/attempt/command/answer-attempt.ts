import sequelize from "../../../configs/orm/sequelize/sequelize";
import { DomainErrorResponse } from "../../../controller/errors/domain.error";
import Attempt from "../../../domain/models/attempt";
import AttemptsAnswerQuestions from "../../../domain/models/attempts_answer_questions";

export async function commandAnswerAttempt(attemptId: string, questionId: number, chosenOption: number | null): Promise<void> {
	const transaction = await sequelize.transaction();

	try {
		const attempt = await Attempt.findByPk(attemptId, { transaction });
		if (!attempt) {
			throw new DomainErrorResponse("Attempt not found");
		}
		if (attempt.hasEnded) {
			throw new DomainErrorResponse("Attempt already submitted");
		}

		if (chosenOption === null) {
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
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}