import { db } from "../../../configs/orm/kysely/db";
import { AttemptTimeOutEvent } from "../../../domain/_events/AttemptTimeOutEvent";
import { queryQuestions } from "../../../infrastructure/query/questions";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { DomainError } from "../../../shared/errors/domain.error";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";
import { ScoreAttemptQueryService } from "../services/ScoreLongAnswerService";

export class AttemptTimeoutHandler extends EventHandlerBase<AttemptTimeOutEvent> {
	registerEvent(event: Constructor<AttemptTimeOutEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: AttemptTimeOutEvent): Promise<void> {
		const repo = new AttemptRepo();
		const agg = await repo.getById(params.attemptId);
		ScoreAttemptQueryService.score(agg);
		const result = await ScoreAttemptQueryService.score(agg);
		agg.timeOut(result.questions, result.testLanguage);
		await repo.save(agg);
	}
}