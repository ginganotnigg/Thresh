import { AttemptAnswerFilterQuery, AttemptFilterQuery } from "./schemas/request";
import { AnswerQuestionResult, AttemptItemResult, AttemptResult } from "./schemas/response";
import sequelize from "../../configs/orm/sequelize";
import { Literal } from "sequelize/types/utils";
import { InferAttributes, Op, WhereOptions } from "sequelize";
import Test from "../../domain/models/test";
import { DomainErrorResponse } from "../../controller/errors/domain.error";
import { Paged } from "../../controller/schemas/base";
import Attempt from "../../domain/models/attempt";
import AttemptsAnswerQuestions from "../../domain/models/attempts_answer_questions";
import Question from "../../domain/models/question";
import Tag from "../../domain/models/tag";

export class HistoryQueryService {
	static async getTestAttempts(testId: number, filter: AttemptFilterQuery): Promise<Paged<AttemptItemResult>> {
		return await retrieveFilteredAttempts({ testId }, filter);
	}

	static async getAttemptDetail(attemptId: number): Promise<AttemptResult> {
		const attempt = await Attempt.findByPk(attemptId, {
			include: [
				{
					model: Test,
					attributes: ["id", "managerId", "title", "minutesToAnswer"],
					include: [{
						model: Tag,
						through: { attributes: [] },
						attributes: ["name"]
					}]
				}
			],
			attributes: {
				include: [
					getScoreSQL,
					getTotalScoreSQL,
					getTotalQuestionSQL,
					getTotalCorrectAnswerSQL,
					getTotalWrongAnswerSQL
				]
			}
		});
		if (attempt == null) {
			throw new DomainErrorResponse("Attempt not found");
		}
		return {
			id: attempt.id,
			test: {
				id: attempt.Test!.id,
				managerId: attempt.Test!.managerId,
				title: attempt.Test!.title,
				minutesToAnswer: attempt.Test!.minutesToAnswer,
				tags: attempt.Test!.Tags!.map(tag => tag.name)
			},
			candidateId: attempt.candidateId,
			startDate: attempt.createdAt,
			secondsSpent: attempt.secondsSpent,
			score: Number(attempt.get("score")!),
			totalScore: Number(attempt.get("totalScore")!),
			totalQuestions: Number(attempt.get("totalQuestions")!),
			totalCorrectAnswers: Number(attempt.get("totalCorrectAnswers")!),
			totalWrongAnswers: Number(attempt.get("totalWrongAnswers")!)
		};
	}

	static async getAttemptAnswers(attemptId: number, filter: AttemptAnswerFilterQuery): Promise<Paged<AnswerQuestionResult>> {
		const questionsUsedInAttemptIds = (await Question.findAll({
			attributes: ["id"],
			include: [
				{
					model: Test,
					required: true,
					attributes: [],
					include: [
						{
							model: Attempt,
							required: true,
							where: {
								id: attemptId
							},
							attributes: [],
						}
					],
				}
			],
		})).map(aaq => aaq.id!);

		const questionsOfAttempts = await Question.findAndCountAll({
			where: {
				id: { [Op.in]: questionsUsedInAttemptIds }
			},
			include: [
				{
					model: AttemptsAnswerQuestions,
					required: false,
					attributes: ["chosenOption"],
					where: {
						attemptId
					}
				}
			],
			limit: filter.perPage,
			offset: (filter.page - 1) * filter.perPage,
		});
		const data: AnswerQuestionResult[] = questionsOfAttempts.rows.map(qoa => {
			const question = {
				id: qoa.id!,
				text: qoa.text!,
				options: qoa.options!,
				points: qoa.points!,
				correctOption: qoa.correctOption!
			}
			let chosenOption = null;
			if (
				qoa.Attempts_answer_Questions != null &&
				qoa.Attempts_answer_Questions.length >= 1
			) {
				if (qoa.Attempts_answer_Questions.length !== 1) {
					throw new DomainErrorResponse("Invalid attempts_answer_qusetions data");
				}
				chosenOption = qoa.Attempts_answer_Questions[0].chosenOption;
			}
			return {
				question,
				chosenOption,
			}
		});
		const result = {
			data,
			total: questionsOfAttempts.count,
			page: filter.page,
			perPage: filter.perPage,
			totalPages: Math.ceil(questionsOfAttempts.count / filter.perPage)
		}
		return result;
	}

