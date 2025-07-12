import sequelize from "../../configs/orm/sequelize/sequelize";
import { Op } from "sequelize";
import { db } from "../../configs/orm/kysely/db";
import { DomainError } from "../../shared/errors/domain.error";
import { QuestionPersistence } from "../../domain/_mappers/QuestionMapper";
import { TestLoad } from "../../domain/_mappers/TestMapper";
import { TestAggregate } from "../../domain/test-agg/TestAggregate";
import ExamTest from "../models/exam_test";
import LAQuestion from "../models/la_question";
import MCQQuestion from "../models/mcq_question";
import PracticeTest from "../models/practice_test";
import Question from "../models/question";
import Test from "../models/test";
import { RepoBase } from "./RepoBase";
import { UniqueExamCheck } from "../../controllers/tests/services/unique-exam-check";

export class TestRepo extends RepoBase<TestAggregate> {

	protected async _save(agg: TestAggregate): Promise<void> {
		const { test, questions } = agg.toPersistence();
		const transaction = await sequelize.transaction();

		// Repo level validation
		// 2 exams with the same roomId cannot exist at the same time
		if (test.detail.mode === "EXAM") {
			const isRoomIdUnique = await UniqueExamCheck.isRoomIdUnique(
				test.detail.roomId,
				test.detail.openDate,
				test.detail.closeDate,
				test.id, // Pass current test ID to allow updates
			);
			if (!isRoomIdUnique) {
				throw new DomainError(`Room ID ${test.detail.roomId} already exists for another exam.`);
			}
		}

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

			// We update the questions (will delete old ones and insert new ones)
			if (questions.length > 0) {
				await Question.destroy({
					where: {
						testId: res.id,
					},
					cascade: true,
					transaction,
				});

				for (const q of questions) {
					const newQuestion = await Question.create({
						points: q.points,
						text: q.text,
						type: q.type,
						testId: q.testId,
					}, { transaction });
					if (q.detail.type === "MCQ") {
						await MCQQuestion.create({
							questionId: newQuestion.id,
							correctOption: q.detail.correctOption,
							options: q.detail.options,
						}, { transaction });
					}
					else if (q.detail.type === "LONG_ANSWER") {
						await LAQuestion.create({
							questionId: newQuestion.id,
							correctAnswer: q.detail.correctAnswer,
							imageLinks: q.detail.imageLinks ?? null,
							extraText: q.detail.extraText ?? null,
						}, { transaction });
					}
				}
			}

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async getQuestion(questionId: number): Promise<QuestionPersistence> {
		const question = await db
			.selectFrom("Questions")
			.where("id", "=", questionId)
			.selectAll()
			.executeTakeFirst();

		if (!question) {
			throw new DomainError(`Question with id ${questionId} not found`);
		}

		let detail: any;
		if (question.type === "MCQ") {
			const mcqDetail = await db
				.selectFrom("MCQQuestions")
				.where("questionId", "=", questionId)
				.selectAll()
				.executeTakeFirst();

			detail = {
				type: "MCQ" as const,
				correctOption: mcqDetail?.correctOption || 0,
				options: (mcqDetail?.options as string[]) || [],
			};
		} else {
			const laDetail = await db
				.selectFrom("LAQuestions")
				.where("questionId", "=", questionId)
				.selectAll()
				.executeTakeFirst();

			detail = {
				type: "LONG_ANSWER" as const,
				correctAnswer: laDetail?.correctAnswer || "",
				imageLinks: (laDetail?.imageLinks as string[]) || null,
				extraText: laDetail?.extraText || null,
			};
		}

		return {
			id: question.id,
			testId: question.testId!,
			text: question.text,
			type: question.type,
			points: question.points,
			detail
		};
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
			.where("testId", "=", testId)
			.selectAll()
			.execute();

		// Check if test has attempts to determine hasAttempts flag
		const attemptCount = await db
			.selectFrom("Attempts")
			.where("testId", "=", testId)
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

		let hasParticipants = true;
		if (test.mode === "EXAM") {
			const participantCount = await db
				.selectFrom("ExamParticipants")
				.where("testId", "=", testId)
				.select((eb) => eb.fn.count<number>("id").as("count"))
				.executeTakeFirst();

			hasParticipants = Number(participantCount?.count ?? 0) > 0;
		}

		// Build test persistence object
		const testPersistence: TestLoad = {
			id: test.id,
			authorId: test.authorId,
			title: test.title,
			description: test.description,
			minutesToAnswer: test.minutesToAnswer,
			language: test.language,
			mode: test.mode as "EXAM" | "PRACTICE",
			createdAt: test.createdAt!,
			updatedAt: test.updatedAt!,
			detail: testDetail,
			hasAttempts: hasAttempts,
			hasParticipants: hasParticipants,
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
				testId: q.testId!,
				text: q.text,
				type: q.type as "MCQ" | "LONG_ANSWER",
				points: q.points,
				detail: questionDetail
			});
		}

		return TestAggregate.fromPersistence(
			testPersistence,
			questionsPersistence,
		);
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