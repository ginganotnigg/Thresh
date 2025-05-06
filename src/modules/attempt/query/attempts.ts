import sequelize from "../../../configs/orm/sequelize";
import { Paged, sortBy } from "../../../controller/schemas/base";
import Attempt from "../../../domain/models/attempt";
import Test from "../../../domain/models/test";
import User from "../../../domain/models/user";
import { AttemptInfo } from "../../../domain/schema/info.schema";
import { TestAttemptsQuery } from "../schema";

export async function queryTestAttempts(param: TestAttemptsQuery): Promise<Paged<AttemptInfo>> {
	const { authorId, testId, sort, page, perPage } = param;

	const { rows: attempts, count } = await Attempt.findAndCountAll({
		where: {
			...(authorId ? { authorId } : {}),
			...(testId ? { testId } : {}),
		},
		include: [
			{
				model: Test,
				include: [User],
			},
			{
				model: User,
			}
		],
		limit: perPage,
		offset: (page - 1) * perPage,
		order: sort.map((item) => {
			const { field, order } = sortBy(item);
			return [sequelize.col(field), order === 'asc' ? 'ASC' : 'DESC'];
		}),
	});

	return {
		page: page,
		perPage: perPage,
		total: count,
		totalPages: Math.ceil(count / perPage),
		data: attempts.map((attempt) => ({
			...attempt.toJSON(),
			test: {
				...attempt.Test!.toJSON(),
				author: attempt.Test!.Author!.toJSON(),
			},
			candidate: attempt.Candidate!.toJSON(),
		})),
	}

}