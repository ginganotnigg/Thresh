import { ExamRepo } from "../../../../infrastructure/repo/ExamRepo";
import { TestRepo } from "../../../../infrastructure/repo/TestRepo";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { PostExamParticipantBody } from "./body";

export class PostExamParticipantHandler extends CommandHandlerBase<PostExamParticipantBody> {
	async handle(params: PostExamParticipantBody): Promise<void> {
		const { testId, participantId, password } = params;
		const repo = new ExamRepo();

		// Fetch the test aggregate by ID
		const existingAgg = await repo.getById(testId);

		// Add the participant to the test
		existingAgg.addParticipant(participantId, password);

		// Save the updated aggregate
		await repo.save(existingAgg);
	}
}