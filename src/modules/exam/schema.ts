import { z } from "zod";
import { TestInfoSchema } from "../../domain/schema/info.schema";
import { ExamTestCoreSchema } from "../../domain/schema/core.schema";

export const ExamTestInfoSchema = z.object({
	exam: ExamTestCoreSchema,
	test: TestInfoSchema,
});

export type ExamTestInfo = z.infer<typeof ExamTestInfoSchema>;