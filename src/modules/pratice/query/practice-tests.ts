import { sortBy } from "../../../controller/schemas/base";
import Test from "../../../domain/models/test";
import { Op } from "sequelize";
import { GetPracticeTestsQuery, GetPracticeTestsResponse } from "../schema";
import PracticeTest from "../../../domain/models/practice_test";
import Feedback from "../../../domain/models/feedback";

export async function queryPracticeTests(param: GetPracticeTestsQuery): Promise<GetPracticeTestsResponse> {
	const { authorId, page, perPage, searchTitle, sort } = param;
	const tests = await Test.findAndCountAll({
		where: {
			...(authorId && {
				authorId: authorId,
			}),
			...(searchTitle && searchTitle.length > 0 && {
				title: {
					[Op.like]: `%${searchTitle}%`,
				},
			}),
			mode: "practice",
		},
		include: [{
			model: PracticeTest,
			required: true,
			include: [{
				model: Feedback,
				required: false,
			}],
		}],
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
			...test.PracticeTest!.toJSON(),
			feedback: test.PracticeTest?.Feedback,
		})),
	}
}
