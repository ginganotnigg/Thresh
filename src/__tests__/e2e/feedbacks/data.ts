import { PostFeedbackBody } from "../../../controllers/feedback/resouce.schema";



export const postFeedbackData: PostFeedbackBody[] = [
	{
		testId: "test-001",
		rating: 8,
		problems: ["inaccurate", "poor content"],
		comment: "The test was challenging but fair.",
	},
	{
		testId: "test-002",
		rating: 5,
		problems: ["incomplete"],
		comment: "Some questions were incomplete.",
	},
	{
		testId: "test-003",
		rating: 10,
		problems: [],
		comment: "Excellent test, no issues found!",
	},
	{
		testId: "test-004",
		rating: 3,
		problems: ["un-related"],
		comment: "Some questions were not related to the topic.",
	},
];