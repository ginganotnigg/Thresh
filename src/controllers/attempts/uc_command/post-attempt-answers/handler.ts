import { CommandHandlerBase } from "../../../shared/base/usecase.base";
import { DomainError } from "../../../shared/errors/domain.error";
import { CreateAnswerAggregateDomainService } from "../../domain/service/CreateAnswerAggregateDomainService";
import { AnswerRepo } from "../../infra/AnswerRepo";
import { PostAttemptAnswersBody } from "./body";

export class PostAttemptAnswersHandler extends CommandHandlerBase<PostAttemptAnswersBody> {
	async handle(params: PostAttemptAnswersBody): Promise<void> {
		const attemptId = this.getId();
		const credentials = this.getCredentials();
		const { answer, questionId } = params;
		const agg = await CreateAnswerAggregateDomainService.execute(questionId, attemptId, credentials, answer);
		if (agg === null) {
			throw new DomainError("Attempt or question not found");
		}
		await AnswerRepo.save(agg);
	}
} 
