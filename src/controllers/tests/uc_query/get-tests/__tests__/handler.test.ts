import { GetTestsQueryHandler } from '../handler';
import * as testData from './data';

describe('GetTestsQueryHandler (data-driven)', () => {
	const handler = new GetTestsQueryHandler();

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
