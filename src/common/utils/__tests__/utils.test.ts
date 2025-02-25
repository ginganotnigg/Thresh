import { removeNullFields } from '../object';
import { isSorted } from '../array';

describe.skip('removeNullFields', () => {
	it('should remove fields with null values', () => {
		const input = {
			a: 1,
			b: null,
			c: 'test',
			d: null,
			e: undefined,
		};
		const expectedOutput = {
			a: 1,
			c: 'test'
		};
		expect(removeNullFields(input)).toEqual(expectedOutput);
	});

	it('should return an empty object if all fields are null', () => {
		const input = {
			a: null,
			b: null,
		};
		const expectedOutput = {};
		expect(removeNullFields(input)).toEqual(expectedOutput);
	});

	it('should return the same object if no fields are null', () => {
		const input = {
			a: 1,
			b: 'test',
			c: true,
		};
		const expectedOutput = {
			a: 1,
			b: 'test',
			c: true,
		};
		expect(removeNullFields(input)).toEqual(expectedOutput);
	});

	it('should handle nested objects', () => {
		const input = {
			a: 1,
			b: null,
			c: {
				d: null,
				e: 'nested',
			},
		};
		const expectedOutput = {
			a: 1,
			c: {
				d: null,
				e: 'nested',
			},
		};
		expect(removeNullFields(input)).toEqual(expectedOutput);
	});

	it('should handle arrays', () => {
		const input = {
			a: [1, 2, null, 4],
			b: null,
		};
		const expectedOutput = {
			a: [1, 2, null, 4],
		};
		expect(removeNullFields(input)).toEqual(expectedOutput);
	});
});

describe.skip('isSorted', () => {
	it('should return true for an empty array', () => {
		expect(isSorted([], 'a')).toBe(true);
	});

	it('should return true for an array with one element', () => {
		expect(isSorted([{ a: 1 }], 'a')).toBe(true);
	});

	it('should return true for an array with two elements in descending order', () => {
		expect(isSorted([{ a: 2 }, { a: 1 }], 'a')).toBe(true);
	});

	it('should return false for an array with two elements in ascending order', () => {
		expect(isSorted([{ a: 1 }, { a: 2 }], 'a')).toBe(false);
	});

	it('should return true for an array with three elements in descending order', () => {
		expect(isSorted([{ a: 3 }, { a: 2 }, { a: 1 }], 'a')).toBe(true);
	});

	it('should return false for an array with three elements in ascending order', () => {
		expect(isSorted([{ a: 1 }, { a: 2 }, { a: 3 }], 'a')).toBe(false);
	});

	it('should return true for an array with three elements in descending order with duplicates', () => {
		expect(isSorted([{ a: 3 }, { a: 3 }, { a: 1 }], 'a')).toBe(true);
	});

	it('should return true for an array with three elements in descending order with nulls', () => {
		expect(() => isSorted([{ a: 3 }, { a: null }, { a: 1 }], 'a')).toThrow();
	});

	it('should return true for an array with three elements in ascending order', () => {
		expect(isSorted([{ a: 1 }, { a: 2 }, { a: 3 }], 'a', false)).toBe(true);
	});
});
