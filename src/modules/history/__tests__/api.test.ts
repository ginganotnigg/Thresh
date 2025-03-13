import { Application } from "express";
import { setupAfterAll, setupBeforeAll } from "../../../__tests__/api-setup";
import { HistoryModule } from "../history.module";
import request from "supertest";
import { getTestAttempts } from "./data/getTestAttempts";
import { validateResponse } from "../../../library/caymejs/test/validate-api-test";

describe(HistoryModule.name, () => {
	let app: Application;

	beforeAll(async () => {
		app = await setupBeforeAll();
	});

	afterAll(async () => {
		await setupAfterAll();
	});

	it.each(getTestAttempts)('GET /api/tests/:id/attempts', async (data) => {
		const response = await request(app)
			.get(`/api/tests/${data.input.testId}/attempts`)
			.query(data.input.query)
			.expect(200);
		validateResponse(response, data);
	});
});