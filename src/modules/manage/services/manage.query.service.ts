import { Paged } from "../../../controller/schemas/base";
import Question from "../../../domain/models/question";
import Tag from "../../../domain/models/tag";
import Test from "../../../domain/models/test";
import { RandomService } from "../../../services/random.service";
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
			tags: row.Tags!.map(t => ({
				id: t.id!,
				name: t.name!,
			})),
			answerCount: row.get('answerCount')!,
			createdAt: row.createdAt!,
			updatedAt: row.updatedAt!
		};
	}

	static async getChallengeOfTheDay(): Promise<TestResponse | null> {
		const randomId = RandomService.getTodayRandomTestId();
		if (!randomId) {
			throw new Error("Out of random test id");
		}
		const test = await this.getTest(randomId);
		if (!test) {
			throw new Error("No test available for today");
		}
		return test;
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
		const res = await findAllWithFilter(companyWhereClause, includeTagsClause, filter);
		return res;
	}
}

function getFilterCondition(filter: TestFilterQuery): {
	whereClause: any;
	includeTagsClause: any;
} {
	const difficultyArray = filter.difficulty != null && typeof filter.difficulty === "string" ? [filter.difficulty] : filter.difficulty;
	const whereClase = {
		// Search by title
		...(filter.searchTitle && {
			title: {
				[Op.like]: `%${filter.searchTitle}%`
			}
		}),
		// Filter by manager ids
		...(filter.managerIds != null && filter.managerIds.length > 0 && {
			managerId: {
				[Op.in]: filter.managerIds
			}
		}),
		// TODO: check conditions, min max is wrong (it is or, not and)
		// Filter by minutes to answer
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
		// Filter by difficulty
		...(filter.difficulty != null && filter.difficulty.length > 0 && {
			difficulty: {
				[Op.in]: difficultyArray
			}
		}),
	};
	// Filter by tags
	const includeTagsClause = {
		model: Tag,
		where: filter.tags != null && filter.tags.length >= 0 ? {
			id: { [Op.in]: filter.tags! }
		} : undefined,
		through: { attributes: [] },
		attributes: ["id", "name", "createdAt", "updatedAt"],
		required: false,
	};
	const res = {
		whereClause: whereClase,
		includeTagsClause,
	};
	return res;
}

async function findAllWithFilter(whereClause: any, includeTagClause: any, filter: TestFilterQuery): Promise<Paged<TestItemResponse>> {
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
		order: filter.sortBy?.map(({ field, order }) => [field, order] as Sequelize.OrderItem),
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
		tags: record.Tags!.map(t => ({
			id: t.id!,
			name: t.name!,
		})),
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