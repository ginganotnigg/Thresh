import { DomainError } from "../../../controller/errors/domain.error";
import Question from "../../models/question";
import Test from "../../models/test";
import { TestAggregateQuery, TestAggregateResponse } from "../../schema/aggregate.schema";
import { QuestionCore } from "../../schema/core.schema";
import { QuestionToDo } from "../../schema/variants.schema";

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
		const attributes = Question.getAttributes();
		type Keys = keyof typeof attributes;
		const excludeKeys: Keys[] = ["correctOption"];

		const questions = await Question.findAll({
			where: {
				testId: testId
			},
			attributes: { exclude: excludeKeys },
			order: [['id', 'ASC']],
		});

		return questions;
	}

	static async getTestAggregate(testId: string, query: TestAggregateQuery): Promise<TestAggregateResponse> {
		const { numberOfQuestions, totalPoints } = query;
		const test = await Test.findOne({ where: { id: testId } });
		if (!test) throw new DomainError("Test not found");

		const res: TestAggregateResponse = {};
		if (numberOfQuestions && numberOfQuestions === true) {
			const numberOfQuestions = await Question.count({
				where: {
					testId: test.id
				}
			});
			res.numberOfQuestions = numberOfQuestions;
		}

		if (totalPoints && totalPoints === true) {
			const totalPoints = await Question.sum("points", {
				where: {
					testId: test.id
				}
			});
			res.totalPoints = totalPoints;
		}
		return res;
	}
}