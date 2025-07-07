import { db } from "../../../configs/orm/kysely/db";
import { ScoreLongAnswerEvent } from "../../../domain/_events/ScoreLongAnswer";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";
import { Constructor } from "../../../library/caychuoijs/utils/type";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";
import { EventHandlerBase } from "../../../shared/handler/usecase.base";

export class ScoreLongAnswerHandler extends EventHandlerBase<ScoreLongAnswerEvent> {
	registerEvent(event: Constructor<ScoreLongAnswerEvent>): void {
		EventDispatcher.getInstance().register(event, this);
	}

	async handle(params: ScoreLongAnswerEvent): Promise<void> {
		try {
			const { answerId, score, comment } = params;
			const attempt = await db
				.selectFrom("AttemptsAnswerLAQuestions")
				.innerJoin("AttemptsAnswerQuestions", "AttemptsAnswerLAQuestions.attemptAnswerQuestionId", "AttemptsAnswerQuestions.id")
				.where("AttemptsAnswerLAQuestions.attemptAnswerQuestionId", "=", answerId)
				.select("attemptId")
				.executeTakeFirst();

			if (!attempt) {
				console.error(`Attempt not found for answerId: ${answerId}`);
				return;
			}
			const { attemptId } = attempt;
			const repo = new AttemptRepo();
			const agg = await repo.getById(attemptId);
			agg.updateAnswerEvaluation(score, answerId, comment);
			await repo.save(agg);
		} catch (error) {
			console.error("Error handling long answer scoring:", error);
		}
	}
}