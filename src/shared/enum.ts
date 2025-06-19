export const FeedbackProblemsAsConst = [
	"inaccurate",
	"un-related",
	"poor content",
	"incomplete",
	"repeated",
	"error",
	"other",
	""
] as const;
export type FeedbackProblemsType = typeof FeedbackProblemsAsConst[number];

export const TestModeAsConst = [
	"EXAM",
	"PRACTICE",
] as const;
export type TestModeType = typeof TestModeAsConst[number];

export const QuestionTypesAsConst = [
	"MCQ",
	"LONG_ANSWER",
] as const;
export type QuestionTypeType = typeof QuestionTypesAsConst[number];

export const AttemptStatusAsConst = [
	"IN_PROGRESS",
	"COMPLETED",
	"GRADED",
] as const;
export type AttemptStatusType = typeof AttemptStatusAsConst[number];