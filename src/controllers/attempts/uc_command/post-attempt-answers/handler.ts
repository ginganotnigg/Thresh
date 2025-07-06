import { PostAttemptAnswersBody } from "./body";
import { AttemptRepo } from "../../../../infrastructure/repo/AttemptRepo";
import { AnswerDto } from "../../../../domain/_mappers/AnswerMapper";
import { CommandHandlerBase } from "../../../../shared/handler/usecase.base";

export class PostAttemptAnswersHandler extends CommandHandlerBase<PostAttemptAnswersBody> {
	async handle(params: PostAttemptAnswersBody): Promise<void> {
		const attemptId = this.getId();
		const credentials = this.getCredentials();
		const { answers } = params;
		const repo = new AttemptRepo();

		const agg = await repo.getById(attemptId);
		const answerMap = answers.map((a): {
			questionId: number;
			answer: AnswerDto | null;
		} => {
			const type = a.answer?.type;
			return {
				questionId: a.questionId,
				answer: a.answer
					? (type === "MCQ"
						? {
							type: "MCQ",
							chosenOption: a.answer.chosenOption,
							pointsReceived: null, // Points will be evaluated later
						}
						: {
							type: "LONG_ANSWER",
							answer: a.answer.answer,
							pointsReceived: null, // Points will be evaluated later
						})
					: null,
			};
		});
		agg.answerQuestions(credentials, answerMap);
		await repo.save(agg);
	}
}

