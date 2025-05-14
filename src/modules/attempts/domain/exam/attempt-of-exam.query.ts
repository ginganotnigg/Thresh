import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { QueryTypes } from "sequelize";
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
import fs from "fs";
import path from "path";
import ExamTest from "../../../../domain/models/exam_test";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import Question from "../../../../domain/models/question";
import { db } from "../../../../configs/orm/kysely/db";

/**
 * Query class for attempts that has ended
 * @param attempt Attempt object
 * @throws DomainError if attempt is not ended
 */
export class AttemptOfTestQuery {
	private sqlDir = path.join(__dirname, "../app/query/sql");

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

	static async retrive(attemptId: string, credentials: CredentialsMeta): Promise<AttemptOfTestQuery> {
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
		return new AttemptOfTestQuery(attempt, credentials);
	}

	/**
	 * Get aggregated information about an attempt
	 */
	async getAttemptAggregate(option: AttemptAggregateQuery): Promise<AttemptAggregateResponse> {
		if (this.attempt.hasEnded === false) {
			throw new DomainError(`Attempt is not ended, cannot sumarize results`);
		}
		const { score, answered, answeredCorrect } = option;
		const result: AttemptAggregateResponse = {};

		if (score) {
			const getScoreSql = fs.readFileSync(path.join(this.sqlDir, "getScore.sql"), "utf8");
			const scoreResult = await sequelize.query(getScoreSql,
				{
					replacements: { attemptId: this.attempt.id },
					type: QueryTypes.SELECT,
				}
			);
			result.score = parseInt((scoreResult[0] as any)?.res) || undefined;
		}
		if (answered) {
			const getNumberOfAnswers = fs.readFileSync(path.join(this.sqlDir, "getNumberOfAnswers.sql"), "utf8");
			const answeredResult = await sequelize.query(
				getNumberOfAnswers,
				{
					replacements: { attemptId: this.attempt.id },
					type: QueryTypes.SELECT,
				}
			);
			result.answered = parseInt((answeredResult[0] as any)?.res) || undefined;
		}
		if (answeredCorrect) {
			const getNumberOfCorrectAnswers = fs.readFileSync(path.join(this.sqlDir, "getNumberOfCorrectAnswers.sql"), "utf8");
			const answeredCorrectResult = await sequelize.query(getNumberOfCorrectAnswers,
				{
					replacements: { attemptId: this.attempt.id },
					type: QueryTypes.SELECT,
				}
			);
			result.answeredCorrect = parseInt((answeredCorrectResult[0] as any)?.res) || undefined;
		}

		return result;
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
