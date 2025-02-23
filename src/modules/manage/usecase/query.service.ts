import { Paged } from "../../../common/controller/base/param";
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
				'$tags.id$': filter.tags ? { [Op.in]: filter.tags } : undefined
			},
			include: [{
				association: Test.associations.tags,
				attributes: ['id', 'name']
			}],
			attributes: { exclude: ["description"] },
			offset: (filter.page - 1) * filter.perPage,
			limit: filter.perPage,
		});
		const total = result.count;
		const data = result.rows.map(t => ({
			id: t.id!,
			companyId: t.companyId!,
			title: t.title!,
			difficulty: t.difficulty!,
			description: t.description!,
			minutesToAnswer: t.minutesToAnswer!,
			tags: t.tags!.map(t => t.name!),
			answerCount: t.answerCount!,
			createdAt: t.createdAt!,
			updatedAt: t.updatedAt!
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