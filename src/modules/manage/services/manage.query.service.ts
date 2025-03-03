import { Paged } from "../../../common/controller/schemas/base";
import Question from "../../../models/question";
import Tag from "../../../models/tag";
import Test from "../../../models/test";
import { TestFilterQuery } from "../schemas/request";
import { QuestionResponse, TestItemResponse, TestResponse } from "../schemas/response";
import { Op } from "sequelize";
import Sequelize from "sequelize";

export class ManageQueryService {
	static async getTests(filter: TestFilterQuery): Promise<Paged<TestItemResponse>> {
		const { whereClause, includeTagsClause } = getFilterCondition(filter);
		return await findAllWithFilter(whereClause, includeTagsClause, filter);
	}

	static async getTest(id: number): Promise<TestResponse | null> {
		const row = await Test.findByPk(id, {
			include: [
				{
					model: Tag,
					through: { attributes: [] },
					attributes: ["id", "name", "createdAt", "updatedAt"]
				}
			],
			attributes: {
				include: [
					[
						Sequelize.literal(`(
						  SELECT COUNT(*)
						  FROM Attempts AS Attempt
						  WHERE Attempt.testId = Test.id
						)`),
						"answerCount"
					]
				]
			},
		});
		if (!row) return null;
		return {
			id: row.id!,
			managerId: row.managerId!,
			title: row.title!,
			difficulty: row.difficulty!,
			description: row.description!,
			minutesToAnswer: row.minutesToAnswer!,
			tags: row.Tags!.map(t => t.name!),
			answerCount: row.get('answerCount')!,
			createdAt: row.createdAt!,
			updatedAt: row.updatedAt!
		};
	}

	static async getQuestions(testId: number): Promise<QuestionResponse[]> {
		const questions = await Question.findAll({
			where: {
				testId
			}
		});
		return questions.map(q => ({
			id: q.id!,
			text: q.text!,
			options: q.options!,
			points: q.points!,
			correctOption: q.correctOption!
		}));
	}

	static async getManagerTests(managerId: string, filter: TestFilterQuery): Promise<Paged<TestItemResponse>> {
		const { whereClause, includeTagsClause } = getFilterCondition(filter);
		const companyWhereClause = { ...whereClause, managerId };
		return await findAllWithFilter(companyWhereClause, includeTagsClause, filter);
	}
}

function getFilterCondition(filter: TestFilterQuery) {
	const difficultyArray = filter.difficulty != null && typeof filter.difficulty === "string" ? [filter.difficulty] : filter.difficulty;
	const whereClase = {
		...(filter.searchTitle && {
			title: {
				[Op.like]: `%${filter.searchTitle}%`
			}
		}),
		// Todo: check conditions, min max is wrong (it is or, not and)
		...(filter.minMinutesToAnswer !== undefined && {
			minutesToAnswer: {
				[Op.gte]: filter.minMinutesToAnswer
			}
		}),
		...(filter.maxMinutesToAnswer !== undefined && {
			minutesToAnswer: {
				[Op.lte]: filter.maxMinutesToAnswer
			}
		}),
		...(filter.difficulty != null && filter.difficulty.length > 0 && {
			difficulty: {
				[Op.in]: difficultyArray
			}
		}),
	};
	const includeTagsClause = {
		model: Tag,
		where: filter.tags != null && filter.tags.length > 0 ? {
			id: { [Op.in]: filter.tags! }
		} : {},
		through: { attributes: [] },
		attributes: ["id", "name", "createdAt", "updatedAt"]
	};
	return { whereClause: whereClase, includeTagsClause };
}

async function findAllWithFilter(whereClause: any, includeTagClause: any, filter: { page: number, perPage: number }): Promise<Paged<TestItemResponse>> {
	const data = await Test.findAll({
		where: whereClause,
		include: [
			includeTagClause
		],
		attributes: {
			exclude: ["description"],
			include: [
				[
					Sequelize.literal(`(
					  SELECT COUNT(*)
					  FROM Attempts AS Attempt
					  WHERE Attempt.testId = Test.id
					)`),
					"answerCount"
				]
			]
		},
		offset: (filter.page - 1) * filter.perPage,
		limit: filter.perPage,
	});

	const total = await Test.count({
		where: whereClause,
		include: [
			{ ...includeTagClause, attributes: [] }
		],
		distinct: true
	});

	const castedData = data.map(record => ({
		id: record.id!,
		managerId: record.managerId!,
		title: record.title!,
		difficulty: record.difficulty!,
		description: record.description!,
		minutesToAnswer: record.minutesToAnswer!,
		tags: record.Tags!.map(t => t.name!),
		answerCount: record.get('answerCount')!,
		createdAt: record.createdAt!,
		updatedAt: record.updatedAt!
	}));
	return {
		data: castedData,
		total,
		page: filter.page,
		perPage: filter.perPage,
		totalPages: Math.ceil(total / filter.perPage)
	};
}