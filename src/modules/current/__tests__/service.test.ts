import { setupAfterAll, setupBeforeAll } from "../../../__tests__/service-setup";
import { CurrentQueryService } from "../services/query.service";

const { loadAttemptsForSchedule } = CurrentQueryService;

describe("Current service", () => {
	describe("Runnable", () => {
		beforeAll(async () => {
			await setupBeforeAll();
		});

		afterAll(async () => {
			await setupAfterAll();
		});

		it(loadAttemptsForSchedule.name, async () => {
			const data = await loadAttemptsForSchedule();
			expect(data).not.toBeNull();
			expect(data).not.toBeUndefined();
		});
	});
});