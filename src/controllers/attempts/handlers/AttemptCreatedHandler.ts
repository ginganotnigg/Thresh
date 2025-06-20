import { AttemptCreatedEvent } from "../../../domain/_events/AttemptCreatedEvent";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";
import { AttemptScheduleService } from "../services/AttemptScheduleService";

export class AttemptCreatedHandler extends EventHandlerBase<AttemptCreatedEvent> {
	registerEvent(event: Constructor<AttemptCreatedEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: AttemptCreatedEvent): Promise<void> {
		const { attemptId, endDate } = params;
		AttemptScheduleService.scheduleAttempt(attemptId, endDate);
	}
}