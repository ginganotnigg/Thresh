import { PostTemplateBody } from "../../../controllers/templates/schema";

export const postTemplates: PostTemplateBody[] = [
	{
		name: "Algebra Basics",
		title: "Introduction to Algebra",
		description: "Covers basic algebraic concepts and operations.",
		language: "en",
		minutesToAnswer: 30,
		difficulty: "easy",
		tags: ["math", "algebra", "basics"],
		numberOfQuestions: 10,
		numberOfOptions: 4,
		outlines: ["Variables", "Expressions", "Equations"]
	},
	{
		name: "World History 101",
		title: "Foundations of World History",
		description: "A survey of major world history events.",
		language: "en",
		minutesToAnswer: 45,
		difficulty: "medium",
		tags: ["history", "world", "survey"],
		numberOfQuestions: 15,
		numberOfOptions: 5,
		outlines: ["Ancient Civilizations", "Middle Ages", "Modern Era"]
	},
	{
		name: "Basic Chemistry",
		title: "Chemistry Fundamentals",
		description: "Introduction to chemical principles and reactions.",
		language: "en",
		minutesToAnswer: 40,
		difficulty: "easy",
		tags: ["science", "chemistry", "fundamentals"],
		numberOfQuestions: 12,
		numberOfOptions: 4,
		outlines: ["Atoms", "Molecules", "Reactions"]
	},
	{
		name: "Programming in Python",
		title: "Python Programming Essentials",
		description: "Covers the basics of programming using Python.",
		language: "en",
		minutesToAnswer: 60,
		difficulty: "medium",
		tags: ["programming", "python", "coding"],
		numberOfQuestions: 20,
		numberOfOptions: 4,
		outlines: ["Syntax", "Data Types", "Control Flow"]
	},
	{
		name: "Advanced Calculus",
		title: "Calculus II",
		description: "Advanced topics in calculus including integrals and series.",
		language: "en",
		minutesToAnswer: 90,
		difficulty: "hard",
		tags: ["math", "calculus", "advanced"],
		numberOfQuestions: 25,
		numberOfOptions: 5,
		outlines: ["Integration", "Series", "Applications"]
	}
];