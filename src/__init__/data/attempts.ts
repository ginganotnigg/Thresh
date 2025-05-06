import { v4 as uuidv4 } from 'uuid';

// Mock attempts data for seeding the database
// These attempts are for the tests we created:
// 1. JavaScript Fundamentals (e57f29b5-3b6d-4d4e-82c9-f155a7e02a6c) - 2 attempts
// 2. React Component Architecture (b82c91d3-ae2f-4e0f-a105-3ba124fb9a42) - 1 attempt

const attempts = [
	// First attempt for JavaScript Fundamentals test (completed)
	{
		id: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
		order: 1,
		testId: 'e57f29b5-3b6d-4d4e-82c9-f155a7e02a6c', // JavaScript Fundamentals test
		candidateId: 'a2e8d7b6-c5f4-4e3d-b2a1-9f8e7d6c5b4a', // Jane Smith
		hasEnded: true,
		secondsSpent: 1875, // 31.25 minutes
		createdAt: new Date('2025-04-15T14:30:00Z'),
		updatedAt: new Date('2025-04-15T15:01:15Z')
	},

	// Second attempt for JavaScript Fundamentals test (in progress)
	{
		id: 'd2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a',
		order: 2,
		testId: 'e57f29b5-3b6d-4d4e-82c9-f155a7e02a6c', // JavaScript Fundamentals test
		candidateId: '3f9e8d7c-6b5a-4d3c-2e1f-0a9b8c7d6e5f', // Alex Johnson
		hasEnded: false,
		secondsSpent: 780, // 13 minutes so far
		createdAt: new Date('2025-05-01T10:15:00Z'),
		updatedAt: new Date('2025-05-01T10:28:00Z')
	},

	// First attempt for React Component Architecture test (completed)
	{
		id: 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b',
		order: 1,
		testId: 'b82c91d3-ae2f-4e0f-a105-3ba124fb9a42', // React Component Architecture test
		candidateId: 'a2e8d7b6-c5f4-4e3d-b2a1-9f8e7d6c5b4a', // Jane Smith
		hasEnded: true,
		secondsSpent: 3420, // 57 minutes
		createdAt: new Date('2025-05-05T09:00:00Z'),
		updatedAt: new Date('2025-05-05T09:57:00Z')
	}
];

export default attempts;