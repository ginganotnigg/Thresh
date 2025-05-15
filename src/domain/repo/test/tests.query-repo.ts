import { FindAndCountOptions, Op } from "sequelize";
import { TestsQuery } from "../../schema/query.schema";
import Test from "../../models/test";
import { sortBy } from "../../../controller/schemas/base";

export class TestsQueryRepo {
	static buildQuery(query: TestsQuery): FindAndCountOptions<Test> {
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
				mode: "practice",
			},
			order: sort.map((s) => {
				const { field, order } = sortBy(s);
				return [field, order === 'asc' ? 'ASC' : 'DESC'];
			}),
			limit: perPage,
			offset: (page - 1) * perPage,
		}
	}
}