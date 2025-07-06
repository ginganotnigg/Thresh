import { ScoreLongAnswerEvent } from "../../../domain/_events/ScoreLongAnswer";
import AttemptsAnswerQuestions from "../../../infrastructure/models/attempts_answer_questions";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";

export class ScoreLongAnswerHandler extends EventHandlerBase<ScoreLongAnswerEvent> {
	registerEvent(event: Constructor<ScoreLongAnswerEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: ScoreLongAnswerEvent): Promise<void> {
		const { answerId, score } = params;
		console.log(`Scored long answer with ID ${answerId} with ${score} points.`);

		const repo = new AttemptRepo();
		const agg = await repo.getById(answerId);
		agg.updateAnswerEvaluation(score, answerId, params.comment);
		await repo.save(agg);
	}
}