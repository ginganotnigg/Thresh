import { GetTestsQuery } from '../param';
import { GetTestsResponse } from '../response';

// Data-driven test cases for GetTestsQueryHandler
// Fill in the array below with your test cases
// Each case should have: { name: string, input: GetTestsQuery, expected: GetTestsResponse }

export const cases: Array<{
	name: string;
	input: GetTestsQuery;
	expected: GetTestsResponse;
}> = [
		{
			name: 'basic paging only',
			input: { page: 1, perPage: 10 },
			expected: { data: [], page: 1, perPage: 10, total: 0, totalPages: 0 },
		},
		{
			name: 'with authorId',
			input: { page: 1, perPage: 5, authorId: 'author-123' },
			expected: { data: [], page: 1, perPage: 5, total: 0, totalPages: 0 },
		},
		{
			name: 'with candidateId',
			input: { page: 2, perPage: 10, candidateId: 'cand-456' },
			expected: { data: [], page: 2, perPage: 10, total: 0, totalPages: 0 },
		},
		{
			name: 'with mode',
			input: { page: 1, perPage: 10, mode: 'EXAM' },
			expected: { data: [], page: 1, perPage: 10, total: 0, totalPages: 0 },
		},
		{
			name: 'with searchTitle',
			input: { page: 1, perPage: 10, searchTitle: 'math' },
			expected: { data: [], page: 1, perPage: 10, total: 0, totalPages: 0 },
		},
		{
			name: 'with sortCreatedAt asc',
			input: { page: 1, perPage: 10, sortCreatedAt: 'asc' },
			expected: { data: [], page: 1, perPage: 10, total: 0, totalPages: 0 },
		},
		{
			name: 'with sortCreatedAt desc',
			input: { page: 1, perPage: 10, sortCreatedAt: 'desc' },
			expected: { data: [], page: 1, perPage: 10, total: 0, totalPages: 0 },
		},
		{
			name: 'with sortTitle asc',
			input: { page: 1, perPage: 10, sortTitle: 'asc' },
			expected: { data: [], page: 1, perPage: 10, total: 0, totalPages: 0 },
		},
		{
			name: 'with all fields',
			input: {
				page: 3,
				perPage: 20,
				authorId: 'author-789',
				candidateId: 'cand-101',
				mode: 'PRACTICE',
				searchTitle: 'science',
				sortCreatedAt: 'desc',
				sortTitle: 'asc',
			},
			expected: { data: [], page: 3, perPage: 20, total: 0, totalPages: 0 },
		},
	];
