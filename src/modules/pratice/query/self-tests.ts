import { sortBy } from "../../../controller/schemas/base";
import Test from "../../../domain/models/test";
import { Op } from "sequelize";
import User from "../../../domain/models/user";
import { GetSelfTestsQuery, GetSelfTestsResponse } from "../schema/query.schema";

export async function querySelfTests(param: GetSelfTestsQuery): Promise<GetSelfTestsResponse> {
	const { authorId, page, perPage, searchTitle, sort } = param;
	const tests = await Test.findAndCountAll({
		where: {
			authorId: authorId,
			...(searchTitle && searchTitle.length > 0 && {
				title: {
					[Op.like]: `%${searchTitle}%`,
				},
			}),
		},
		include: [
			{
				model: User,
			}
		],
		order: sort.map((s) => {
			const { field, order } = sortBy(s);
			return [field, order === 'asc' ? 'ASC' : 'DESC'];
		}),
		limit: perPage,
		offset: (page - 1) * perPage,
	});
	return {
		page,
		perPage,
		total: tests.count,
		totalPages: Math.ceil(tests.count / perPage),
		data: tests.rows.map((test) => ({
			...test.toJSON(),
			author: {
				id: test.Author!.id,
				name: test.Author!.name,
				avatar: test.Author?.avatar ?? undefined,
			},
		})),
	}
}
