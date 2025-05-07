import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { Paged, sortBy } from "../../../../controller/schemas/base";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { AttemptsQuery } from "../../schema/controller-schema";

export async function queryAttempts(param: AttemptsQuery): Promise<Paged<AttemptInfo>> {
	const { candidateId, testId, sort, page, perPage } = param;

	const { rows: attempts, count } = await Attempt.findAndCountAll({
		where: {
			...(candidateId ? { candidateId: candidateId } : {}),
			...(testId ? { testId: testId } : {}),
		},
		include: [
			{
				model: Test,
				include: ["Author"],
			},
			"Candidate",
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