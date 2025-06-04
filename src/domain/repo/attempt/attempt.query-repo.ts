import { DomainError } from "../../../shared/controller/errors/domain.error";
import AttemptsAnswerQuestions from "../../models/attempts_answer_questions";
import { AnswerCore } from "../../schema/core.schema";
import { db } from "../../../configs/orm/kysely/db";
import { sql } from "kysely";
import { AttemptAggregate } from "../../../modules/attempts/schema/of-test.schema";
import Attempt from "../../models/attempt";

export class AttemptQueryRepo {
	constructor(
		private readonly attempt: Attempt,
	) { }

	async getAttemptAggregate(): Promise<AttemptAggregate> {
		if (this.attempt.hasEnded === false) {
			throw new DomainError(`Attempt is not ended, cannot summarize results`);
		}
		const attemptId = this.attempt.id;
		const answeredResult = await db
			.selectFrom('Attempts_answer_Questions')
			.where('Attempts_answer_Questions.attemptId', '=', attemptId)
			.select(
				sql<number>`COUNT(DISTINCT \`Attempts_answer_Questions\`.\`questionId\`)`.as('res')
			)
			.executeTakeFirst();

		const answeredCorrectResult = await db
			.selectFrom('Attempts_answer_Questions')
			.innerJoin('Questions', 'Questions.id', 'Attempts_answer_Questions.questionId')
			.where('Attempts_answer_Questions.attemptId', '=', attemptId)
			.whereRef('Attempts_answer_Questions.chosenOption', '=', 'Questions.correctOption')
			.select(
				sql<number>`COUNT(DISTINCT \`Attempts_answer_Questions\`.\`questionId\`)`.as('res')
			)
			.executeTakeFirst();

		return {
			answered: answeredResult?.res ?? 0,
			answeredCorrect: answeredCorrectResult?.res ?? 0,
		};
	}

	async getAttemptAnswers(): Promise<AnswerCore[]> {
		const answers = await AttemptsAnswerQuestions.findAll({
			where: {
				attemptId: this.attempt.id,
			},
			order: [['questionId', 'ASC']],
		});
		return answers;
	}
}
