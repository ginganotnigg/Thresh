import { db } from "../../configs/orm/kysely/db";
import { CredentialsBase } from "../../shared/policy/types";
import { AnswerAggregate } from "../AnswerAggregate";
import { AnswerDto } from "../mappers/AnswerMapper";
import { AttemptDto } from "../mappers/AttemptMapper";
import { QuestionDto } from "../mappers/QuestionMapper";


export class CreateAnswerAggregateDomainService {
	static async execute(
		questionId: number,
		attemptId: string,
		credential: CredentialsBase,
		answer: AnswerDto | null,
	): Promise<AnswerAggregate | null> {
		const questionRaw = await db
			.selectFrom("Questions")
			.where("id", "=", questionId)
			.selectAll()
			.executeTakeFirst();
		if (!questionRaw) return null;
		const attemptRaw = await db
			.selectFrom("Attempts")
			.where("id", "=", attemptId)
			.selectAll()
			.executeTakeFirst();
		if (!attemptRaw) return null;
		const question: QuestionDto = {
			...questionRaw,
		};
		const attempt: AttemptDto = {
			...attemptRaw,
			testId: attemptRaw.TestId!,
		};

		const answerAggregate = AnswerAggregate.create(answer, attempt, question, credential);
		return answerAggregate;
	}
}
