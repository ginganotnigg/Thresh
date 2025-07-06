import { AttemptSubmittedEvent } from "../../../domain/_events/AttemptSubmittedEvent";
import { ScoreLongAnswerQueue } from "../../../infrastructure/queues/score-long-answer";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { DomainError } from "../../../shared/errors/domain.error";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";
import { AttemptScheduleService } from "../services/AttemptScheduleService";

export class AttemptSubmittedHandler extends EventHandlerBase<AttemptSubmittedEvent> {
	registerEvent(event: Constructor<AttemptSubmittedEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: AttemptSubmittedEvent): Promise<void> {
		const { attemptId, questions, testLanguage, testId } = params;

		AttemptScheduleService.cancelAttempt(attemptId);
		const repo = new AttemptRepo();
		const agg = await repo.getById(attemptId);

		// If the attempt is in EXAM mode, we do not score long answers, let the author do it.
		if (agg.getTestMode() === "EXAM") {
			return;
		}
		const data = agg.getEvaluationData();
		const candidateId = agg.getCandidateId();
		const questionsMap = new Map(questions.filter(q => q.detail.type === "LONG_ANSWER").map(q => [q.id, q]));
		const answerWithQuestions = data.map(({ questionId, answer, answerId }) => {
			const question = questionsMap.get(questionId);
			if (!question || question.detail.type !== "LONG_ANSWER") {
				return null;
			}
			return {
				answerId,
				answer,
				questionText: question.text,
				points: question.points,
				correctAnswer: question.detail.correctAnswer,
			};
		}).filter(q => q !== null);

		answerWithQuestions.forEach(({
			answerId,
			answer,
			questionText,
			points,
			correctAnswer,
		}) => ScoreLongAnswerQueue.score(
			{
				attemptId,
				questionText,
				answerId,
				answer,
				correctAnswer,
				points,
				userId: candidateId,
				language: testLanguage,
			}
		));

		// We don't save the attempt here, its status only be updated when the long answers are scored.
		// Notice how we only use getters of the aggregate, we do not modify it.
	}
}