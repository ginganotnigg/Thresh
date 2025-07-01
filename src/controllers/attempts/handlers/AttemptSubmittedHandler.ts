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

		// If the attempt is in EXAM mode, we do not score long answers, let the author do it.
		if (agg.getTestMode() === "EXAM") {
			return;
		}

		const data = agg.getEvaluationData();
		const candidateId = agg.getCandidateId();

		data.map(({
			questionText,
			answerId,
			answer,
			correctAnswer,
			points
		}) => ScoreLongAnswerQueue.score(
			attemptId,
			questionText,
			answerId,
			answer,
			correctAnswer,
			points,
			candidateId)
		);

		// We don't save the attempt here, its status only be updated when the long answers are scored.
		// Notice how we only use getters of the aggregate, we do not modify it.
	}
}