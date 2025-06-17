import { z } from "zod";
import { ExamResourceSchema } from "./exam/resource.schema";
import { PracticeResourceSchema } from "./practice/resource.schema";

const TestInheritanceSchema = z.discriminatedUnion("mode", [
	ExamResourceSchema,
	PracticeResourceSchema,
]);

export const TestBaseSchema = z.object({
	id: z.string(),
	authorId: z.string(),
	title: z.string(),
	description: z.string(),
	minutesToAnswer: z.number().min(1).max(10000),
	language: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),

	child: TestInheritanceSchema,
});

export type TestBaseSchemaType = z.infer<typeof TestBaseSchema>;