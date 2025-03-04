import { QueryService } from "../../services/query.service";
import sequelize from "../../../../configs/sequelize/database";
import syncSequelize from "../../../../configs/sequelize/init";
import filterData from "./data/filter";
import detailData from "./data/detail";
import questionData from "./data/questions";
import managerData from "./data/manager";

// Todo: Update test data (its v2)

describe('QueryService', () => {
	let queryService: QueryService;

	beforeAll(async () => {
		await syncSequelize(true);
		queryService = new QueryService();
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it.each(filterData)(QueryService.prototype.getTests.name, async (data) => {
		const result = await queryService.getTests(data.input);

		// All record should not be undefined
		expect(result).toBeDefined();
		expect(result.data).toBeDefined();
		expect(result.total).toBeDefined();
		expect(result.page).toBeDefined();
		expect(result.perPage).toBeDefined();
		expect(result.totalPages).toBeDefined();

		// Checks number of records
		expect(result.total).toEqual(data.expected.length);
	});

	it.each(detailData)(QueryService.prototype.getTest.name, async (data) => {
		const result = await queryService.getTest(data.input);

		if (data.expected == null) {
			expect(result).toBeNull();
		} else {
			expect(result).not.toBeNull();
			expect(result!.id).toEqual(data.expected!.id);
			expect(result!.managerId).toEqual(data.expected!.managerId);
			expect(result!.title).toEqual(data.expected!.title);
			expect(result!.answerCount).toEqual(data.expected!.answerCount);
			for (const tag of data.expected.tags!) {
				expect(result!.tags).toContain(tag);
			}
		}
	});

	it.each(questionData)(QueryService.prototype.getQuestions.name, async (data) => {
		const result = await queryService.getQuestions(data.input);
		expect(result).toBeDefined();
		expect(result.length).toEqual(data.expected.length);
	});

	it.each(managerData)(QueryService.prototype.getManagerTests.name, async (data) => {
		const result = await queryService.getManagerTests(data.input.managerId, { ...data.input });
		expect(result).toBeDefined();
		expect(result.total).toEqual(data.expected.length);
	});
});