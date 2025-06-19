import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { DomainError } from "../../../../shared/errors/domain.error";
import { CreateAnswerAggregateDomainService } from "../../../../domain/service/CreateAnswerAggregateDomainService";
import { AnswerRepo } from "../../../../infrastructure/repo/AnswerRepo";
import { PostAttemptAnswersBody } from "./body";

export class PostAttemptAnswersHandler extends CommandHandlerBase<PostAttemptAnswersBody> {
	async handle(params: PostAttemptAnswersBody): Promise<void> {
		const attemptId = this.getId();
		const credentials = this.getCredentials();
		const repo = new AnswerRepo();
		const { answer, questionId } = params;
		const agg = await CreateAnswerAggregateDomainService.execute(questionId, attemptId, credentials, answer);
		if (agg === null) {
			throw new DomainError("Attempt or question not found");
		}
		await repo.save(agg);
	}
} 
