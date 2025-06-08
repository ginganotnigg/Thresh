import { DomainError } from "../../shared/controller/errors/domain.error";
import Question from "../models/question";
import { TestAggregate, TestQuestionsAggregate } from "../../shared/resource/test.schema";
import { QuestionCore } from "../../shared/resource/question.schema";
import { QuestionToDo } from "../../shared/resource/question.schema";
import { db } from "../../configs/orm/kysely/db";

export class TestQueryRepo {
	static async getQuestions(testId: string): Promise<QuestionCore[]> {
		const questions = await Question.findAll({
			where: {
				testId: testId
			},
			order: [['id', 'ASC']]
		});

		if (!questions || questions.length === 0) {
			throw new DomainError(`No questions found for test with ID ${testId}`);
		}

		return questions;
	}

	static async getQuestion(questionId: string): Promise<QuestionCore> {
		const question = await Question.findByPk(questionId);
		if (!question) {
			throw new DomainError(`Question with ID ${questionId} not found`);
		}
		return question.toJSON();
	}

	static async getQuestionsToDo(testId: string): Promise<QuestionToDo[]> {
		const questions = await Question.findAll({
			where: {
				testId: testId
			},
			attributes: { exclude: ["correctOption"] },
			order: [['id', 'ASC']],
		});

		return questions;
	}

	static async getTestAggregate(testId: string): Promise<TestAggregate> {
		const numberOfQuestions = await Question.count({
			where: {
				testId: testId
			}
		});
		const totalPoints = await Question.sum("points", {
			where: {
				testId: testId
			}
		});
		return {
			numberOfQuestions: numberOfQuestions,
			totalPoints: totalPoints
		};
	}

	static async getTestQuestionsAggregate(testId: string): Promise<TestQuestionsAggregate[]> {
		const questions = await db.selectFrom("Questions")
			.leftJoin(
				"Attempts_answer_Questions",
				"Questions.id", "Attempts_answer_Questions.questionId"
			)
			.select(e => [
				"Questions.id",
				"Questions.points",
				e.fn.count<number>("Attempts_answer_Questions.id")
					.distinct()
					.as("numberOfAnswers"),
				e.fn.count<number>("Attempts_answer_Questions.id")
					.distinct()
					.filterWhereRef("Attempts_answer_Questions.chosenOption", "=", "Questions.correctOption")
					.as("numberOfCorrectAnswers"),
			])
			.where("testId", "=", testId)
			.groupBy("id")
			.execute();

		return questions.map(question => ({
			questionId: question.id,
			numberOfAnswers: question.numberOfAnswers,
			numberOfCorrectAnswers: question.numberOfCorrectAnswers,
			averagePoints: question.numberOfAnswers > 0
				? (question.numberOfCorrectAnswers / question.numberOfAnswers) * question.points
				: 0,
		}));
	}
}