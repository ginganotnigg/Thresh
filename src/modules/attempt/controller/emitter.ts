import { Emitter } from "strict-event-emitter";

type AttemptEvents = {
	ATTEMPT_CREATED: [attemptId: string];
	ATTEMPT_SUBMITTED: [attemptId: string];
}

export const emitter = new Emitter<AttemptEvents>();