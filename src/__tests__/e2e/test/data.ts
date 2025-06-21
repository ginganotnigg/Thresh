import { PostTestBody } from "../../../controllers/tests/uc_command/post-test/body";

export const postTestData: PostTestBody[] = [
	{
		title: "Practice Test 1",
		mode: "PRACTICE",
		description: "A simple practice test.",
		minutesToAnswer: 30,
		language: "English",
		detail: {
			mode: "PRACTICE",
			difficulty: "easy",
			tags: ["math", "logic"],
			numberOfQuestions: 4,
			numberOfOptions: 4,
			outlines: ["Addition", "Biology"],
		},
		questions: [
			{
				type: "MCQ",
				text: "What is 2 + 2?",
				points: 1,
				detail: {
					type: "MCQ",
					options: ["3", "4", "5", "6"],
					correctOption: 1,
				},
			},
			{
				type: "MCQ",
				text: "Which number is even?",
				points: 1,
				detail: {
					type: "MCQ",
					options: ["3", "5", "8", "7"],
					correctOption: 2,
				},
			},
			{
				type: "LONG_ANSWER",
				text: "Explain the process of photosynthesis.",
				points: 2,
				detail: {
					type: "LONG_ANSWER",
					correctAnswer: "Photosynthesis is the process by which green plants convert sunlight into energy.",
				},
			},
			{
				type: "LONG_ANSWER",
				text: "Describe the water cycle.",
				points: 2,
				detail: {
					type: "LONG_ANSWER",
					correctAnswer: "The water cycle involves evaporation, condensation, and precipitation.",
				},
			},
		],
	},
	{
		title: "Final Exam 2025",
		mode: "EXAM",
		description: "Comprehensive final exam.",
		minutesToAnswer: 90,
		language: "English",
		detail: {
			mode: "EXAM",
			roomId: "room-1",
			password: "secret123",
			numberOfAttemptsAllowed: 1,
			numberOfParticipants: 30,
			isAnswerVisible: false,
			isAllowedToSeeOtherResults: false,
			openDate: new Date("2025-06-01T09:00:00Z"),
			closeDate: new Date("2025-06-01T12:00:00Z"),
			isPublic: false,
		},
		questions: [
			{
				type: "MCQ",
				text: "What is the capital of France?",
				points: 1,
				detail: {
					type: "MCQ",
					options: ["Berlin", "London", "Paris", "Rome"],
					correctOption: 2,
				},
			},
			{
				type: "MCQ",
				text: "Which element has the chemical symbol 'O'?",
				points: 1,
				detail: {
					type: "MCQ",
					options: ["Oxygen", "Gold", "Silver", "Iron"],
					correctOption: 0,
				},
			},
			{
				type: "LONG_ANSWER",
				text: "Describe the theory of relativity.",
				points: 3,
				detail: {
					type: "LONG_ANSWER",
					correctAnswer: "The theory of relativity is a scientific theory developed by Einstein.",
				},
			},
			{
				type: "LONG_ANSWER",
				text: "Explain the process of mitosis.",
				points: 2,
				detail: {
					type: "LONG_ANSWER",
					correctAnswer: "Mitosis is the process of cell division resulting in two identical daughter cells.",
				},
			},
			{
				type: "MCQ",
				text: "Which planet is closest to the Sun?",
				points: 1,
				detail: {
					type: "MCQ",
					options: ["Venus", "Earth", "Mercury", "Mars"],
					correctOption: 2,
				},
			},
		],
	},
	{
		title: "Midterm Exam 2025",
		mode: "EXAM",
		description: "Midterm exam for the course.",
		minutesToAnswer: 60,
		language: "English",
		detail: {
			mode: "EXAM",
			roomId: "room-2",
			numberOfAttemptsAllowed: 1,
			numberOfParticipants: 25,
			isAnswerVisible: true,
			isAllowedToSeeOtherResults: true,
			openDate: new Date("2025-03-01T09:00:00Z"),
			closeDate: new Date("2025-03-01T11:00:00Z"),
			isPublic: true,
		},
		questions: [
			{
				type: "MCQ",
				text: "Which planet is known as the Red Planet?",
				points: 1,
				detail: {
					type: "MCQ",
					options: ["Earth", "Mars", "Jupiter", "Venus"],
					correctOption: 1,
				},
			},
			{
				type: "MCQ",
				text: "What is the boiling point of water at sea level (°C)?",
				points: 1,
				detail: {
					type: "MCQ",
					options: ["90", "100", "110", "120"],
					correctOption: 1,
				},
			},
			{
				type: "LONG_ANSWER",
				text: "Explain Newton's first law of motion.",
				points: 2,
				detail: {
					type: "LONG_ANSWER",
					correctAnswer: "An object at rest stays at rest unless acted upon by a force.",
				},
			},
			{
				type: "LONG_ANSWER",
				text: "Describe the process of evaporation.",
				points: 2,
				detail: {
					type: "LONG_ANSWER",
					correctAnswer: "Evaporation is the process where liquid turns into vapor.",
				},
			},
		],
	},
];