import { setupAfterAll, setupBeforeAll } from '../../../../../__tests__/integration/setup';
import { GetTestsQueryHandler } from '../handler';
import * as testData from './input-data';

describe('GetTestsQueryHandler (data-driven)', () => {
	const handler = new GetTestsQueryHandler();

	beforeAll(async () => {
		await setupBeforeAll();
	});

	afterAll(async () => {
		await setupAfterAll();
	});

	(testData.cases || []).forEach((testCase, idx) => {
		it(testCase.name || `case #${idx + 1}`, async () => {
			// Arrange
			const param = testCase.input;
			const expected = testCase.expected;

			// Act
			const result = await handler.handle(param);

			// Assert
			expect(result).toEqual(expected);
		});
	});
});
