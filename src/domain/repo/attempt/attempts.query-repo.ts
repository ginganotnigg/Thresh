import sequelize, { FindAndCountOptions } from "sequelize";
import { Paged, sortBy } from "../../../controller/schemas/base";
import Attempt from "../../models/attempt";
import { AttemptInfo } from "../../schema/info.schema";
import { AttemptsQueryParams } from "./test-attemps.query-repo";
import Test from "../../models/test";

export class AttemptsQueryRepo {
	constructor() { }

	async getAttemptsQuery({
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

	async getCurrentAttemptByTestAndCandidate(
		testId: string,
		candidateId: string,
	): Promise<Attempt | null> {
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				hasEnded: false,
			},
			include: [
				{
					model: Test,
					required: true,
				},
			],
		});
		return attempt;
	}

	buildAttemptsQuery(params: AttemptsQueryParams): FindAndCountOptions<Attempt> {
		const { candidateId, testId, sort, page, perPage, authorId } = params;
		return {
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
		}
	}
}