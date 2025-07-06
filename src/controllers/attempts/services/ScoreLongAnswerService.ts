import { db } from "../../../configs/orm/kysely/db";
import { QuestionLoad } from "../../../domain/_mappers/QuestionMapper";
import { AttemptAggregate } from "../../../domain/attempt-agg/AttemptAggregate";
import { queryQuestions } from "../../../infrastructure/query/questions";
import { DomainError } from "../../../shared/errors/domain.error";

export class ScoreAttemptQueryService {
	static async score(agg: AttemptAggregate): Promise<{
		questions: QuestionLoad[];
		testLanguage: string;
	}> {
		const questions = await queryQuestions({
			testId: agg.getTestId(),
		});
		const test = await db
			.selectFrom("Tests")
			.select("Tests.language")
			.where("id", "=", agg.getTestId())
			.executeTakeFirst()
			;
		if (!test) {
			throw new DomainError(`Test with id ${agg.getTestId()} not found`);
		}
		return {
			questions,
			testLanguage: test.language,
		};
	}
}