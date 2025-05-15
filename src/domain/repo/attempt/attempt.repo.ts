import { db } from "../../../configs/orm/kysely/db";
import sequelize from "../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../controller/errors/domain.error";
import Attempt from "../../models/attempt";
import AttemptsAnswerQuestions from "../../models/attempts_answer_questions";
import { attemptEmitter } from "../../../modules/attempts/init/emitter";

export class AttemptRepo {
	constructor(
		private readonly attempt: Attempt,
	) { }

	static async load(attemptId: string): Promise<AttemptRepo> {
		const attempt = await Attempt.findByPk(attemptId);
		if (!attempt) {
			throw new DomainError("Attempt not found");
		}
		return new AttemptRepo(attempt);
	}

	static async start({
		testId,
		candidatesId,
	}: {
		testId: string;
		candidatesId: string;
	}): Promise<AttemptRepo> {
		const transaction = await sequelize.transaction();
		try {
			const currentAttempt = await Attempt.findOne({
				where: {
					testId: testId,
					candidateId: candidatesId,
					hasEnded: false,
				},
				transaction,
			});
			if (currentAttempt) {
				throw new DomainError("Candidate already has an ongoing attempt for this test");
			}

			const numberOfPreviousAttempts = await Attempt.count({
				where: {
					testId: testId,
					candidateId: candidatesId,
				},
			});

			const attempt = await Attempt.create({
				order: numberOfPreviousAttempts + 1,
				testId: testId,
				candidateId: candidatesId,
				secondsSpent: 0,
				hasEnded: false,
			});
			await transaction.commit();
			attemptEmitter.emit("ATTEMPT_CREATED", attempt.id);

			return new AttemptRepo(attempt);
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async answerQuestion({
		questionId,
		chosenOption,
	}: {
		questionId: number;
		chosenOption: number | null | undefined;
	}): Promise<void> {
		if (this.attempt.hasEnded) {
			throw new DomainError("Attempt has already ended");
		}
		const transaction = await sequelize.transaction();
		try {
			if (chosenOption == null || chosenOption == undefined) {
				await AttemptsAnswerQuestions.destroy({
					where: {
						attemptId: this.attempt.get("id"),
						questionId: questionId,
					},
					transaction,
				});
			}
			else {
				await AttemptsAnswerQuestions.upsert({
					attemptId: this.attempt.get("id"),
					questionId: questionId,
					chosenOption: chosenOption,
				}, { transaction });
			}
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async submit(): Promise<void> {
		if (this.attempt.hasEnded) {
			throw new DomainError("Attempt has already ended");
		}
		const now = new Date();
		const secondsSpent = Math.floor((now.getTime() - this.attempt.createdAt.getTime()) / 1000);
		this.attempt.secondsSpent = secondsSpent;
		this.attempt.hasEnded = true;

		// Calculate total score for an attempt
		this.attempt.score = await db.selectFrom("Attempts_answer_Questions")
			.innerJoin("Questions", "Attempts_answer_Questions.questionId", "Questions.id")
			.select(db.fn.sum("Questions.points").as("score"))
			.where("Attempts_answer_Questions.attemptId", "=", this.attempt.id)
			.whereRef("Attempts_answer_Questions.chosenOption", "=", "Questions.correctOption")
			.executeTakeFirst()
			.then((result) => Number(result?.score) ?? 0);

		await this.attempt.save();
	}

}