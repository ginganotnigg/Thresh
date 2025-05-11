import { Emitter } from "strict-event-emitter";

type ControllerEvents = {
	JOIN_TEST: [testId: string, candidateId: string];
}

export const controllerEmitter = new Emitter<ControllerEvents>();