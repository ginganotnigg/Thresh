import sequelize from "../../../configs/orm/sequelize/sequelize";
import AttemptsAnswerLAQuestions from "../../../infrastructure/models/attempts_answer_la_questions";
import AttemptsAnswerMCQQuestions from "../../../infrastructure/models/attempts_answer_mcq_questions";
import AttemptsAnswerQuestions from "../../../infrastructure/models/attempts_answer_questions";
import { AnswerAggregate } from "../domain/AnswerAggregate";

export class AnswerRepo {
	static async save(answer: AnswerAggregate): Promise<void> {
		const answerPersistence = answer.toPersistence();
		const transaction = await sequelize.transaction();
		try {
			if (answerPersistence.type === "CLEAR_ANSWER") {
				await AttemptsAnswerQuestions.destroy({
					where: {
						questionId: answerPersistence.questionId,
						attemptId: answerPersistence.attemptId
					},
					cascade: true,
					transaction
				});
			}
			else {
				const [answerAttempt, isCreated] = await AttemptsAnswerQuestions.findOrCreate({
					where: {
						questionId: answerPersistence.questionId,
						attemptId: answerPersistence.attemptId
					},
					transaction,
				});
				if (answerPersistence.type === "MCQ") {
					await AttemptsAnswerMCQQuestions.upsert({
						attemptAnswerQuestionId: answerAttempt.id,
						chosenOption: answerPersistence.chosenOption
					}, {
						transaction,
					})
				}
				if (answerPersistence.type === "LONG_ANSWER") {
					await AttemptsAnswerLAQuestions.upsert({
						attemptAnswerQuestionId: answerAttempt.id,
						answer: answerPersistence.answer
					}, {
						transaction,
					});
				}
			}
			await transaction.commit();
		}
		catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}