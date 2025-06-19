import sequelize from "../../configs/orm/sequelize/sequelize";
import { Op } from "sequelize";
import { db } from "../../configs/orm/kysely/db";
import { DomainError } from "../../shared/errors/domain.error";
import { QuestionPersistence } from "../../domain/mappers/QuestionMapper";
import { TestPersistence } from "../../domain/mappers/TestMapper";
import { TestAggregate } from "../../domain/test-agg/TestAggregate";
import { LongAnswerDetailCommon, MCQDetailCommon } from "../../schemas/common/question-detail";
import ExamTest from "../models/exam_test";
import LAQuestion from "../models/la_question";
import MCQQuestion from "../models/mcq_question";
import PracticeTest from "../models/practice_test";
import Question from "../models/question";
import Test from "../models/test";
import { RepoBase } from "./RepoBase";

export class TestRepo extends RepoBase<TestAggregate> {
	protected async _save(agg: TestAggregate): Promise<void> {
		const { test, questions } = agg.toPersistence();
		const transaction = await sequelize.transaction();
		try {
			const [res] = await Test.upsert(test, { transaction });
			if (test.mode === "EXAM" && test.detail.mode === "EXAM") {
				await ExamTest.upsert({
					testId: res.id,
					...test.detail,
				}, { transaction });
			}
			else if (test.mode === "PRACTICE" && test.detail.mode === "PRACTICE") {
				await PracticeTest.upsert({
					testId: res.id,
					...test.detail,
				}, { transaction });
			}
			await Question.destroy({
				where: { testId: test.id },
				cascade: true,
				transaction,
			});
			await Question.bulkCreate(questions.map(q => ({
				points: q.points,
				text: q.text,
				type: q.type,
				id: q.id,
				testId: q.testId,
			})),
				{ transaction }
			);
			const mcqs = questions
				.map(q => q.detail.type === "MCQ" ? {
					id: q.id,
					type: q.detail.type,
					correctOption: q.detail.correctOption,
					options: q.detail.options,
				} : null)
				.filter(q => q !== null);

			const laqs = questions
				.map(q => q.detail.type === "LONG_ANSWER" ? {
					id: q.id,
					type: q.detail.type,
					correctAnswer: q.detail.correctAnswer,
					imageLinks: q.detail.imageLinks,
					extraText: q.detail.extraText,
				} : null)
				.filter(q => q !== null);
			await MCQQuestion.bulkCreate(mcqs.map(q => ({
				questionId: q.id,
				correctOption: q.correctOption,
				options: q.options,
				type: q.type,
			}), { transaction }));

			await LAQuestion.bulkCreate(laqs.map(q => ({
				questionId: q.id,
				correctAnswer: q.correctAnswer,
				imageLinks: q.imageLinks ?? null,
				extraText: q.extraText ?? null,
				type: q.type,
			})), { transaction });

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
	async getById(testId: string): Promise<TestAggregate> {
		const test = await db
			.selectFrom("Tests")
			.where("id", "=", testId)
			.selectAll()
			.executeTakeFirst();

		if (!test) {
			throw new DomainError(`Test with id ${testId} not found`);
		}

		// Get questions for this test
		const questions = await db
			.selectFrom("Questions")
			.where("TestId", "=", testId)
			.selectAll()
			.execute();

		// Check if test has attempts to determine hasAttempts flag
		const attemptCount = await db
			.selectFrom("Attempts")
			.where("TestId", "=", testId)
			.select((eb) => eb.fn.count<number>("id").as("count"))
			.executeTakeFirst();

		const hasAttempts = Number(attemptCount?.count ?? 0) > 0;

		// Get test details based on mode
		let testDetail: any;
		if (test.mode === "EXAM") {
			const examTest = await db
				.selectFrom("ExamTests")
				.where("testId", "=", testId)
				.selectAll()
				.executeTakeFirst();

			testDetail = {
				mode: "EXAM" as const,
				roomId: examTest?.roomId || "",
				openDate: examTest?.openDate || new Date(),
				closeDate: examTest?.closeDate || new Date(),
				numberOfParticipants: examTest?.numberOfParticipants || 0,
				numberOfAttemptsAllowed: examTest?.numberOfAttemptsAllowed || 1,
				isPublic: Boolean(examTest?.isPublic),
				isAnswerVisible: Boolean(examTest?.isAnswerVisible),
				isAllowedToSeeOtherResults: Boolean(examTest?.isAllowedToSeeOtherResults),
				password: examTest?.password || null,
			};
		} else {
			const practiceTest = await db
				.selectFrom("PracticeTests")
				.where("testId", "=", testId)
				.selectAll()
				.executeTakeFirst();

			testDetail = {
				mode: "PRACTICE" as const,
				difficulty: practiceTest?.difficulty || "",
				tags: (practiceTest?.tags as string[]) || [],
				numberOfQuestions: practiceTest?.numberOfQuestions || 0,
				numberOfOptions: practiceTest?.numberOfOptions || 4,
				outlines: (practiceTest?.outlines as string[]) || [],
			};
		}

		// Build test persistence object
		const testPersistence: TestPersistence = {
			id: test.id,
			authorId: test.authorId,
			title: test.title,
			description: test.description,
			minutesToAnswer: test.minutesToAnswer,
			language: test.language,
			mode: test.mode as "EXAM" | "PRACTICE",
			createdAt: test.createdAt!,
			updatedAt: test.updatedAt!,
			detail: testDetail
		};

		// Get question details and convert to persistence format
		const questionsPersistence: QuestionPersistence[] = [];
		for (const q of questions) {
			let questionDetail: any;
			if (q.type === "MCQ") {
				const mcqDetail = await db
					.selectFrom("MCQQuestions")
					.where("questionId", "=", q.id)
					.selectAll()
					.executeTakeFirst();

				questionDetail = {
					type: "MCQ" as const,
					options: (mcqDetail?.options as string[]) || [],
					correctOption: mcqDetail?.correctOption || 0
				};
			} else {
				const laDetail = await db
					.selectFrom("LAQuestions")
					.where("questionId", "=", q.id)
					.selectAll()
					.executeTakeFirst();

				questionDetail = {
					type: "LONG_ANSWER" as const,
					correctAnswer: laDetail?.correctAnswer || "",
					imageLinks: (laDetail?.imageLinks as string[]) || null,
					extraText: laDetail?.extraText || null
				};
			}

			questionsPersistence.push({
				id: q.id,
				testId: q.TestId!,
				text: q.text,
				type: q.type as "MCQ" | "LONG_ANSWER",
				points: q.points,
				detail: questionDetail
			});
		}

		return TestAggregate.fromPersistence(testPersistence, questionsPersistence, hasAttempts);
	}

	async delete(testId: string): Promise<void> {
		// First get the test to check if it has attempts
		const agg = await this.getById(testId);
		const transaction = await sequelize.transaction();
		try {
			// Delete related question details first
			await LAQuestion.destroy({
				where: {
					questionId: {
						[Op.in]: sequelize.literal(`(SELECT id FROM Questions WHERE testId = '${testId}')`)
					}
				},
				transaction,
			});

			await MCQQuestion.destroy({
				where: {
					questionId: {
						[Op.in]: sequelize.literal(`(SELECT id FROM Questions WHERE testId = '${testId}')`)
					}
				},
				transaction,
			});

			// Delete questions
			await Question.destroy({
				where: { testId: testId },
				transaction,
			});

			// Delete practice/exam test records
			await PracticeTest.destroy({
				where: { testId: testId },
				transaction,
			});

			await ExamTest.destroy({
				where: { testId: testId },
				transaction,
			});

			// Finally delete the test itself
			await Test.destroy({
				where: { id: testId },
				transaction,
			});

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}