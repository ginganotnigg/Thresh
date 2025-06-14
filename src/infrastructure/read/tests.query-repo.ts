import { FindAndCountOptions, Op } from "sequelize";
import { TestsQuery } from "../../shared/query/filter/test.query-schema";
import Test from "../models/test";
import { sortBy } from "../../shared/controller/schemas/base";

export class TestsQueryRepo {
	static buildQuery(query: TestsQuery, mode: string = "practice"): FindAndCountOptions<Test> {
		const {
			page,
			perPage,
			searchTitle,
			sort,
		} = query;
		return {
			where: {
				...(searchTitle && searchTitle.length > 0 && {
					title: {
						[Op.like]: `%${searchTitle}%`,
					},
				}),
				mode: mode,
			},
			order: sort.map((s) => {
				const { field, order } = sortBy(s);
				return [field, order === 'asc' ? 'ASC' : 'DESC'];
			}),
			limit: perPage,
			offset: (page - 1) * perPage,
		}
	}

	async getAggregate() { }
}