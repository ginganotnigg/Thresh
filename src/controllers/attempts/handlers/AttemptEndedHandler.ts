import { AttemptEndedEvent } from "../../../domain/_events/AttemptSubmittedEvent";
import { scoreLongAnswer } from "../../../infrastructure/external/score-long-answer";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";
import { AttemptScheduleService } from "../services/AttemptScheduleService";

export class AttemptEndedHandler extends EventHandlerBase<AttemptEndedEvent> {
	registerEvent(event: Constructor<AttemptEndedEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}
	async handle(params: AttemptEndedEvent): Promise<void> {
		const { attemptId } = params;
		AttemptScheduleService.cancelAttempt(attemptId);
		const repo = new AttemptRepo();
		const agg = await repo.getById(attemptId);
		const data = agg.getEvaluationData();
		const pointsOfAnswers = await Promise.all(
			data.map(async ({ answerId, answer, correctAnswer, points }) => {
				const point = await scoreLongAnswer(answer, correctAnswer, points);
				return {
					answerId,
					point,
				}
			}),
		);
		agg.setEvaluatedPoints(pointsOfAnswers);
		await repo.save(agg);
	}
}