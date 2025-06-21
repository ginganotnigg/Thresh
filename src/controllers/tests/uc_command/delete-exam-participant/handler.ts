import { ExamRepo } from "../../../../infrastructure/repo/ExamRepo";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { DeleteExamParticipantBody } from "./body";

export class DeleteExamParticipantHandler extends CommandHandlerBase<DeleteExamParticipantBody> {
	async handle(params: DeleteExamParticipantBody): Promise<void> {
		const testId = this.getId();
		const { participantId } = params;
		const repo = new ExamRepo();
		const agg = await repo.getById(testId);
		agg.removeParticipant(participantId);
		await repo.save(agg);
	}
}