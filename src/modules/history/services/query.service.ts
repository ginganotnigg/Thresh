import { Paged } from "../../../common/controller/base/param";
import Attempt from "../../../models/attempt";
import AttemptsAnswerQuestions from "../../../models/attempts_answer_questions";
import Test from "../../../models/test";
import Question from "../../../models/question";
import { AttemptAnswerFilterParam, AttemptFilterParam } from "../schemas/param";
import { AnswerQuestionResult, AttemptItemResult, AttemptResult } from "../schemas/result";
import Tag from "../../../models/tag";
import sequelize from "../../../configs/sequelize/database";
import { Literal } from "sequelize/types/utils";
import { InferAttributes, WhereOptions } from "sequelize";


export class QueryService {
	async getTestAttempts(testId: number, filter: AttemptFilterParam): Promise<Paged<AttemptItemResult>> {
		return await retrieveFilteredAttempts({ testId }, filter,);
	}

	async getAttemptDetail(attemptId: number): Promise<AttemptResult> {
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
					getTotalQuestionSQL,
					getTotalCorrectAnswerSQL,
					getTotalWrongAnswerSQL
				]
			}
		});
		if (attempt == null) {
			throw new Error("Attempt not found");
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
			score: Number(attempt.get("score")!),
			timeSpent: attempt.timeSpent,
			totalQuestions: Number(attempt.get("totalQuestions")!),
			totalCorrectAnswers: Number(attempt.get("totalCorrectAnswers")!),
			totalWrongAnswers: Number(attempt.get("totalWrongAnswers")!)
		};
	}

	async getAttemptAnswers(attemptId: number, filter: AttemptAnswerFilterParam): Promise<Paged<AnswerQuestionResult>> {
		const questionsOfAttempts = await Question.findAndCountAll({
			include: [
				{
					model: AttemptsAnswerQuestions,
					required: false,
					attributes: [],
					where: {
						attemptId
					}
				}
			],
			attributes: [],
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
			let chosenOption = -1;
			if (
				qoa.Attempts_answer_Questions != null &&
				qoa.Attempts_answer_Questions.length >= 1
			) {
				if (qoa.Attempts_answer_Questions.length !== 1) {
					throw new Error("Invalid attempts_answer_qusetions data");
				}
				chosenOption = qoa.Attempts_answer_Questions[0].chosenOption;
			}
			return {
				question,
				chosenOption,
			}
		});
		return {
			data,
			total: questionsOfAttempts.count,
			page: filter.page,
			perPage: filter.perPage,
			totalPages: Math.ceil(questionsOfAttempts.count / filter.perPage)
		}
	}

	async getCandidateAttempts(candidateId: string, filter: AttemptFilterParam): Promise<Paged<AttemptItemResult>> {
		return await retrieveFilteredAttempts({ candidateId }, filter);
	}

	async getCandidateAttempt(candidateId: string, testId: number, filter: AttemptFilterParam): Promise<Paged<AttemptItemResult>> {
		return await retrieveFilteredAttempts({ testId, candidateId }, filter)
	}
}

async function retrieveFilteredAttempts(whereClause: WhereOptions<InferAttributes<Attempt, { omit: never; }>>, filter: AttemptFilterParam): Promise<Paged<AttemptItemResult>> {
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
			include: [getScoreSQL]
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
		timeSpent: attempt.timeSpent
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
	FROM attempts_answer_questions AS aaq 
	JOIN questions AS q
	ON aaq.questionId = q.id
	WHERE aaq.attemptId = Attempt.id
	)`), "score"
];

const getTotalQuestionSQL: [Literal, string] = [sequelize.literal(`(
	SELECT COUNT(*)
	FROM questions AS q
	WHERE q.testId = Test.id
	)`), "totalQuestions"
];

const getTotalCorrectAnswerSQL: [Literal, string] = [sequelize.literal(`(
	SELECT COUNT(*)
	FROM attempts_answer_questions AS aaq
	JOIN questions AS q
	ON aaq.questionId = q.id
	WHERE aaq.attemptId = Attempt.id
	AND aaq.chosenOption = q.correctOption
	)`), "totalCorrectAnswers"
];

const getTotalWrongAnswerSQL: [Literal, string] = [sequelize.literal(`(
	SELECT COUNT(*)
	FROM attempts_answer_questions AS aaq
	JOIN questions AS q
	ON aaq.questionId = q.id
	WHERE aaq.attemptId = Attempt.id
	AND aaq.chosenOption != q.correctOption
	)`), "totalWrongAnswers"
];


