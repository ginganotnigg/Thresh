import { ScoreLongAnswerEvent } from "../../../domain/_events/ScoreLongAnswer";
import AttemptsAnswerQuestions from "../../../infrastructure/models/attempts_answer_questions";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";

export class ScoreLongAnswerHandler extends EventHandlerBase<ScoreLongAnswerEvent> {
	registerEvent(event: Constructor<ScoreLongAnswerEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: ScoreLongAnswerEvent): Promise<void> {
		await AttemptsAnswerQuestions.update({
			pointsReceived: params.score,
		}, {
			where: {
				id: params.answerId,
			},
		});
		console.log(`Scored long answer with ID ${params.answerId} with ${params.score} points.`);
	}
}