import { AttemptSubmittedEvent } from "../../../domain/events/AttemptSubmittedEvent";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";
import { AttemptScheduleService } from "../services/AttemptScheduleService";

export class AttemptSubmittedHandler extends EventHandlerBase<AttemptSubmittedEvent> {
	registerEvent(event: Constructor<AttemptSubmittedEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}
	async handle(params: AttemptSubmittedEvent): Promise<void> {
		AttemptScheduleService.cancelAttempt(params.attemptId);
	}
}