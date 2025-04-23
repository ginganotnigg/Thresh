import getTestsData from "../data/getTests";
import { Application } from "express";
import { validateResult } from "../../../../library/caymejs/test/validate-api-test";
import { ManageModule } from "../../manage.module";
import request from "supertest";
import { setupAfterAll, setupBeforeAll } from "../../../../__tests__/api-setup";

describe(ManageModule.name, () => {
	let app: Application;

	beforeAll(async () => {
		app = await setupBeforeAll();
	});

	afterAll(async () => {
		await setupAfterAll();
	});

	it.each(getTestsData)("GET /tests", async (data) => {
		const response = await request(app)
			.get('/tests')
			.query(data.input)
			.expect(200);
		validateResult(response, data);
	});

	// it.each(detailData)(QueryService.prototype.getTest.name, async (data) => {
	// 	const result = await queryService.getTest(data.input);

	// 	if (data.expected == null) {
	// 		expect(result).toBeNull();
	// 	} else {
	// 		expect(result).not.toBeNull();
	// 		expect(result!.id).toEqual(data.expected!.id);
	// 		expect(result!.managerId).toEqual(data.expected!.managerId);
	// 		expect(result!.title).toEqual(data.expected!.title);
	// 		expect(result!.answerCount).toEqual(data.expected!.answerCount);
	// 		for (const tag of data.expected.tags!) {
	// 			expect(result!.tags).toContain(tag);
	// 		}
	// 	}
	// });

	// it.each(questionData)(QueryService.prototype.getQuestions.name, async (data) => {
	// 	const result = await queryService.getQuestions(data.input);
	// 	expect(result).toBeDefined();
	// 	expect(result.length).toEqual(data.expected.length);
	// });

	// it.each(managerData)(QueryService.prototype.getManagerTests.name, async (data) => {
	// 	const result = await queryService.getManagerTests(data.input.managerId, { ...data.input });
	// 	expect(result).toBeDefined();
	// 	expect(result.total).toEqual(data.expected.length);
	// });
});


