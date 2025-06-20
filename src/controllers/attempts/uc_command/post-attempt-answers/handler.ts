import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";
import { PostAttemptAnswersBody } from "./body";
import { AttemptRepo } from "../../../../infrastructure/repo/AttemptRepo";
import { TestRepo } from "../../../../infrastructure/repo/TestRepo";
import { QuestionMapper } from "../../../../domain/_mappers/QuestionMapper";

export class PostAttemptAnswersHandler extends CommandHandlerBase<PostAttemptAnswersBody> {
	async handle(params: PostAttemptAnswersBody): Promise<void> {
		const attemptId = this.getId();
		const credentials = this.getCredentials();
		const { answer, questionId } = params;

		const repo = new AttemptRepo();
		const agg = await repo.getById(attemptId);

		const questionPersistence = await (new TestRepo().getQuestion(questionId));
		const questionDto = QuestionMapper.toDto(questionPersistence);

		agg.answerQuestion(credentials, questionId, questionDto, answer ? { ...answer } : null);
		await repo.save(agg);
	}
} 
