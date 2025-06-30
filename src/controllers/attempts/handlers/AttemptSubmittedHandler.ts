import { AttemptSubmittedEvent } from "../../../domain/_events/AttemptSubmittedEvent";
import { ScoreLongAnswerQueue } from "../../../infrastructure/queues/score-long-answer";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";
import { AttemptScheduleService } from "../services/AttemptScheduleService";

export class AttemptSubmittedHandler extends EventHandlerBase<AttemptSubmittedEvent> {
	registerEvent(event: Constructor<AttemptSubmittedEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: AttemptSubmittedEvent): Promise<void> {
		const { attemptId } = params;

		AttemptScheduleService.cancelAttempt(attemptId);
		const repo = new AttemptRepo();
		const agg = await repo.getById(attemptId);
		const data = agg.getEvaluationData();
		const candidateId = agg.getCandidateId();
		await Promise.all(
			data.map(async ({ questionText, answerId, answer, correctAnswer, points }) => {
				const point = await ScoreLongAnswerQueue.score(questionText, answerId, answer, correctAnswer, points, candidateId);
				return {
					answerId,
					point,
				}
			}),
		);
	}
}