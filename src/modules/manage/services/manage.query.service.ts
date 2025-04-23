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
		return await fetchFilteredTests(filter);
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
		if (randomId === null) {
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
		const filterWithManager = { ...filter, managerIds: [managerId] };
		return await fetchFilteredTests(filterWithManager);
	}
}

/**
 * Fetches and filters tests based on the provided filter criteria
 */
async function fetchFilteredTests(filter: TestFilterQuery): Promise<Paged<TestItemResponse>> {
	const testByTagIds = await Test.findAll({
		attributes: ["id"],
		include: [
			{
				model: Tag,
				where: {
					...(filter.tags && filter.tags.length > 0 && {
						id: {
							[Op.in]: filter.tags
						}
					})
				},
				through: { attributes: [] },
				required: true,
				attributes: []
			}
		],
	}).then(tests => tests.map(test => test.id!));

	// Fetch data with filters
	const data = await Test.findAndCountAll({
		where: {
			id: {
				...(filter.tags && filter.tags.length > 0 && {
					[Op.in]: testByTagIds
				})
			},
			...(filter.searchTitle && {
				title: {
					[Op.like]: `%${filter.searchTitle}%`
				}
			}),
			...(filter.difficulty && {
				difficulty: {
					[Op.in]: typeof filter.difficulty === "string"
						? [filter.difficulty]
						: filter.difficulty,
				}
			}),
			// If there's only minMinute
			...(filter.minMinutesToAnswer !== undefined && filter.maxMinutesToAnswer === undefined && {
				minutesToAnswer: {
					[Op.gte]: filter.minMinutesToAnswer
				}
			}),
			// If there's only maxMinute
			...(filter.maxMinutesToAnswer !== undefined && filter.minMinutesToAnswer === undefined && {
				minutesToAnswer: {
					[Op.lte]: filter.maxMinutesToAnswer
				}
			}),
			// If there's both minMinute and maxMinute
			...(filter.maxMinutesToAnswer !== undefined && filter.minMinutesToAnswer !== undefined && {
				minutesToAnswer: {
					[Op.gte]: filter.minMinutesToAnswer,
					[Op.lte]: filter.maxMinutesToAnswer,
				}
			}),
			...(filter.managerIds != null && filter.managerIds.length > 0 && {
				managerId: {
					[Op.in]: filter.managerIds
				}
			}),
		},
		include: [
			{
				model: Tag,
				through: { attributes: [] },
				required: false,
				attributes: ["id", "name", "createdAt", "updatedAt"]
			}
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

	const castedData = data.rows.map(record => ({
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
		total: data.count,
		page: filter.page,
		perPage: filter.perPage,
		totalPages: Math.ceil(data.count / filter.perPage)
	};
}