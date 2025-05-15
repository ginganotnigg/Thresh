import { DomainError } from "../../../controller/errors/domain.error";
import { Paged } from "../../../controller/schemas/base";
import { CredentialsMeta } from "../../../controller/schemas/meta";
import ExamTest from "../../../domain/models/exam_test";
import Test from "../../../domain/models/test";
import { ExamTestInfo } from "../../../domain/schema/info.schema";
import { Op } from "sequelize";
import { TestsQuery } from "../../../domain/schema/query.schema";
import { TestsQueryRepo } from "../../../domain/repo/test/tests.query-repo";

export class ExamsRead {
	private constructor(
	) { }

	static load(): ExamsRead {
		return new ExamsRead();
	}

	async getSelf(query: TestsQuery, credentials: CredentialsMeta): Promise<Paged<ExamTestInfo>> {
		const queryOptions = TestsQueryRepo.buildQuery(query);
		queryOptions.where = {
			...queryOptions.where,
			authorId: credentials.userId,
		}
		queryOptions.include = [{
			model: ExamTest,
			required: true,
		}];
		const tests = await Test.findAndCountAll(queryOptions);
		return {
			page: query.page,
			perPage: query.perPage,
			total: tests.count,
			totalPages: Math.ceil(tests.count / query.perPage),
			data: tests.rows.map((test) => ({
				...test.get(),
				...test.ExamTest!.get(),
				hasPassword: test.ExamTest!.password !== null,
			})),
		}
	}

	async get(testId: string): Promise<ExamTestInfo> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: ExamTest,
				required: true,
			}]
		});
		if (!test) {
			throw new DomainError("Test not found");
		}
		return {
			...test.get(),
			...test.ExamTest!.get(),
			hasPassword: test.ExamTest!.password !== null,
		}
	}

	async find(roomId: string): Promise<ExamTestInfo> {
		const now = new Date();
		const examTest = await ExamTest.findAll({
			where: {
				roomId,
				openDate: {
					[Op.lte]: now,
				},
				closeDate: {
					[Op.gte]: now,
				},
			},
			include: [{
				model: Test,
				required: true,
			}]
		});
		if (examTest.length === 0) {
			throw new DomainError("No exam test found");
		}
		if (examTest.length > 1) {
			throw new Error("Multiple exam tests found");
		}
		return {
			...examTest[0].get(),
			...examTest[0].Test!.get(),
			hasPassword: examTest[0].password !== null,
		};
	}
}