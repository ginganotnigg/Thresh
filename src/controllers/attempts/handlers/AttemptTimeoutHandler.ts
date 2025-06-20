import { AttemptTimeOutEvent } from "../../../domain/_events/AttemptTimeOutEvent";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";

export class AttemptTimeoutHandler extends EventHandlerBase<AttemptTimeOutEvent> {
	registerEvent(event: Constructor<AttemptTimeOutEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: AttemptTimeOutEvent): Promise<void> {
		const repo = new AttemptRepo();
		const agg = await repo.getById(params.attemptId);
		agg.timeOut();
		await repo.save(agg);
	}
}