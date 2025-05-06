import { setupAfterAll, setupBeforeAll } from "../../../../__tests__/setup";
import { queryAttemptAggregate } from "../attempt-aggregate";

describe('Attempt Query', () => {
	beforeAll(async () => {
		await setupBeforeAll();
	});

	afterAll(async () => {
		await setupAfterAll();
	});

	it(queryAttemptAggregate.name, async () => {
		const res = await queryAttemptAggregate("c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f", {
			score: true,
			answered: true,
			answeredCorrect: true,
		});
		console.log(res);
	});
});