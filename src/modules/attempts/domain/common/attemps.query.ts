import sequelize from "sequelize";
import { Paged, sortBy } from "../../../../controller/schemas/base";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { db } from "../../../../configs/orm/kysely/db";

export type AttemptsQueryParams = {
	sort: string[];
	page: number;
	perPage: number;
	candidateId?: string | undefined;
	testId?: string | undefined;
	authorId?: string | undefined;
};

export type AttemptsAggregateParams = {
	candidateId?: string | undefined;
	totalAttempts?: boolean | undefined;
	averageScore?: boolean | undefined;
	averageSecondsSpent?: boolean | undefined;
	highestScore?: boolean | undefined;
	lowestScore?: boolean | undefined;
};

export class AttemptQuery {
	static async getAttemptsQuery({
		candidateId,
		testId,
		sort,
		page,
		perPage,
		authorId,
	}: AttemptsQueryParams): Promise<Paged<AttemptInfo>> {
		const { rows: attempts, count } = await Attempt.findAndCountAll({
			where: {
				...(candidateId ? { candidateId: candidateId } : {}),
				...(testId ? { testId: testId } : {}),
			},
			include: [
				{
					model: Test,
					where: {
						...(authorId ? { authorId: authorId } : {}),
					},
					required: true,
				},
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
			})),
		}
	}

	static async getAttemptsAggregate(params: AttemptsAggregateParams): Promise<any> {
	}
}