import { TestDifficulty } from "../../../../common/domain/enum";
import { TestFilterParam } from "../../types/param";
import { QueryService } from "../../usecase/query.service";
import sequelize from "../../../../configs/sequelize/database";
import syncSequelize from "../../../../configs/sequelize/init";

describe('QueryService', () => {
	let queryService: QueryService;

	beforeEach(async () => {
		await syncSequelize("force");
		queryService = new QueryService();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it('getTests should return paged results', async () => {
		const filter: TestFilterParam = {
			searchTitle: 'Test',
			minMinutesToAnswer: 10,
			maxMinutesToAnswer: 60,
			difficulty: [TestDifficulty.EASY],
			tags: [1],
			page: 1,
			perPage: 10
		};

		const result = await queryService.getTests(filter);

		expect(result).toBeDefined();
		expect(result.data).toBeDefined();
		expect(result.total).toBeDefined();
		expect(result.page).toBeDefined();
		expect(result.perPage).toBeDefined();
		expect(result.totalPages).toBeDefined();
	});
});