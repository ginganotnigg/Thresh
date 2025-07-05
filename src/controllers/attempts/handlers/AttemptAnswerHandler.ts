import { QuestionMapper } from "../../../domain/_mappers/QuestionMapper";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";
import { TestRepo } from "../../../infrastructure/repo/TestRepo";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { AnswerForQuestionCommon } from "../../../schemas/common/answer-for-question-type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { OptimisticError } from "../../../shared/errors/optimistic.error";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";
import { RetryUtil } from "../../../shared/utils/retry.util";
import { AttemptAnsweredEvent } from "../events/AttemptAnsweredEvent";
import { AnswerQueueService } from "../services/AnswerQueueService";
import { AnswerQueueService2 } from "../services/AnswerQueueService2";

export class AttemptAnsweredHandler extends EventHandlerBase<AttemptAnsweredEvent> {
	registerEvent(event: Constructor<AttemptAnsweredEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: AttemptAnsweredEvent): Promise<void> {
		const { attemptId, questionId, answer, credentials } = params;
		const answerQueue2 = AnswerQueueService2.getInstance();
		const repo = new AttemptRepo();

		answerQueue2.enqueue(attemptId, questionId, answer, 0);

		const operation = async (answer: AnswerForQuestionCommon | undefined) => {
			const agg = await repo.getById(attemptId);
			const questionPersistence = await (new TestRepo().getQuestion(questionId));
			const questionDto = QuestionMapper.toDto(questionPersistence);

			agg.answerQuestion(credentials, questionId, questionDto, answer ? { ...answer } : null);
			await repo.save(agg);
		}

		RetryUtil.executeWithOptimisticLock(async () => {
			answerQueue2.printQueue();
			const answerRetrieved = answerQueue2.peek(attemptId, questionId);
			if (answerRetrieved == null) {
				return; // No answer to process
			}
			try {
				await operation(answerRetrieved.answer);
				answerQueue2.dequeue(attemptId, questionId);
				return;
			} catch (error) {
				if (OptimisticError.isOptimisticError(error)) {
					const newAnswerRetrieved = answerQueue2.dequeue(attemptId, questionId);
					if (newAnswerRetrieved == null) {
						return; // No more answers to process
					}
					answerQueue2.enqueue(attemptId, questionId, newAnswerRetrieved.answer, newAnswerRetrieved.retries + 1);
					throw error; // Re-throw the error to trigger a retry
				}
				throw error; // Re-throw other errors
			}
		});
	}
}