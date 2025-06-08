import { DomainError } from "../../../shared/controller/errors/domain.error";
import { Paged } from "../../../shared/controller/schemas/base";
import { CredentialsMeta } from "../../../shared/controller/schemas/meta";
import ExamTest from "../../../infrastructure/models/exam_test";
import Test from "../../../infrastructure/models/test";
import { Op } from "sequelize";
import { TestsQuery } from "../../../shared/query/filter/test.query-schema";
import { TestsQueryRepo } from "../../../infrastructure/read/tests.query-repo";
import ExamParticipants from "../../../infrastructure/models/exam_participants";
import { ExamTestInfo } from "../../../shared/resource/exam.schema";

export class ExamsRead {
	private constructor(
	) { }

	static load(): ExamsRead {
		return new ExamsRead();
	}

	async getSelf(query: TestsQuery, credentials: CredentialsMeta): Promise<Paged<ExamTestInfo>> {
		const queryOptions = TestsQueryRepo.buildQuery(query, "exam");
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

	async find(roomId: string, credentials: CredentialsMeta): Promise<ExamTestInfo & { hasJoined: boolean }> {
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
			}, {
				model: ExamParticipants,
				required: false,
				where: {
					candidateId: credentials.userId,
				},
			}]
		});
		if (examTest.length === 0) {
			throw new DomainError("No exam test found");
		}
		if (examTest.length > 1) {
			throw new Error("Multiple exam tests found");
		}
		const examTestParticipants = examTest[0].ExamParticipants!.find((p) => p.candidateId === credentials.userId);
		return {
			...examTest[0].get(),
			...examTest[0].Test!.get(),
			hasPassword: examTest[0].password != null,
			hasJoined: examTestParticipants != null,
		};
	}
}