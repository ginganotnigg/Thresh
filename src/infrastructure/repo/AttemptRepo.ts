import { db } from "../../configs/orm/kysely/db";
import sequelize from "../../configs/orm/sequelize/sequelize";
import Attempt from "../models/attempt";
import { DomainError } from "../../shared/errors/domain.error";
import { AttemptAggregate } from "../../domain/attempt-agg/AttemptAggregate";
import { AttemptLoad } from "../../domain/_mappers/AttemptMapper";
import { AnswerLoad, AnswerPersistence } from "../../domain/_mappers/AnswerMapper";
import { RepoBase } from "./RepoBase";
import AttemptsAnswerQuestions from "../models/attempts_answer_questions";
import { Op, OptimisticLockError } from "sequelize";
import AttemptsAnswerMCQQuestions from "../models/attempts_answer_mcq_questions";
import AttemptsAnswerLAQuestions from "../models/attempts_answer_la_questions";
import { OptimisticError } from "../../shared/errors/optimistic.error";

export class AttemptRepo extends RepoBase<AttemptAggregate> {
	private version: number = 0;

	private async getAnswers(attemptId: string): Promise<AnswerLoad[]> {
		const raw = await db
			.selectFrom("AttemptsAnswerQuestions as aaq")
			.leftJoin("AttemptsAnswerMCQQuestions as aaqmcq", "aaq.id", "aaqmcq.attemptAnswerQuestionId")
			.leftJoin("AttemptsAnswerLAQuestions as aaqla", "aaq.id", "aaqla.attemptAnswerQuestionId")
			.innerJoin("Questions as q", "aaq.questionId", "q.id")
			.leftJoin("MCQQuestions as mcq", "q.id", "mcq.questionId")
			.leftJoin("LAQuestions as laq", "q.id", "laq.questionId")
			.where("aaq.attemptId", "=", attemptId)
			.selectAll(["aaq"])
			.select([
				"q.id as questionId",
				"q.text as text",
				"q.points as points",
				"mcq.correctOption as correctOption",
				"mcq.options as options",
				"laq.correctAnswer as correctAnswer",
				"laq.extraText as extraText",
				"laq.imageLinks as imageLinks",
			])
			.select([
				"aaqmcq.attemptAnswerQuestionId as aaqmcq_attemptAnswerQuestionId",
				"aaqmcq.chosenOption as chosenOption",
				"aaqla.attemptAnswerQuestionId as aaqla_attemptAnswerQuestionId",
				"aaqla.answer as answer",
				"aaqla.comment as comment",
			])
			.execute();
		;
		const answers: AnswerLoad[] = raw.map((row): AnswerLoad | null => {
			if (row.aaqmcq_attemptAnswerQuestionId != null) {
				return {
					id: row.id,
					questionId: row.questionId!,
					pointsReceived: row.pointsReceived,
					type: "MCQ",
					attemptId: row.attemptId!,
					chosenOption: row.chosenOption!,
				}
			} else if (row.aaqla_attemptAnswerQuestionId != null) {
				return {
					id: row.id,
					questionId: row.questionId!,
					pointsReceived: row.pointsReceived,
					type: "LONG_ANSWER",
					attemptId: row.attemptId!,
					answer: row.answer!,
					comment: row.comment!,
				}
			} else {
				return null;
			}
		}).filter((a) => a !== null) as AnswerLoad[];
		return answers;
	}

	async getById(attemptId: string): Promise<AttemptAggregate> {
		const attempt = await db
			.selectFrom("Attempts as a")
			.where("a.id", "=", attemptId)
			.innerJoin("Tests as t", "t.id", "a.testId")
			.groupBy("a.id")
			.selectAll("a")
			.select([
				"t.mode",
				"t.id as testId",
			])
			.executeTakeFirst()
			;
		if (!attempt) {
			throw new DomainError(`Attempt with id ${attemptId} not found`);
		}

		const answers = await this.getAnswers(attempt.id);

		const load: AttemptLoad = {
			id: attempt.id,
			candidateId: attempt.candidateId,
			testId: attempt.testId!,
			hasEnded: attempt.hasEnded === 1,
			order: attempt.order,
			secondsSpent: attempt.secondsSpent,
			status: attempt.status,
			createdAt: attempt.createdAt!,
			answers: answers,
			test: {
				mode: attempt.mode
			}
		}
		const agg = AttemptAggregate.load(load);
		this.version = attempt.version ?? 0;
		return agg;
	}

	async _save(agg: AttemptAggregate): Promise<void> {
		const persistence = agg.getPersistenceData();
		const transaction = await sequelize.transaction();
		try {
			// const attempt = await Attempt.findByPk(persistence.id);
			// if (attempt && attempt.version !== this.version) {
			// 	throw new OptimisticError(`Attempt with id ${persistence.id} has been modified by another process.`);
			// }

			await Attempt.upsert({
				id: persistence.id,
				candidateId: persistence.candidateId,
				testId: persistence.testId,
				hasEnded: persistence.hasEnded,
				order: persistence.order,
				secondsSpent: persistence.secondsSpent,
				status: persistence.status,
				version: this.version + 1,
			}, {
				transaction,
			});

			const questionIds = persistence.updatedAnswers.map((a) => a.questionId);
			const answersToPersist = persistence.updatedAnswers.filter(a => a.type !== "CLEAR_ANSWER");
			const mcqAnswers = answersToPersist.filter((a) => a.type === "MCQ");
			const laAnswers = answersToPersist.filter((a) => a.type === "LONG_ANSWER");

			await AttemptsAnswerQuestions.destroy({
				where: {
					attemptId: persistence.id,
					questionId: {
						[Op.in]: questionIds,
					},
				},
				cascade: true,
				transaction,
			});

			await AttemptsAnswerQuestions.bulkCreate(
				answersToPersist.map((a) => ({
					id: a.id,
					attemptId: persistence.id,
					questionId: a.questionId,
					type: a.type,
					pointsReceived: a.pointsReceived ?? undefined,
				})),
				{ transaction },
			);

			await AttemptsAnswerMCQQuestions.bulkCreate(
				mcqAnswers.map((a) => {
					return {
						attemptAnswerQuestionId: a.id,
						chosenOption: a.chosenOption,
					}
				}),
				{ transaction },
			);

			await AttemptsAnswerLAQuestions.bulkCreate(
				laAnswers.map((a) => {
					return {
						attemptAnswerQuestionId: a.id,
						answer: a.answer,
						comment: a.comment,
					}
				}),
				{ transaction },
			);

			await transaction.commit();
		}
		catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}