import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { QuestionCoreSchema } from "./question.schema";

export const TestCoreSchema = ChuoiDocument.registerSchema(
	z.object({
		id: z.string(),
		authorId: z.string(),
		title: z.string(),
		description: z.string(),
		minutesToAnswer: z.number().min(1).max(10000),
		language: z.string(),
		mode: z.string(),
	}),
	"TestCoreSchema"
);
export type TestCore = z.infer<typeof TestCoreSchema>;

export const TestInfoSchema = ChuoiDocument.registerSchema(
	TestCoreSchema
		.extend({
			createdAt: z.date(),
			updatedAt: z.date(),
		}),
	"TestInfoSchema"
);
export type TestInfo = z.infer<typeof TestInfoSchema>;

export const TestAggregateSchema = ChuoiDocument.registerSchema(
	z.object({
		numberOfQuestions: z.number(),
		totalPoints: z.number(),
	}),
	"TestAggregateSchema"
);
export type TestAggregate = z.infer<typeof TestAggregateSchema>;

export const TestQuestionsAggregateSchema = ChuoiDocument.registerSchema(
	z.object({
		questionId: z.number(),
		numberOfAnswers: z.number(),
		numberOfCorrectAnswers: z.number(),
		averagePoints: z.number(),
	}),
	"TestQuestionsAggregateSchema"
);
export type TestQuestionsAggregate = z.infer<typeof TestQuestionsAggregateSchema>;

export const CreateTestBodySchema = ChuoiDocument.registerSchema(
	z.object({
		test: TestCoreSchema.omit({
			id: true,
			authorId: true,
		}),
		questions: z.array(QuestionCoreSchema.omit({
			id: true,
			testId: true,
		})),
	}),
	"CreateTestBodySchema"
);
export type CreateTestBody = z.infer<typeof CreateTestBodySchema>;

export const UpdateTestBodySchema = ChuoiDocument.registerSchema(
	CreateTestBodySchema.extend({
		testId: z.string(),
	}),
	"UpdateTestBodySchema"
);
export type UpdateTestBody = z.infer<typeof UpdateTestBodySchema>;

