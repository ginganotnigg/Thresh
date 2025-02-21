import { IEventHandler } from "../../../../common/event/event.handler.i";
import { INotify } from "../../domain/contracts/notify.i";
import { IRetriverRepository } from "../../domain/contracts/retriver.repo.i";
import { ProcessAnsweredEvent } from "../../domain/events/process-answered.event";

export class ProcessAnsweredHandler implements IEventHandler {
	constructor(
		private readonly notify: INotify
	) { }

	async handle(event: ProcessAnsweredEvent): Promise<void> {
		this.notify.sendAnswered(event.attemptId, event.questionId, event.optionId);
	}
}