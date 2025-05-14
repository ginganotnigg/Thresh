import { DomainError } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import AttemptsAnswerQuestions from "../../../../domain/models/attempts_answer_questions";
import { AnswerCore } from "../../../../domain/schema/core.schema";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import {
	AttemptAggregateQuery,
	AttemptAggregateResponse
} from "../../schema";
import ExamTest from "../../../../domain/models/exam_test";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import { db } from "../../../../configs/orm/kysely/db";
import { sql } from "kysely";
import { AttemptAggregate } from "../../schema/exam.schema";

/**
 * Query class for attempts that has ended
 * @param attempt Attempt object
 * @throws DomainError if attempt is not ended
 */
export class AttemptOfExamRead {
	private constructor(
		private readonly attempt: Attempt,
		private readonly credentials: CredentialsMeta,
	) {
		this.checkSelf();
		this.checkAllowedToSeeOtherResults();
	}

	private checkSelf(): void {
		if (this.credentials.userId !== this.attempt.candidateId) {
			throw new DomainError(`This is not your attempt`);
		}
	}
	private checkAuthor(): void {
		if (this.credentials.userId !== this.attempt.Test!.authorId) {
			throw new DomainError(`You are not the author of this test`);
		}
	}
	private checkAllowedToSeeOtherResults(): void {
		if (
			this.attempt.Test!.ExamTest!.isAllowedToSeeOtherResults === false &&
			this.credentials.userId !== this.attempt.candidateId &&
			this.credentials.userId !== this.attempt.Test!.authorId
		) {
			throw new DomainError(`You are not allowed to see other results`);
		}
	}

	static async create(attemptId: string, credentials: CredentialsMeta): Promise<AttemptOfExamRead> {
		const attempt = await Attempt.findByPk(attemptId, {
			include: [{
				model: Test,
				required: true,
				include: [{
					model: ExamTest,
					required: true,
				}]
			}],
		});
		if (!attempt) {
			throw new DomainError(`Attempt not found`);
		}
		return new AttemptOfExamRead(attempt, credentials);
	}

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

	/**
	 * Get answers for a specific attempt
	 */
	async getAttemptAnswers(): Promise<AnswerCore[]> {
		this.checkAuthor();
		const answers = await AttemptsAnswerQuestions.findAll({
			where: {
				attemptId: this.attempt.id,
			},
			order: [['questionId', 'ASC']],
		});
		return answers;
	}

	/**
	 * Get a single attempt by ID
	 */
	async getAttempt(): Promise<AttemptInfo> {
		return {
			...this.attempt.toJSON(),
		};
	}
}
