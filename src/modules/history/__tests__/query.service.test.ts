import { isSorted } from "../../../common/utils/array";
import sequelize from "../../../configs/sequelize/database";
import syncSequelize from "../../../configs/sequelize/init";
import { AttemptFilterParam } from "../schemas/param";
import { QueryService } from "../services/query.service";

// General test
describe(QueryService.name + '|| General', () => {
	let queryService: QueryService;

	beforeAll(async () => {
		await syncSequelize(true);
		queryService = new QueryService();
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it.skip(QueryService.prototype.getTestAttempts.name, async () => {
		const filter1: AttemptFilterParam = {
			page: 1,
			perPage: 3,
			sortByScore: "desc",
		};
		const testId = 1;
		const attempts1 = await queryService.getTestAttempts(testId, filter1);
		const filter2: AttemptFilterParam = {
			page: 2,
			perPage: 3,
			sortByScore: "desc",
		};
		const attempts2 = await queryService.getTestAttempts(testId, filter2);
		expect(isSorted(attempts1.data, "score", true)).toBeTruthy();
		expect(isSorted(attempts2.data, "score", true)).toBeTruthy();
		expect(attempts1.data[attempts1.data.length - 1].score).toBeGreaterThanOrEqual(attempts2.data[0].score);
	});

	it.skip(QueryService.prototype.getAttemptDetail.name, async () => {
		const attempt = await queryService.getAttemptDetail(1);
		expect(attempt).toBeDefined();
		expect(attempt!.score).toBeGreaterThanOrEqual(0);
		expect(attempt!.totalQuestions).toBeGreaterThanOrEqual(0);
		expect(attempt!.totalCorrectAnswers).toBeGreaterThanOrEqual(0);
		expect(attempt!.totalWrongAnswers).toBeGreaterThanOrEqual(0);
		expect(attempt!.timeSpent).toBeGreaterThanOrEqual(0);
	});
});

// Data test