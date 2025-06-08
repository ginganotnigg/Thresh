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