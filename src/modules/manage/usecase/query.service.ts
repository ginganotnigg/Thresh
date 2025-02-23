import { Paged } from "../../../common/controller/base/param";
import Tag from "../../../models/tag";
import Test from "../../../models/test";
import { TestFilterParam } from "../types/param";
import { TestItemResult } from "../types/result";
import { Op } from "sequelize";

export class QueryService {
	constructor() { }

	async getTests(filter: TestFilterParam): Promise<Paged<TestItemResult>> {
		const result = await Test.findAndCountAll({
			where: {
				title: filter.searchTitle ? { [Op.like]: `%${filter.searchTitle}%` } : undefined,
				minutesToAnswer: {
					[Op.gte]: filter.minMinutesToAnswer ?? undefined,
					[Op.lte]: filter.maxMinutesToAnswer ?? undefined
				},
				difficulty: filter.difficulty ? { [Op.in]: filter.difficulty } : undefined,
			},
			include: [
				{
					model: Tag,
					where: {
						id: filter.tags ? { [Op.in]: filter.tags } : undefined
					}
				},
			],
			attributes: { exclude: ["description"] },
			offset: (filter.page - 1) * filter.perPage,
			limit: filter.perPage,
		});
		const total = result.count;
		const data = result.rows.map(row => ({
			id: row.id!,
			companyId: row.companyId!,
			title: row.title!,
			difficulty: row.difficulty!,
			description: row.description!,
			minutesToAnswer: row.minutesToAnswer!,
			tags: row.Tags!.map(t => t.name!),
			answerCount: 0,
			createdAt: row.createdAt!,
			updatedAt: row.updatedAt!
		}));
		return {
			data,
			total,
			page: filter.page,
			perPage: filter.perPage,
			totalPages: Math.ceil(total / filter.perPage)
		};
	}
}