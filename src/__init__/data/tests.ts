// Mock test data for seeding the database
const tests = [
	{
		id: 'e57f29b5-3b6d-4d4e-82c9-f155a7e02a6c', // Fixed UUID instead of dynamically generated
		authorId: '7f28c5f9-d711-4cd6-ac15-d13d71abff80', // John Doe
		title: 'JavaScript Fundamentals',
		description: 'A comprehensive test covering JavaScript basics including variables, functions, and objects.',
		minutesToAnswer: 45,
		language: 'english',
		mode: 'practice',
		createdAt: new Date('2025-04-10T13:25:00Z'),
		updatedAt: new Date('2025-04-10T13:25:00Z')
	},
	{
		id: 'b82c91d3-ae2f-4e0f-a105-3ba124fb9a42', // Fixed UUID instead of dynamically generated
		authorId: '3f9e8d7c-6b5a-4d3c-2e1f-0a9b8c7d6e5f', // Alex Johnson
		title: 'React Component Architecture',
		description: 'Test your knowledge of React components, hooks, and state management.',
		minutesToAnswer: 60,
		language: 'english',
		mode: 'exam',
		createdAt: new Date('2025-05-01T09:15:00Z'),
		updatedAt: new Date('2025-05-01T09:15:00Z')
	}
];

export default tests;