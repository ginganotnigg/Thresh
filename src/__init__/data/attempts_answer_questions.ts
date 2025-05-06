import { v4 as uuidv4 } from 'uuid';

// Mock attempts_answer_questions data for seeding the database
// This connects each attempt with the questions they answered
// For each attempt, we'll create entries for how they answered the questions

const attemptsAnswerQuestions = [
	// Answers for Jane Smith's JavaScript Fundamentals test attempt
	// (c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f)
	{
		id: 1,
		attemptId: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
		questionId: 1, // Question "Which of the following is not a JavaScript data type?"
		chosenOption: 2, // Correctly identified Float as not a JS data type
		createdAt: new Date('2025-04-15T14:40:30Z'),
		updatedAt: new Date('2025-04-15T14:40:30Z')
	},
	{
		id: 2,
		attemptId: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
		questionId: 2, // Question "What will console.log(typeof []) output?"
		chosenOption: 0, // Incorrectly selected "array" (correct is "object")
		createdAt: new Date('2025-04-15T14:50:45Z'),
		updatedAt: new Date('2025-04-15T14:50:45Z')
	},
	{
		id: 3,
		attemptId: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
		questionId: 3, // Question "Which method is used to add an element to the end of an array?"
		chosenOption: 0, // Correctly selected push()
		createdAt: new Date('2025-04-15T15:01:00Z'),
		updatedAt: new Date('2025-04-15T15:01:00Z')
	},

	// Answers for Alex Johnson's in-progress JavaScript Fundamentals attempt
	// (d2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a)
	{
		id: 4,
		attemptId: 'd2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a',
		questionId: 1, // Question "Which of the following is not a JavaScript data type?"
		chosenOption: 3, // Incorrectly selected "Symbol" (correct is "Float")
		createdAt: new Date('2025-05-01T10:20:10Z'),
		updatedAt: new Date('2025-05-01T10:20:10Z')
	},
	{
		id: 5,
		attemptId: 'd2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a',
		questionId: 2, // Question "What will console.log(typeof []) output?"
		chosenOption: 1, // Correctly selected "object"
		createdAt: new Date('2025-05-01T10:28:00Z'),
		updatedAt: new Date('2025-05-01T10:28:00Z')
	},
	// Note: No answer for question 3 yet as the attempt is still in progress

	// Answers for Jane Smith's React Component Architecture test attempt
	// (e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b)
	{
		id: 6,
		attemptId: 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b',
		questionId: 4, // Question "Which hook is used to perform side effects in a function component?"
		chosenOption: 1, // Correctly selected "useEffect"
		createdAt: new Date('2025-05-05T09:15:20Z'),
		updatedAt: new Date('2025-05-05T09:15:20Z')
	},
	{
		id: 7,
		attemptId: 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b',
		questionId: 5, // Question "What is the correct way to conditionally render a component in React?"
		chosenOption: 1, // Correctly selected "condition && <Component />"
		createdAt: new Date('2025-05-05T09:30:45Z'),
		updatedAt: new Date('2025-05-05T09:30:45Z')
	},
	{
		id: 8,
		attemptId: 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b',
		questionId: 6, // Question "Which of the following is NOT a way to optimize React performance?"
		chosenOption: 2, // Incorrectly selected "Using keys in lists" (correct is "Using inline functions in render methods")
		createdAt: new Date('2025-05-05T09:56:30Z'),
		updatedAt: new Date('2025-05-05T09:56:30Z')
	}
];

export default attemptsAnswerQuestions;