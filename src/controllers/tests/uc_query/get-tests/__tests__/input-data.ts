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