	static async getCandidateAttempts(candidateId: string, filter: AttemptFilterQuery): Promise<Paged<AttemptItemResult>> {
		return await retrieveFilteredAttempts({ candidateId }, filter);
	}

	static async getCandidateAttempt(candidateId: string, testId: number, filter: AttemptFilterQuery): Promise<Paged<AttemptItemResult>> {
		return await retrieveFilteredAttempts({ testId, candidateId }, filter)
	}
}

async function retrieveFilteredAttempts(whereClause: WhereOptions<InferAttributes<Attempt, { omit: never; }>>, filter: AttemptFilterQuery): Promise<Paged<AttemptItemResult>> {
	const order: [string | Literal, string][] = [];
	if (filter.sortByStartDate) {
		order.push(["createdAt", filter.sortByStartDate]);
	}
	if (filter.sortByScore) {
		order.push([sequelize.literal('score'), filter.sortByScore]);
	}
	const attempts = await Attempt.findAll({
		where: whereClause,
		include: [
			{
				model: Test,
				attributes: ["id", "managerId", "title", "minutesToAnswer"],
				include: [{
					model: Tag,
					through: { attributes: [] },
					attributes: ["name"]
				}]
			}
		],
		attributes: {
			include: [
				getScoreSQL,
				getTotalScoreSQL,
			]
		},
		order,
		limit: filter.perPage,
		offset: (filter.page - 1) * filter.perPage
	});
	const total = await Attempt.count({ where: whereClause });
	const data: AttemptItemResult[] = attempts.map(attempt => ({
		id: attempt.id,
		test: {
			id: attempt.Test!.id,
			managerId: attempt.Test!.managerId,
			title: attempt.Test!.title,
			minutesToAnswer: attempt.Test!.minutesToAnswer,
			tags: attempt.Test!.Tags!.map(tag => tag.name)
		},
		candidateId: attempt.candidateId,
		startDate: attempt.createdAt,
		score: Number(attempt.get("score")!),
		totalScore: Number(attempt.get("totalScore")!),
		secondsSpent: attempt.secondsSpent,
	}));
	return {
		data,
		total,
		page: filter.page,
		perPage: filter.perPage,
		totalPages: Math.ceil(total / filter.perPage)
	};
}

const getScoreSQL: [Literal, string] = [sequelize.literal(`(
	SELECT COALESCE(
		SUM(
			CASE 
				WHEN aaq.chosenOption = q.correctOption 
				THEN q.points 
				ELSE 0 
			END
		), 0)
	FROM Attempts_answer_Questions AS aaq 
	JOIN Questions AS q
	ON aaq.questionId = q.id
	WHERE aaq.attemptId = Attempt.id
	)`), "score"
];

const getTotalScoreSQL: [Literal, string] = [sequelize.literal(`(
	SELECT COALESCE(
		SUM(q.points), 0
	)
	FROM Questions AS q, Tests AS t
	WHERE q.testId = t.id
	AND t.id = Attempt.testId
	)`), "totalScore"
];

const getTotalQuestionSQL: [Literal, string] = [sequelize.literal(`(
	SELECT COUNT(*)
	FROM Questions AS q, Tests AS t
	WHERE q.testId = t.id
	AND t.id = Attempt.testId
	)`), "totalQuestions"
];

const getTotalCorrectAnswerSQL: [Literal, string] = [sequelize.literal(`(
	SELECT COUNT(*)
	FROM Attempts_answer_Questions AS aaq
	JOIN Questions AS q
	ON aaq.questionId = q.id
	WHERE aaq.attemptId = Attempt.id
	AND aaq.chosenOption = q.correctOption
	)`), "totalCorrectAnswers"
];

const getTotalWrongAnswerSQL: [Literal, string] = [sequelize.literal(`(
	SELECT COUNT(*)
	FROM Attempts_answer_Questions AS aaq
	JOIN Questions AS q
	ON aaq.questionId = q.id
	WHERE aaq.attemptId = Attempt.id
	AND aaq.chosenOption != q.correctOption
	)`), "totalWrongAnswers"
];


