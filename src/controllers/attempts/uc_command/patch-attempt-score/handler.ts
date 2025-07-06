import { AttemptRepo } from "../../../../infrastructure/repo/AttemptRepo";
import { PatchAttemptScoreBody } from "./body";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";

export class PatchAttemptScoreHandler extends CommandHandlerBase<PatchAttemptScoreBody, void> {
	async handle(body: PatchAttemptScoreBody): Promise<void> {
		const attemptId = this.getId();
		const { evaluations } = body;
		const repo = new AttemptRepo();

		const agg = await repo.getById(attemptId);
		for (const evaluation of evaluations) {
			agg.updateAnswerEvaluation(evaluation.points, evaluation.answerId);
		}
		agg.forceScore();
		await repo.save(agg);
	}
}
