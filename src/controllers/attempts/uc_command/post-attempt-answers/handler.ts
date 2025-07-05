import { PostAttemptAnswersBody } from "./body";
import { AttemptRepo } from "../../../../infrastructure/repo/AttemptRepo";
import { TestRepo } from "../../../../infrastructure/repo/TestRepo";
import { QuestionMapper } from "../../../../domain/_mappers/QuestionMapper";
import { RetryableCommandHandlerBase } from "../../../../shared/handler/retryable-command.base";
import { AnswerQueueService } from "../../services/AnswerQueueService";
import { OptimisticError } from "../../../../shared/errors/optimistic.error";
import { AnswerQueueService2 } from "../../services/AnswerQueueService2";
import { EventDispatcher } from "../../../../shared/domain/EventDispatcher";
import { AttemptAnsweredEvent } from "../../events/AttemptAnsweredEvent";
import AttemptsAnswerQuestions from "../../../../infrastructure/models/attempts_answer_questions";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import AttemptsAnswerMCQQuestions from "../../../../infrastructure/models/attempts_answer_mcq_questions";
import AttemptsAnswerLAQuestions from "../../../../infrastructure/models/attempts_answer_la_questions";
import { IdentityUtils } from "../../../../shared/domain/UniqueEntityId";

export class PostAttemptAnswersHandler extends RetryableCommandHandlerBase<PostAttemptAnswersBody> {
	async handle(params: PostAttemptAnswersBody): Promise<void> {
		const attemptId = this.getId();
		const credentials = this.getCredentials();
		const { answer, questionId } = params;
		// const answerQueue = AnswerQueueService.getInstance();
		const answerQueue2 = AnswerQueueService2.getInstance();
		const repo = new AttemptRepo();

		const transaction = await sequelize.transaction();
		answerQueue2.enqueue(attemptId, questionId, answer, 0);

		try {
			const uuid = IdentityUtils.create();

			await AttemptsAnswerQuestions.destroy({
				where: {
					attemptId: attemptId,
					questionId: questionId
				},
				cascade: true,
				transaction: transaction
			});

			const newAnswer = await AttemptsAnswerQuestions.create({
				id: uuid,
				attemptId: attemptId,
				questionId: questionId,
			}, { transaction });

			if (answer?.type === "MCQ") {
				await AttemptsAnswerMCQQuestions.create({
					attemptAnswerQuestionId: newAnswer.id,
					chosenOption: answer.chosenOption,
				}, { transaction });
			}

			if (answer?.type === "LONG_ANSWER") {
				await AttemptsAnswerLAQuestions.create({
					attemptAnswerQuestionId: newAnswer.id,
					answer: answer.answer,
				}, { transaction });
			}

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		} finally {
			answerQueue2.dequeue(attemptId, questionId);
		}

		// await EventDispatcher.getInstance().dispatch(
		// 	new AttemptAnsweredEvent(
		// 		attemptId,
		// 		questionId,
		// 		answer,
		// 		credentials
		// 	)
		// );


		// answerQueue.set(attemptId, questionId, answer);
		// await this.executeWithRetry(async () => {
		// 	try {
		// 		const answerRetrieved = answerQueue.get(attemptId, questionId);
		// 		if (!answerRetrieved) {
		// 			console.warn(`No answer found for attempt ${attemptId} and question ${questionId}`);
		// 			return;
		// 		}
		// 		const agg = await repo.getById(attemptId);
		// 		const questionPersistence = await (new TestRepo().getQuestion(questionId));
		// 		const questionDto = QuestionMapper.toDto(questionPersistence);

		// 		agg.answerQuestion(credentials, questionId, questionDto, answerRetrieved ? { ...answerRetrieved } : null);
		// 		await repo.save(agg);
		// 		answerQueue.delete(attemptId, questionId);
		// 	} catch (error) {
		// 		if (OptimisticError.isOptimisticError(error)) {
		// 			const newAnswerRetrieved = answerQueue.get(attemptId, questionId);
		// 			if (newAnswerRetrieved == null) {
		// 				answerQueue.set(attemptId, questionId, answer);
		// 				throw error; // Re-throw the error to trigger a retry
		// 			}
		// 			else {
		// 				return; // If the answer was already processed, we can skip further processing
		// 			}
		// 		}
		// 		else {
		// 			throw error; // If it's not an optimistic error, re-throw it
		// 		}
		// 	}
		// });

	}
}
