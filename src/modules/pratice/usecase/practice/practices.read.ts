import { DomainError } from "../../../../shared/controller/errors/domain.error";
import { Paged } from "../../../../shared/controller/schemas/base";
import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import PracticeTest from "../../../../infrastructure/models/practice_test";
import Test from "../../../../infrastructure/models/test";
import { TestsQueryRepo } from "../../../../infrastructure/read/tests.query-repo";
import { PracticeTestInfo } from "../../../../shared/resource/practice.schema";
import { TestsQuery } from "../../../../shared/query/filter/test.query-schema";

export class PracticesRead {
	private constructor(
		private readonly credentials: CredentialsMeta,
	) { }

	static load(credentials: CredentialsMeta): PracticesRead {
		return new PracticesRead(credentials);
	}

	async getSelf(query: TestsQuery): Promise<Paged<PracticeTestInfo>> {
		const queryOptions = TestsQueryRepo.buildQuery(query);
		queryOptions.where = {
			...queryOptions.where,
			authorId: this.credentials.userId,
		}
		queryOptions.include = [{
			model: PracticeTest,
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
				...test.PracticeTest!.get(),
			})),
		}
	}

	async get(testId: string): Promise<PracticeTestInfo> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: PracticeTest,
				required: true,
			}]
		});
		if (!test) {
			throw new DomainError("Practice test not found");
		}
		return {
			...test.get(),
			...test.PracticeTest!.get(),
		}
	}
}