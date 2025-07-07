import { AttemptTimeOutEvent } from "../../../domain/_events/AttemptTimeOutEvent";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";
import { ScoreAttemptQueryService } from "../services/ScoreLongAnswerService";

export class AttemptTimeoutHandler extends EventHandlerBase<AttemptTimeOutEvent> {
	registerEvent(event: Constructor<AttemptTimeOutEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: AttemptTimeOutEvent): Promise<void> {
		try {
			const repo = new AttemptRepo();
			const agg = await repo.getById(params.attemptId);
			ScoreAttemptQueryService.score(agg);
			const result = await ScoreAttemptQueryService.score(agg);
			agg.timeOut(result.questions, result.testLanguage);
			await repo.save(agg);
		} catch (error) {
			console.error("Error handling attempt timeout:", error);
		}
	}
}